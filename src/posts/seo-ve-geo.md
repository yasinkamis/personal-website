---
title: SEO and GEO — Being Found by Search Engines and AI
titleTr: SEO ve GEO — Arama Motorlarında ve Yapay Zekâda Bulunmak
date: 2026-11-22
excerpt: Classic SEO gets you into Google. GEO gets you cited by ChatGPT, Perplexity and friends. Here's how to do both.
excerptTr: Klasik SEO seni Google'a sokar. GEO ise ChatGPT, Perplexity ve diğerlerinde kaynak gösterilmeni sağlar. İkisini birden nasıl yaparsın?
tags: seo, geo, performance, frontend
---

For fifteen years "being found online" meant one thing: ranking on Google. That's
still true, but there's a second channel now — **generative engines** like ChatGPT,
Perplexity, Gemini and Claude that answer questions directly and cite sources.
Optimizing for them is called **GEO (Generative Engine Optimization)**.

The good news: they overlap a lot.

## SEO fundamentals that still matter

- **Server-rendered, crawlable HTML.** If your content only appears after JS runs,
  you're making crawlers work harder. SSR/SSG (Next.js) or prerendering helps.
- **One clear `<title>` and `<meta name="description">` per page.**
- **Semantic HTML** — real `<h1>`–`<h3>`, `<article>`, `<nav>`, `<main>`.
- **Fast Core Web Vitals.** Speed is a ranking factor; see my Lighthouse post.
- **`sitemap.xml` and `robots.txt`.**
- **Canonical URLs** to avoid duplicate-content splits.
- **Open Graph + Twitter cards** for rich link previews.

## Structured data (the bridge between SEO and GEO)

JSON-LD tells machines what your page *means*, not just what it says. A `Person`,
`Article`, `Product` or `FAQ` schema makes you eligible for rich results **and**
gives AI engines clean, unambiguous facts to quote.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO and GEO",
  "author": { "@type": "Person", "name": "Yasin Kamış" },
  "datePublished": "2026-11-22"
}
</script>
```

## What GEO adds on top

- **Let AI crawlers in.** In `robots.txt`, explicitly allow `GPTBot`,
  `PerplexityBot`, `ClaudeBot`, `Google-Extended` and others.
- **Write extractable answers.** Lead with the direct answer, then explain. AI
  engines quote self-contained paragraphs well.
- **Be the primary source.** Clear definitions, specific numbers, and dated facts
  get cited more than vague marketing copy.
- **Consistent entity info** across your site and profiles (same name, same links)
  — this is what `sameAs` in structured data is for.

## The honest summary

> Good SEO and good GEO are mostly the same thing: **fast, semantic, well-structured
> pages that state facts clearly.** Do that, add structured data, open the door to AI
> crawlers, and you'll be found by both humans and machines.

<!--tr-->

On beş yıl boyunca "internette bulunmak" tek bir şey demekti: Google'da üst sıralarda
yer almak. Bu hâlâ geçerli, ama artık ikinci bir kanal var — soruları doğrudan
yanıtlayıp kaynak gösteren **üretken motorlar** (ChatGPT, Perplexity, Gemini, Claude).
Bunlara göre optimizasyona **GEO (Generative Engine Optimization)** deniyor.

İyi haber: ikisi büyük ölçüde örtüşüyor.

## Hâlâ önemli olan SEO temelleri

- **Sunucuda render edilmiş, taranabilir HTML.** İçeriğin yalnızca JS çalıştıktan
  sonra görünüyorsa botları zorlarsın. SSR/SSG (Next.js) veya prerender yardımcı olur.
- **Sayfa başına tek, net `<title>` ve `<meta name="description">`.**
- **Anlamsal (semantic) HTML** — gerçek `<h1>`–`<h3>`, `<article>`, `<nav>`, `<main>`.
- **Hızlı Core Web Vitals.** Hız bir sıralama faktörü; Lighthouse yazıma bak.
- **`sitemap.xml` ve `robots.txt`.**
- **Canonical URL'ler** ile yinelenen içerik bölünmesini önle.
- Zengin bağlantı önizlemeleri için **Open Graph + Twitter card**.

## Yapılandırılmış veri (SEO ile GEO arasındaki köprü)

JSON-LD, makinelere sayfanın ne *söylediğini* değil ne *anlama geldiğini* anlatır.
Bir `Person`, `Article`, `Product` veya `FAQ` şeması seni zengin sonuçlara uygun
hale getirir **ve** yapay zekâ motorlarına alıntılayabilecekleri temiz, net gerçekler sunar.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO ve GEO",
  "author": { "@type": "Person", "name": "Yasin Kamış" },
  "datePublished": "2026-11-22"
}
</script>
```

## GEO'nun üstüne kattıkları

- **AI botlarını içeri al.** `robots.txt` içinde `GPTBot`, `PerplexityBot`,
  `ClaudeBot`, `Google-Extended` ve diğerlerine açıkça izin ver.
- **Alıntılanabilir cevaplar yaz.** Önce doğrudan cevabı ver, sonra açıkla. AI
  motorları kendi içinde bütün paragrafları iyi alıntılar.
- **Birincil kaynak ol.** Net tanımlar, somut sayılar ve tarihli gerçekler, muğlak
  pazarlama metninden daha çok kaynak gösterilir.
- **Tutarlı varlık bilgisi** — sitende ve profillerinde aynı isim, aynı bağlantılar.
  Yapılandırılmış verideki `sameAs` tam da bunun içindir.

## Dürüst özet

> İyi SEO ile iyi GEO çoğunlukla aynı şeydir: **hızlı, anlamsal, iyi yapılandırılmış
> ve gerçekleri net ifade eden sayfalar.** Bunu yap, yapılandırılmış veri ekle, AI
> botlarına kapıyı aç — hem insanlar hem makineler seni bulsun.
