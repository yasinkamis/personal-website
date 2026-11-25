---
title: Publishing Your Own npm Package — From Code to `npm install`
titleTr: Kendi npm Paketini Yayınlamak — Koddan `npm install`'a
date: 2026-11-21
excerpt: Turning a useful utility into a real, installable package is easier than you think. Here's the full path.
excerptTr: Faydalı bir yardımcıyı gerçek, kurulabilir bir pakete dönüştürmek sandığından kolay. İşte tüm yol.
tags: npm, tooling, open-source, typescript
---

Every developer has that one `utils.ts` they copy between projects. The moment you
copy it a third time, it wants to be a package. Here's how to make that happen.

## 1. Set up the project

```bash
mkdir my-lib && cd my-lib
npm init -y
npm install -D typescript tsup
```

**tsup** (built on esbuild) bundles TS to both ESM and CJS with types, with almost
zero config — perfect for small libraries.

## 2. Write the code

```ts
// src/index.ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

## 3. Configure `package.json` correctly

This is the part people get wrong. Modern dual-format packages need proper `exports`:

```json
{
  "name": "@yasinkamis/slugify",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean"
  }
}
```

- **`files`** controls what ships — ship `dist`, not your whole repo.
- **`exports`** is what lets both `import` and `require` work.
- Always ship **types** (`.d.ts`) — a TS library without types is half a library.

## 4. Test it locally before publishing

```bash
npm run build
npm pack        # creates a .tgz exactly as it would publish
```

Install that tarball in another project to verify it actually works. `npm link` is
handy too, but `npm pack` catches "files" mistakes that `link` hides.

## 5. Publish

```bash
npm login
npm publish --access public   # 'public' is required for scoped @name packages
```

## 6. Be a good maintainer

- **Semantic versioning**: patch for fixes, minor for features, major for breaking
  changes. People trust this.
- Add a **README with a usage example** — it's the first thing anyone reads.
- A tiny **test** (Vitest) and a CI check go a long way.
- Consider a `prepublishOnly: "npm run build"` script so you never publish stale code.

> The first publish feels like a big deal. It isn't — it's `npm publish`. The craft is
> in the `package.json`, the types, and treating the people who install it with care.

<!--tr-->

Her geliştiricinin projeler arasında kopyaladığı bir `utils.ts` dosyası vardır. Onu
üçüncü kez kopyaladığın an, o dosya artık bir paket olmak ister. İşte nasıl olacağı.

## 1. Projeyi kur

```bash
mkdir my-lib && cd my-lib
npm init -y
npm install -D typescript tsup
```

**tsup** (esbuild üzerine kurulu) TS'i hem ESM hem CJS'e, tiplerle birlikte,
neredeyse sıfır konfigürasyonla bundle'lar — küçük kütüphaneler için mükemmel.

## 2. Kodu yaz

```ts
// src/index.ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

## 3. `package.json`'ı doğru yapılandır

İnsanların en çok yanlış yaptığı kısım burası. Modern çift-formatlı paketler düzgün
bir `exports` ister:

```json
{
  "name": "@yasinkamis/slugify",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean"
  }
}
```

- **`files`** neyin yayınlanacağını belirler — tüm repoyu değil, `dist`'i gönder.
- **`exports`** hem `import` hem `require`'ın çalışmasını sağlar.
- Her zaman **tipleri** (`.d.ts`) gönder — tipsiz bir TS kütüphanesi yarım kütüphanedir.

## 4. Yayınlamadan önce yerelde test et

```bash
npm run build
npm pack        # yayınlanacağı hâliyle bir .tgz üretir
```

Bu tarball'ı başka bir projede kurup gerçekten çalıştığını doğrula. `npm link` de
pratiktir ama `npm pack`, `link`'in gizlediği "files" hatalarını yakalar.

## 5. Yayınla

```bash
npm login
npm publish --access public   # @isim'li (scoped) paketler için 'public' gerekir
```

## 6. İyi bir bakımcı ol

- **Anlamsal sürümleme**: düzeltmeler için patch, özellikler için minor, kırıcı
  değişiklikler için major. İnsanlar buna güvenir.
- **Kullanım örnekli bir README** ekle — herkesin okuduğu ilk şey odur.
- Küçük bir **test** (Vitest) ve bir CI kontrolü çok işe yarar.
- `prepublishOnly: "npm run build"` script'i ekle ki asla eski kodu yayınlamayasın.

> İlk yayın büyük bir olay gibi gelir. Değildir — sadece `npm publish`'tir. Asıl
> ustalık `package.json`'da, tiplerde ve paketini kuranlara özenli davranmaktadır.
