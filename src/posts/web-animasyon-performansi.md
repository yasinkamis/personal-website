---
title: Animation Performance on the Web — Hitting a Steady 60fps
titleTr: Web'de Animasyon Performansı — Sabit 60fps'i Yakalamak
date: 2026-11-23
excerpt: Smooth animation isn't about doing more — it's about animating the right properties and respecting the browser's rendering pipeline.
excerptTr: Akıcı animasyon daha çok şey yapmak değildir — doğru özellikleri canlandırmak ve tarayıcının render hattına saygı duymaktır.
tags: performance, animation, gsap, css
---

A janky animation is almost never a "weak device" problem. It's usually us asking the
browser to do expensive work on every frame. To fix it, you need to know what a frame
actually costs.

## The rendering pipeline

Every frame the browser can run up to four stages:

1. **Style** — compute which CSS rules apply
2. **Layout** — figure out geometry (position, size)
3. **Paint** — fill in pixels (colors, text, shadows)
4. **Composite** — assemble layers on the GPU

At 60fps you have ~**16.7ms per frame**. Trigger layout and paint on every frame and
you'll blow that budget fast.

## Animate only `transform` and `opacity`

These two can be handled almost entirely by the **compositor on the GPU** — no layout,
no paint. That's the single most important rule of web animation.

```css
/* ❌ triggers layout every frame */
.box { left: 0; transition: left 0.3s; }

/* ✅ composited, cheap */
.box { transform: translateX(0); transition: transform 0.3s; }
```

Same visual result, completely different cost.

## Hint with `will-change` — sparingly

`will-change: transform` promotes an element to its own layer so the GPU is ready.
Use it on elements you're about to animate, not on everything — too many layers eats
memory and can make things *slower*.

## Measure, don't guess

Open DevTools → **Performance**, record, and look for:

- Long purple **Layout** / green **Paint** bars during animation
- Frames exceeding the 16.7ms line
- "Layout shift" and "forced reflow" warnings

A forced reflow (reading `offsetHeight` right after writing a style) is a classic
frame-killer. Batch your reads, then your writes.

## Let the right tool drive

For scroll-driven and timeline work I use **GSAP** — it animates transforms, batches
updates, and syncs cleanly with a smooth-scroll library like **Lenis**. For simple
state transitions, plain CSS transitions are lighter. Don't ship a library for a
hover effect.

> Rule of thumb: if it moves, it should move with `transform`. If it fades, `opacity`.
> Everything else, measure before you animate it.

<!--tr-->

Takılan (janky) bir animasyon neredeyse hiçbir zaman "zayıf cihaz" sorunu değildir.
Genelde tarayıcıdan her karede pahalı işler yapmasını istememizden kaynaklanır.
Düzeltmek için bir karenin gerçekte ne kadara mal olduğunu bilmen gerekir.

## Render hattı (rendering pipeline)

Tarayıcı her karede dört aşamaya kadar çalışabilir:

1. **Style** — hangi CSS kurallarının geçerli olduğunu hesaplar
2. **Layout** — geometriyi çıkarır (konum, boyut)
3. **Paint** — pikselleri doldurur (renk, metin, gölge)
4. **Composite** — katmanları GPU'da birleştirir

60fps'te kare başına ~**16.7ms** vaktin var. Her karede layout ve paint tetiklersen
bu bütçeyi hızla aşarsın.

## Yalnızca `transform` ve `opacity` canlandır

Bu ikisi neredeyse tamamen **GPU'daki compositor** tarafından işlenebilir — layout yok,
paint yok. Web animasyonunun en önemli kuralı budur.

```css
/* ❌ her karede layout tetikler */
.box { left: 0; transition: left 0.3s; }

/* ✅ composite edilir, ucuz */
.box { transform: translateX(0); transition: transform 0.3s; }
```

Aynı görsel sonuç, tamamen farklı maliyet.

## `will-change` ile ipucu ver — ölçülü şekilde

`will-change: transform` bir elemanı kendi katmanına yükseltir, böylece GPU hazır olur.
Her şeye değil, az sonra canlandıracağın elemanlara uygula — çok fazla katman belleği
yer ve işleri *yavaşlatabilir*.

## Tahmin etme, ölç

DevTools → **Performance**, kaydet ve şunlara bak:

- Animasyon sırasında uzun mor **Layout** / yeşil **Paint** çubukları
- 16.7ms çizgisini aşan kareler
- "Layout shift" ve "forced reflow" uyarıları

Forced reflow (bir stili yazdıktan hemen sonra `offsetHeight` okumak) klasik bir
kare katilidir. Önce okumaları, sonra yazmaları grupla.

## İşi doğru araca bırak

Scroll tabanlı ve zaman çizelgeli işler için **GSAP** kullanırım — transform'ları
canlandırır, güncellemeleri gruplar ve **Lenis** gibi akıcı kaydırma kütüphanesiyle
temiz senkronize olur. Basit state geçişleri için düz CSS transition daha hafiftir.
Bir hover efekti için kütüphane yükleme.

> Kural: hareket ediyorsa `transform` ile etsin. Soluyorsa `opacity`. Geri kalan her
> şeyi, canlandırmadan önce ölç.
