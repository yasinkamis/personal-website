---
title: Writing Custom Hooks That Are Actually Reusable
titleTr: Gerçekten Yeniden Kullanılabilir Custom Hook'lar Yazmak
date: 2026-11-19
excerpt: A custom hook is just a function that uses hooks — but a good one has a clean API, stable references and no surprises.
excerptTr: Custom hook, hook kullanan bir fonksiyondan ibarettir — ama iyisi temiz bir API'ye, kararlı referanslara ve sürprizsiz davranışa sahiptir.
tags: react, hooks, typescript, patterns
---

Custom hooks are React's primary tool for sharing **stateful logic** between
components. The rule is simple — a function whose name starts with `use` and which
calls other hooks. The craft is in making one that's a pleasure to use.

## A real example: `useDebouncedValue`

```ts
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

Usage:

```tsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebouncedValue(query, 400);
// fetch only when debouncedQuery changes
```

One small hook removes a whole class of "firing on every keystroke" bugs.

## Principles for good hooks

**1. Return a stable shape.** Prefer a tuple `[value, setValue]` or a well-named
object. Keep the order and keys consistent across versions.

**2. Memoize what you return.** If you return functions or objects, wrap them in
`useCallback`/`useMemo` so consumers can safely put them in dependency arrays.

```ts
const toggle = useCallback(() => setOn(o => !o), []);
```

**3. Always clean up.** Timers, subscriptions, event listeners and abort controllers
must be torn down in the effect's cleanup. A hook that leaks is worse than inline code.

**4. Handle SSR.** Guard `window`/`document` access so the hook doesn't crash during
server rendering:

```ts
const isClient = typeof window !== 'undefined';
```

**5. One responsibility.** `useUser` fetches the user. It shouldn't also manage a
modal. Small hooks compose; kitchen-sink hooks don't.

## Compose, don't duplicate

Hooks call hooks. Build bigger behavior from smaller pieces:

```ts
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

`as const` is the small touch that gives callers a proper `[value, setter]` tuple type.

> A good custom hook feels like a built-in one: predictable name, clean return,
> stable references, and it cleans up after itself. Extract logic into a hook the
> moment two components need it — not before.

<!--tr-->

Custom hook'lar, React'in bileşenler arasında **durumlu (stateful) mantığı**
paylaşmak için temel aracıdır. Kural basit — adı `use` ile başlayan ve başka hook'lar
çağıran bir fonksiyon. Asıl ustalık, kullanması keyifli bir tane yapmaktır.

## Gerçek bir örnek: `useDebouncedValue`

```ts
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

Kullanım:

```tsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebouncedValue(query, 400);
// yalnızca debouncedQuery değiştiğinde fetch et
```

Küçük bir hook, "her tuş vuruşunda tetiklenme" hatalarının tüm bir sınıfını ortadan kaldırır.

## İyi hook'lar için ilkeler

**1. Kararlı bir şekil döndür.** Bir tuple `[value, setValue]` ya da iyi adlandırılmış
bir nesne tercih et. Sürümler arası sıra ve anahtarları tutarlı tut.

**2. Döndürdüğünü memoize et.** Fonksiyon veya nesne döndürüyorsan, tüketiciler bunları
güvenle bağımlılık dizisine koyabilsin diye `useCallback`/`useMemo` ile sar.

```ts
const toggle = useCallback(() => setOn(o => !o), []);
```

**3. Her zaman temizle.** Timer'lar, abonelikler, event listener'lar ve abort
controller'lar effect'in cleanup'ında kapatılmalı. Sızdıran bir hook, satır içi
koddan beterdir.

**4. SSR'ı düşün.** Sunucuda render sırasında çökmemesi için `window`/`document`
erişimini koru:

```ts
const isClient = typeof window !== 'undefined';
```

**5. Tek sorumluluk.** `useUser` kullanıcıyı çeker. Aynı zamanda bir modal'ı
yönetmemeli. Küçük hook'lar birleşir; her işi yapan hook'lar birleşmez.

## Çoğaltma, birleştir

Hook'lar hook çağırır. Büyük davranışı küçük parçalardan kur:

```ts
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

`as const`, çağıranlara düzgün bir `[value, setter]` tuple tipi veren o küçük dokunuştur.

> İyi bir custom hook, yerleşik bir hook gibi hissettirir: tahmin edilebilir isim,
> temiz dönüş, kararlı referanslar ve kendi ardından temizlik yapar. Mantığı bir
> hook'a, iki bileşen ona ihtiyaç duyduğu an çıkar — daha önce değil.
