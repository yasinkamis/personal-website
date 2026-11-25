---
title: Scoring 100 on Lighthouse — And Why the Number Isn't the Point
titleTr: Lighthouse'da 100 Almak — ve Neden Asıl Mesele O Sayı Değil
date: 2026-11-18
excerpt: A perfect Lighthouse score is a byproduct of real performance work. Here's the checklist I actually use.
excerptTr: Mükemmel bir Lighthouse puanı, gerçek performans çalışmasının bir yan ürünüdür. İşte gerçekten kullandığım kontrol listesi.
tags: performance, lighthouse, core-web-vitals, seo
---

Chasing a green "100" can turn into theater. But when you earn it honestly, your users
feel it — faster loads, less layout jump, better accessibility. Lighthouse scores four
areas: **Performance, Accessibility, Best Practices, SEO.** Here's how I take each one
to the top.

## Performance — the hard one

Performance is dominated by **Core Web Vitals**:

- **LCP (Largest Contentful Paint)** — how fast the main content shows.
- **CLS (Cumulative Layout Shift)** — how much the page jumps.
- **INP (Interaction to Next Paint)** — how responsive it feels.

What moves the needle:

- **Ship less JavaScript.** Code-split routes, lazy-load heavy components, and audit
  the bundle. The fastest script is the one you don't send.
- **Optimize images.** Modern formats (AVIF/WebP), correct `width`/`height` to reserve
  space (kills CLS), `loading="lazy"` for below-the-fold, and a real `srcset`.
- **Preload the LCP asset**, and `preconnect` to font/CDN origins.
- **Tame fonts.** `font-display: swap`, self-host or preload, and avoid loading six weights.
- **Reserve space** for anything that loads late (images, ads, embeds) so nothing shifts.
- **Cache aggressively** with immutable hashed filenames on a CDN.

```html
<link rel="preload" as="image" href="/hero.avif" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Accessibility — mostly free points

- Real semantic elements and a logical heading order.
- `alt` text on meaningful images; empty `alt=""` on decorative ones.
- Sufficient **color contrast** (4.5:1 for body text).
- Labels tied to inputs; visible focus states; `aria-label` where text is missing.
- Respect `prefers-reduced-motion` for animations.

## Best Practices

- Serve over **HTTPS**.
- No console errors.
- Correct image aspect ratios.
- Avoid deprecated APIs and keep dependencies reasonably current.

## SEO

- A unique `<title>` and meta description.
- Crawlable content, `robots.txt`, a sitemap, and valid structured data.
- Mobile-friendly viewport and tap targets. (See my SEO/GEO post.)

## How to actually measure

Run Lighthouse in an **incognito window** (extensions skew results), or use the CLI /
**PageSpeed Insights** for field data. Lab numbers are a guide; real-user metrics (RUM)
are the truth.

> A 100 is nice. The real win is the user on a mid-range phone and a weak connection
> who gets a fast, stable, usable page. Optimize for *them*, and the score follows.

<!--tr-->

Yeşil bir "100" peşinde koşmak gösterişe dönüşebilir. Ama onu dürüstçe hak ettiğinde
kullanıcıların bunu hisseder — daha hızlı yükleme, daha az kayma, daha iyi erişilebilirlik.
Lighthouse dört alanı puanlar: **Performans, Erişilebilirlik, En İyi Uygulamalar, SEO.**
İşte her birini zirveye nasıl çıkardığım.

## Performans — zor olan

Performansa **Core Web Vitals** hâkimdir:

- **LCP (Largest Contentful Paint)** — ana içeriğin ne kadar hızlı göründüğü.
- **CLS (Cumulative Layout Shift)** — sayfanın ne kadar zıpladığı.
- **INP (Interaction to Next Paint)** — ne kadar tepkisel hissettirdiği.

İğneyi oynatan şeyler:

- **Daha az JavaScript gönder.** Route'ları code-split et, ağır bileşenleri lazy-load
  et ve bundle'ı denetle. En hızlı script, göndermediğindir.
- **Görselleri optimize et.** Modern formatlar (AVIF/WebP), yer ayırmak için doğru
  `width`/`height` (CLS'i öldürür), ekran altı için `loading="lazy"` ve gerçek bir `srcset`.
- **LCP varlığını preload et**, font/CDN kaynaklarına `preconnect` yap.
- **Fontları ehlileştir.** `font-display: swap`, kendi sunucunda barındır veya preload
  et, altı farklı ağırlık yüklemekten kaçın.
- Geç yüklenen her şey için (görsel, reklam, embed) **yer ayır** ki hiçbir şey kaymasın.
- CDN üzerinde değişmez (immutable), hash'li dosya adlarıyla **agresif cache** uygula.

```html
<link rel="preload" as="image" href="/hero.avif" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Erişilebilirlik — çoğunlukla bedava puan

- Gerçek anlamsal elemanlar ve mantıklı bir başlık sırası.
- Anlamlı görsellerde `alt` metni; dekoratif olanlarda boş `alt=""`.
- Yeterli **renk kontrastı** (gövde metni için 4.5:1).
- Input'lara bağlı etiketler; görünür focus durumları; metin yoksa `aria-label`.
- Animasyonlarda `prefers-reduced-motion`'a saygı.

## En İyi Uygulamalar

- **HTTPS** üzerinden sun.
- Konsol hatası olmasın.
- Doğru görsel en-boy oranları.
- Kullanımdan kalkmış API'lerden kaçın, bağımlılıkları makul ölçüde güncel tut.

## SEO

- Benzersiz bir `<title>` ve meta açıklama.
- Taranabilir içerik, `robots.txt`, bir sitemap ve geçerli yapılandırılmış veri.
- Mobil uyumlu viewport ve dokunma hedefleri. (SEO/GEO yazıma bak.)

## Nasıl doğru ölçülür

Lighthouse'u **gizli pencerede** çalıştır (eklentiler sonucu bozar) veya saha verisi
için CLI / **PageSpeed Insights** kullan. Lab sayıları bir rehberdir; gerçek kullanıcı
metrikleri (RUM) ise gerçeğin ta kendisidir.

> 100 güzeldir. Asıl kazanım, orta seviye bir telefonda ve zayıf bir bağlantıda hızlı,
> kararlı, kullanılabilir bir sayfa elde eden kullanıcıdır. *Onun* için optimize et,
> puan arkadan gelir.
