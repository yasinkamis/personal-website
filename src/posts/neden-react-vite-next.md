---
title: Why React — and When to Reach for Vite vs Next.js
titleTr: Neden React — ve Ne Zaman Vite, Ne Zaman Next.js?
date: 2026-11-24
excerpt: React won the frontend, but the real decision is the tool around it. Here's how I choose between Vite and Next.js.
excerptTr: React frontend'i kazandı, ama asıl karar etrafındaki araç. Vite ile Next.js arasında nasıl seçim yapıyorum?
tags: react, vite, nextjs, architecture
---

React didn't win because it was the fastest or the smallest library. It won because
of its **mental model**: your UI is a function of state. Describe what the screen
should look like for a given state, and React figures out the DOM updates.

That single idea — declarative, component-based UI — is why React scales from a
weekend project to a product with hundreds of engineers.

## So why do people still argue about it?

Because "using React" is only half a decision. The other half is the **tooling and
rendering strategy** around it. That's where Vite and Next.js come in, and they
solve different problems.

## When I reach for Vite

Vite is a build tool and dev server. It gives you a near-instant dev experience
(native ESM + esbuild) and a clean production build via Rollup. I pick it when:

- The app is a **client-side SPA** — dashboards, internal tools, portfolios, games
- I don't need server-side rendering or server endpoints
- I want **full control** over routing, data fetching and structure
- Build speed and a minimal, transparent setup matter

This very site is a Vite SPA. No server, just static files on a CDN.

## When I reach for Next.js

Next.js is a **framework**. It brings routing, rendering strategies (SSR, SSG, ISR),
server components, API routes and image optimization. I pick it when:

- **SEO matters** and content must be server-rendered
- I need **server code next to the UI** (auth, DB access, API routes)
- The app has many routes and benefits from file-based routing
- I want built-in performance primitives without wiring them myself

## A simple rule of thumb

> If the page needs to be **fast to a crawler or a first-time visitor on arrival**,
> think Next.js. If it's an **app you log into and interact with**, Vite is often
> lighter and simpler.

Neither is "better." Vite is a sharp knife; Next.js is a full kitchen. Pick the one
that matches the meal.

<!--tr-->

React en hızlı ya da en küçük kütüphane olduğu için kazanmadı. **Zihinsel modeli**
sayesinde kazandı: arayüzün, state'in bir fonksiyonudur. Belirli bir state için
ekranın nasıl görünmesi gerektiğini tarif edersin, DOM güncellemelerini React halleder.

Bu tek fikir — bildirimsel (declarative), bileşen tabanlı arayüz — React'in bir
hafta sonu projesinden yüzlerce mühendisli bir ürüne kadar ölçeklenmesinin sebebi.

## Peki neden hâlâ tartışılıyor?

Çünkü "React kullanmak" kararın sadece yarısı. Diğer yarısı etrafındaki
**araçlar ve render stratejisi**. İşte Vite ve Next.js burada devreye giriyor ve
farklı problemleri çözüyorlar.

## Ne zaman Vite?

Vite bir build aracı ve dev sunucusu. Neredeyse anlık bir geliştirme deneyimi
(native ESM + esbuild) ve Rollup ile temiz bir production build verir. Şunlarda seçerim:

- Uygulama **istemci taraflı bir SPA** ise — paneller, iç araçlar, portfolyolar, oyunlar
- Sunucu taraflı render veya sunucu uçlarına ihtiyacım yoksa
- Yönlendirme, veri çekme ve yapı üzerinde **tam kontrol** istiyorsam
- Build hızı ve minimal, şeffaf bir kurulum önemliyse

Bu sitenin kendisi bir Vite SPA. Sunucu yok, sadece CDN üzerinde statik dosyalar.

## Ne zaman Next.js?

Next.js bir **framework**. Yönlendirme, render stratejileri (SSR, SSG, ISR), server
component'ler, API route'lar ve görsel optimizasyonu getirir. Şunlarda seçerim:

- **SEO önemliyse** ve içerik sunucuda render edilmeliyse
- Arayüzün yanında **sunucu kodu** gerekiyorsa (auth, veritabanı, API route'lar)
- Çok sayıda route varsa ve dosya tabanlı yönlendirme işe yarıyorsa
- Performans primitiflerini elle kurmadan hazır istiyorsam

## Basit bir kural

> Sayfanın **bir tarayıcı botuna veya ilk kez gelen ziyaretçiye anında hızlı**
> olması gerekiyorsa Next.js düşün. **İçine giriş yapıp etkileşime geçtiğin bir
> uygulama** ise Vite çoğu zaman daha hafif ve basittir.

İkisi de "daha iyi" değil. Vite keskin bir bıçak; Next.js tam donanımlı bir mutfak.
Yemeğe uygun olanı seç.
