# Tedarika Satıcı Paneli – Proje Mimarisi ve Tasarım Sözleşmesi

Bu doküman, **yapay zeka veya geliştirici**nin projeyi anlayıp aynı mimariyi ve tasarım dilini uygulayabilmesi için yazılmıştır. Giriş öncesi/sonrası ayrımı, header/layout yapısı, klasörleme, CSS ve bileşen tasarım kuralları tek bir referansta toplanmıştır.

**İlişkili doküman:** `KULLANICI_SUREÇLERI_VE_TASARIM_REFERANSI.md` (kullanıcı akışları, yönlendirmeler, mobil özet).

---

## 1. Genel Mimari Özet

### 1.1 İki Ana Bölge

| Bölge | Açıklama | Layout | Header |
|-------|----------|--------|--------|
| **Giriş öncesi (public)** | Landing, Login, Register, Şifremi Unuttum, Başvuru, Satıcı Merkezi, Kurumsal sayfalar | Sayfa bazlı, ortak header/footer | `SellerHeader` |
| **Giriş sonrası (protected)** | Dashboard, Profil, Ürünler, Siparişler vb. satıcı paneli | Tek layout: Sidebar + Topbar + main | `Topbar` (layout içinde) |

### 1.2 Rota Kararı ve Layout Kullanımı

- **React Router** ile `Routes` / `Route` kullanılır.
- **Public rotalar** doğrudan sayfa bileşenini render eder; sayfa kendi içinde `SellerHeader` ve gerekirse footer kullanır.
- **Korumalı alan** tek bir üst rota altında toplanır: `path="/seller/*"` → `PrivateRoute` → `SellerRouteWrapper` → (şirket yoksa yönlendirme veya) `SellerLayout` + `Outlet`.
- **Layout’suz istisna:** `/seller/company/create` — `SellerRouteWrapper` bu path’te sadece `<Outlet />` döner; Sidebar ve Topbar **gösterilmez**.

### 1.3 Klasör Yapısı (Özet)

```
src/
├── App.jsx                    # Rota tanımları; public / protected ayrımı burada
├── main.jsx
├── index.css                  # Global Tailwind + özel sınıflar (animasyon, scrollbar, modal)
│
├── components/
│   ├── layout/                # Giriş sonrası layout bileşenleri
│   │   ├── SellerLayout.jsx   # Ana şablon: Sidebar + Topbar + main + overlay’ler
│   │   ├── Topbar.jsx         # Giriş sonrası header
│   │   ├── Sidebar.jsx        # Sol navigasyon (masaüstü daraltılabilir, mobil overlay)
│   │   └── UserMenu.jsx       # Topbar’daki kullanıcı dropdown
│   │
│   ├── sellerLanding/         # Giriş öncesi / landing bileşenleri
│   │   ├── SellerHeader.jsx   # Public header (logo, nav, Kayıt Ol / Giriş Yap)
│   │   ├── HeroSection.jsx, Footer.jsx, ...
│   │   └── ...
│   │
│   ├── notifications/        # Bildirim dropdown (Topbar’da kullanılır)
│   ├── seller/               # Satıcıya özel kartlar, formlar
│   ├── ui/                   # Genel UI (DataTable, TableContainer, ...)
│   └── ...
│
├── pages/
│   ├── seller/               # Satıcı sayfaları
│   │   ├── SellerLandingPage.jsx   # Anasayfa (public)
│   │   ├── LoginPage.jsx, RegisterPage.jsx, ...
│   │   ├── DashboardPage.jsx       # Giriş sonrası ilk sayfa
│   │   ├── profile/, company/, store/, products/, orders/, ...
│   │   └── ...
│   ├── sellerCenter/         # Satıcı Merkezi (public SEO sayfaları)
│   ├── corporate/            # KVKK, Sözleşmeler, Hakkımızda, İletişim
│   └── ...
│
├── routes/
│   ├── PrivateRoute.jsx       # Token + UserType kontrolü
│   ├── SemiPrivateRoute.jsx  # Abonelik sayfası için özel kural
│   └── ...
│
├── contexts/, hooks/, api/, utils/, constants/
└── components/SellerRouteWrapper.jsx   # Şirket kontrolü + layout’suz path kararı
```

**Kural:** Giriş öncesi header ve landing bileşenleri `components/sellerLanding/`; giriş sonrası layout (Topbar, Sidebar, ana içerik alanı) `components/layout/` altındadır.

---

## 2. Giriş Öncesi Tasarım (Public)

### 2.1 Hangi Sayfalar “Giriş Öncesi”?

- `/seller/landing` — Anasayfa
- `/seller/login`, `/seller/register`, `/seller/forgot-password`
- `/seller/apply` — Başvuru
- `/seller/appointment`
- `/corporate/*` — Hakkımızda, İletişim, KVKK, SSS, Sözleşmeler
- `/satici-merkezi/*` — Satıcı Merkezi tüm alt sayfalar

Bu sayfalar **SellerLayout kullanmaz**; kendi sayfa bileşeninde üstte `SellerHeader`, altta isteğe göre `Footer` kullanır.

### 2.2 Anasayfa (Landing) Yapısı

- **Dosya:** `src/pages/seller/SellerLandingPage.jsx`
- **Yapı:** Tek bir `<div className="bg-white">` içinde sırayla:
  1. `SellerHeader`
  2. Hero / impact / vurgu bölümleri (HeroImpactSection, ExportVurgulayanSection, …)
  3. Özellikler, adımlar, fiyatlandırma, CTA, destek formu
  4. `Footer` (corporate)

Sayfa kendi SEO (Helmet), schema ve hreflang’ini yönetir. Ortak üst çerçeve sadece header + footer’dır; ara içerik tamamen sayfa bileşenine aittir.

### 2.3 SellerHeader (Giriş Öncesi Header) – Tasarım ve İçerik

**Dosya:** `src/components/sellerLanding/SellerHeader.jsx`

**Amaç:** Public sayfalarda üst bar: marka, navigasyon, CTA (Kayıt Ol / Giriş Yap).

**CSS / sınıf özeti:**

| Öğe | Sınıf / stil | Açıklama |
|-----|----------------|----------|
| Dış sarmalayıcı | `bg-[#003032] border-b border-white/10 shadow-sm w-full relative z-[100]` | Koyu marka rengi, ince alt çizgi |
| İç container | `mx-auto max-w-7xl px-4 sm:px-6` | Ortalanmış, yatay padding |
| Ana satır | `flex items-center justify-between gap-4 py-1` | Logo sol, nav ve aksiyonlar sağ |

**İçerik yapısı:**

- **Sol:** Logo (img, `/seller/landing`’e link), `h-12 sm:h-20 md:h-28` ile responsive.
- **Masaüstü (lg:)**  
  - Nav: Anasayfa, Fiyatlar; Satıcı Merkezi dropdown; Destek dropdown.  
  - Link stilleri: `text-white`, `hover:text-emerald-300 hover:bg-white/10`, `rounded-lg px-3 py-2`.  
  - Dropdown panel: `absolute left-0 top-full pt-2`, `bg-[#002829] border border-white/10 rounded-lg`, `group-hover:block group-focus-within:block`.
- **Sağ (masaüstü):**  
  - “Kayıt Ol”: `bg-white text-[#003032] font-bold ... rounded-lg hover:bg-emerald-100`  
  - “Giriş Yap”: `border-2 border-white text-white ... rounded-lg hover:bg-white/10`
- **Mobil (lg:hidden):**  
  - Hamburger buton: `min-h-[44px] min-w-[44px]`, `touch-manipulation`, açıkken X ikonu.  
  - Menü: `fixed inset-0 z-[99]`, backdrop `bg-black/50 backdrop-blur-sm`, panel `mt-[72px] mx-3 rounded-2xl bg-[#002829] border border-white/10`, `max-h-[calc(100vh-88px)]`, `paddingBottom: env(safe-area-inset-bottom)`.  
  - Link/buton yüksekliği: `min-h-[48px]`, `touch-manipulation`.

**Erişilebilirlik:** `aria-label`, `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal="true"` kullanılır; Escape ile menü kapanır.

Bu yapıyı kullanan bir yapay zeka, “giriş öncesi header” için aynı renk paleti (#003032, #002829, white, emerald vurgu), aynı responsive kırılımlar (lg için nav, lg:hidden için hamburger + full-screen panel) ve aynı dokunma alanı kurallarını (min-h-44/48) uygulayabilir.

---

## 3. Giriş Sonrası Tasarım (Protected – Satıcı Paneli)

### 3.1 Layout Kararı

- Korumalı tüm sayfalar (şirket oluşturma hariç) **tek bir layout** ile sarılır: `SellerLayout`.
- `SellerRouteWrapper`: path `/seller/company/create` ise sadece `<Outlet />` (layout yok); diğer tüm `/seller/*` sayfalarında `<SellerLayout><div className="relative min-h-screen"><Outlet /></div></SellerLayout>`.

### 3.2 SellerLayout – Yapı ve CSS

**Dosya:** `src/components/layout/SellerLayout.jsx`

**DOM hiyerarşisi:**

```
div.flex.h-screen.w-full.overflow-hidden.relative
├── Sidebar (isOpen, onClose, disabled)
├── div.flex.flex-col.flex-1.min-w-0.bg-gradient-to-br.from-indigo-50.via-purple-50.to-white.relative
│   ├── Topbar (onMenuClick)
│   └── main (ref=mainRef, overflow-y-auto, Outlet)
├── [Opsiyonel] Abonelik / erişim kısıtlı overlay (z-[9999])
└── [Opsiyonel] Mağaza oluştur uyarı banner’ı (fixed, z-[9999])
```

**Ana sınıflar:**

- **Dış:** `flex h-screen w-full overflow-hidden relative`
- **İçerik kolonu (Sidebar’ın yanı):** `flex flex-col flex-1 min-w-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-white relative`
- **Main:**  
  `flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white/60 backdrop-blur-2xl rounded-tl-2xl shadow-inner relative transition`  
  Kısıtlı erişimde: `pointer-events-none opacity-40 blur-sm` eklenir.

**Davranış:**

- Sayfa değişince `mainRef.current.scrollTo(0, 0)`.
- Şirket/mağaza kontrolü ve abonelik kontrolü bu layout içinde yapılır; mağaza yoksa sabit üstte sarı banner, abonelik/sistem aktif değilse tam ekran overlay + “Profil Sayfasına Git” butonu.

Bu yapıyı bilen bir AI, “giriş sonrası ekran” için her zaman Sidebar + Topbar + tek bir scroll eden main alanı ve gerekirse overlay’leri aynı hiyerarşiyle kurgular.

---

**Giriş sonrası header tasarım yapısı (içerik, hizalama, ana/alt başlık):** Tam metin **`docs/GIRIS_SONRASI_HEADER_TASARIM_YAPISI.md`** dosyasındadır.

## 4. Giriş Sonrası Header (Topbar) – Tasarım yapısı

**Dosya:** `src/components/layout/Topbar.jsx`

Giriş (login) sonrası ekranda görünen üst çubuk **Topbar**’dır. Aşağıda yalnızca bu header’ın **içerik düzeni**, **hizalama**, **ana başlık** ve **alt başlık** yapısı anlatılır.

### 4.1 Genel Yapı ve Hizalama

- **Tek satır:** Header tek bir yatay satırdan oluşur; içerik `flex items-center justify-between` ile **sol blok** ve **sağ blok** olarak ikiye ayrılır.
- **Dikey hizalama:** Tüm öğeler `items-center` ile satır ortasında hizalıdır.
- **Yatay boşluk:** Dış padding `px-3 sm:px-4 md:px-5`, dikey `py-2.5 sm:py-3 md:py-4` (ekran büyüdükçe artar).
- **Sol blok:** `flex-1` ve `min-w-0` ile kalan alanı kaplar, taşan metin kesilir.
- **Sağ blok:** `flex-shrink-0` ile küçülmez; içerik sığdığı kadar yer kaplar.

### 4.2 Sol Blok İçeriği (Sıra ve Hizalama)

Soldan sağa sıra:

1. **Menü butonu** (sadece mobil, `md:hidden`)  
   - Hamburger ikonu.  
   - Hizalama: Sol kenara yapışık, diğer öğelerle `gap-2 sm:gap-3 md:gap-4`.

2. **Logo/ikon kutusu** (`hidden sm:flex`)  
   - Kare kutu: `w-8 h-8 sm:w-10 sm:h-10`, `rounded-xl`, gradient arka plan, içinde “T”.  
   - Başlıkla aynı hizada; arasında `gap-2 sm:gap-3`.

3. **Başlık alanı** (ana + alt başlık)  
   - Tek bir `div` içinde **dikey** hizalı iki metin:
     - **Ana başlık:** “Satıcı Paneli”
     - **Alt başlık:** “Profesyonel Satış Yönetimi”

### 4.3 Ana Başlık (“Satıcı Paneli”)

- **Metin:** Sabit: **Satıcı Paneli**.
- **Görünüm:** Beyaz tonunda gradient metin: `bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent`.
- **Tipografi:**  
  - `font-extrabold`, `tracking-tight`, `select-none`, `drop-shadow-lg`.  
  - Responsive boyut: `text-lg sm:text-xl md:text-2xl lg:text-3xl` (ekran büyüdükçe büyür).
- **Taşma:** `truncate` ile uzun metin tek satırda kesilir; kutu `min-w-0` ile daralabilir.
- **Hizalama:** Sol blokta, logo/ikonun hemen sağında; blok içinde sola hizalı (default).

### 4.4 Alt Başlık (“Profesyonel Satış Yönetimi”)

- **Metin:** Sabit: **Profesyonel Satış Yönetimi**.
- **Görünürlük:** Sadece orta ve büyük ekran: `hidden md:block` (mobil ve küçük tablette **gösterilmez**).
- **Tipografi:** `text-xs`, `font-medium`, renk `text-emerald-200/80`.
- **Konum:** Ana başlığın hemen altında; `mt-0.5` ile ana başlıktan kısa boşluk.
- **Hizalama:** Ana başlıkla aynı sol hizada; iki satır birlikte dikey blok oluşturur.

Özet: Ana başlık her zaman (sm ve üzeri) görünür; alt başlık yalnızca **md ve üzeri** breakpoint’te, ana başlığın altında tek satır olarak yer alır.

### 4.5 Sağ Blok İçeriği (Sıra ve Hizalama)

Sağdan sola (içerik sırası):

1. **“Başvuru Yap” linki**  
   - Yalnızca token yoksa gösterilir.  
   - Sağ blokta ilk öğe; diğer öğelerle `gap-2 sm:gap-3 md:gap-4`.

2. **Bildirim alanı** (`NotificationDropdown`)  
   - Token varken gösterilir.  
   - `flex-shrink-0` ile sabit genişlik.

3. **Kullanıcı metin bilgisi** (sadece büyük ekran)  
   - `hidden lg:flex flex-col leading-tight text-right`:  
     - Üst satır: kullanıcı adı (`font-bold text-white text-sm md:text-base`).  
     - Alt satır: e-posta (`text-xs text-emerald-200/80 font-medium`).  
   - **Hizalama:** `text-right` ile metinler sağa hizalı; avatar’ın solunda.

4. **UserMenu (avatar / dropdown)**  
   - Mağaza logosu veya initials ile avatar; tıklanınca menü açılır.  
   - Sağ blokta en sağda; `flex-shrink-0`.

Sağ blokta öğeler sağa doğru hizalı; avatar her zaman en sağ kenarda.

### 4.6 Özet: Header Tasarım Sözleşmesi

| Öğe | Konum | Hizalama | Görünürlük |
|-----|--------|----------|------------|
| Menü butonu | Sol, en baş | Dikey orta | Sadece mobil (`md:hidden`) |
| Logo/ikon | Sol, menüden sonra | Dikey orta | sm ve üzeri |
| **Ana başlık** | Sol, logodan sonra | Sola hizalı, dikey orta | Her zaman (sm+) |
| **Alt başlık** | Sol, ana başlığın altında | Sola hizalı | Sadece md ve üzeri |
| Başvuru Yap | Sağ | Sağa hizalı | Token yoksa |
| Bildirim | Sağ | Sağa hizalı | Token varken |
| Kullanıcı adı / e-posta | Sağ, avatarın solunda | **Sağa hizalı** (`text-right`) | Sadece lg ve üzeri |
| UserMenu (avatar) | Sağ, en sağ | Sağ kenar | Token varken |

Ana başlık ve alt başlık solda, tek bir blokta; sağ taraftaki metinler (kullanıcı adı, e-posta) sağa hizalıdır.

---

## 5. Giriş Sonrası Header: Topbar – Detaylı Tasarım (CSS ve Davranış)

**Dosya:** `src/components/layout/Topbar.jsx`

**Rol:** Satıcı panelinde sabit üst çubuk; sol tarafta menü (mobil) + marka/başlık, sağ tarafta bildirim + kullanıcı bilgisi + UserMenu.

### 5.1 Topbar CSS ve Düzen

| Öğe | Sınıf / stil | Açıklama |
|-----|----------------|----------|
| Header kutusu | `sticky top-0 z-50 w-full bg-gradient-to-r from-[#003131] via-[#004040] to-[#003131] border-b-2 border-emerald-500/30 shadow-2xl backdrop-blur-md` | Sabit, marka gradient, emerald alt çizgi |
| İç satır | `flex items-center justify-between w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4` | Yatay boşluklar responsive |

### 5.2 Sol Blok (Sırayla)

1. **Menü butonu (sadece mobil):**  
   `md:hidden`, `text-white/90 hover:text-white hover:bg-white/15 p-2 rounded-lg`, ikon `Menu` (lucide-react).  
   Tıklanınca `onMenuClick()` → Sidebar açılır.

2. **Logo/ikon kutusu:**  
   `hidden sm:flex`, `w-8 h-8 sm:w-10 sm:h-10`, `rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600`, içinde “T” harfi (veya marka ikonu).

3. **Başlık:**  
   - Ana: “Satıcı Paneli” — `text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight ... bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent`  
   - Alt satır (masaüstü): “Profesyonel Satış Yönetimi” — `hidden md:block text-xs text-emerald-200/80 font-medium mt-0.5`

### 5.3 Sağ Blok

- **Token yoksa:** Sadece “Başvuru Yap” linki: `href="/seller/apply"`, `bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold ... rounded-lg sm:rounded-xl`.
- **Token varsa:**  
  - `NotificationDropdown` (bildirim ikonu + dropdown).  
  - Kullanıcı adı + e-posta: `hidden lg:flex flex-col text-right`, `font-bold text-white`, `text-xs text-emerald-200/80`.  
  - `UserMenu`: avatar (mağaza logosu veya initials), dropdown menü.

**Veri:** Kullanıcı bilgisi JWT’den çözülür (email, SellerUserId, UserType); mağaza logosu `getMyStore()` ile alınır ve `UserMenu`’a `storeLogo` ve `initials` geçilir.

Bu bölüm, “giriş sonrası header”ın tam görünüm ve davranış sözleşmesidir; aynı renkler, aynı breakpoint’ler (sm, md, lg) ve aynı bileşen seti (menü, logo, başlık, bildirim, UserMenu) korunarak tutarlı bir panel header’ı üretilebilir.

---

## 6. Sidebar – Detaylı Tasarım

**Dosya:** `src/components/layout/Sidebar.jsx`

**Rol:** Sol navigasyon; masaüstünde daraltılabilir (geniş ↔ sadece ikon), mobilde overlay panel.

### 6.1 Sidebar CSS

| Öğe | Sınıf | Açıklama |
|-----|--------|-----------|
| Aside | `fixed md:static inset-y-0 left-0 z-50 bg-gradient-to-b from-[#003131] to-[#001e1e] text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out` | Mobilde fixed, md’de static |
| Genişlik | `collapsed ? "w-20" : "w-64"` | Dar mod sadece masaüstünde |
| Görünürlük (mobil) | `isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"` | Açıkken görünür, kapalıyken sola taşınır |

### 6.2 İç Yapı

- **Mobil başlık (md:hidden):** “Tedarika” metni + kapatma (X) butonu, `border-b border-white/10`.
- **Logo & collapse (hidden md:flex):** Store ikonu, “Tedarika” (collapsed’da gizli), ChevronLeft/ChevronRight ile daraltma butonu.
- **Menü alanı:** `flex-1 overflow-y-auto`, gruplar:
  - Anasayfa → `/seller/dashboard`
  - MAĞAZA YÖNETİMİ: Lokasyonlarım, Markalarım
  - ÜRÜNLER: Ürünlerim, Ürün Kataloğu, Ürün Yükleme
  - İŞLEMLER: Siparişler, İade Talepleri, Teklifler, Kampanyalarım, Yorumlar
  - RAPORLAR: Satış Raporları
  - HESAP: Profil
- **Alt:** Çıkış butonu — `text-red-400 hover:text-white hover:bg-red-500/20`, ikon + “Çıkış” (collapsed’da sadece ikon).

### 6.3 Link ve Bölüm Bileşenleri

- **SidebarLink:** `NavLink`, aktif: `bg-white/20 text-white shadow-inner`; pasif: `text-white/80 hover:text-white hover:bg-white/10`. Collapsed’da sadece ikon, ortalanmış.
- **CollapsibleSection:** Başlık (uppercase, tracking-wide) + ChevronUp/ChevronDown; açıkken altında `border-l-2 border-white/10` ile alt linkler. Collapsed modda sadece alt linkler (ikonlar) gösterilir.

Bu yapı, “giriş sonrası sol menü”nün tam bileşen ve stil sözleşmesidir; aynı renkler (#003131, #001e1e), aynı genişlikler (w-64 / w-20) ve aynı gruplama mantığı korunabilir.

---

## 7. UserMenu (Dropdown) – Tasarım

**Dosya:** `src/components/layout/UserMenu.jsx`

**Rol:** Topbar’da avatar (mağaza logosu veya initials) tıklanınca açılan menü; Profil sekmelerine hash ile gitme, Çıkış.

**Stil özeti:**

- Tetikleyici: Avatar — mağaza logosu varsa `img` rounded-full, yoksa initials ile `bg-gradient-to-br from-emerald-500 to-teal-600` kutusu; `w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12`, `border-2 border-white/30`.
- Dropdown panel: `absolute right-0 top-full mt-2`, `w-[calc(100vw-2rem)] sm:w-64 md:w-72`, `bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-gray-200`, `z-50 animate-slide-down`.
- Üst bant: `bg-gradient-to-r from-emerald-600 to-teal-600`, avatar + isim + e-posta.
- Menü öğeleri: İkon + label + ChevronRight; aktif sekme `bg-emerald-50 border-l-4 border-emerald-600`.
- Çıkış: `hover:bg-red-50 text-red-600`, ayrı blok.

Hash ile sekme: `path` içinde `#company`, `#store` vb. varsa `navigate(path)` + `window.location.hash = hash` + `profile-tab-change` custom event dispatch edilir; Profil sayfası ilgili sekmeyi açar.

---

## 8. Ana İçerik Alanı (Main) ve Sayfa İçi Kalıplar

### 8.1 Main Alanı (Layout’tan)

- `main`: `flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white/60 backdrop-blur-2xl rounded-tl-2xl shadow-inner relative`.
- İçerik: `<Outlet />` (React Router). Sayfa bileşenleri bu alanda render edilir.

### 8.2 Sayfa İçi Tasarım Kalıpları (Tutarlılık için)

Aynı dilde yeni sayfa eklerken kullanılacak yapı:

| Bölüm | Önerilen sınıf / yapı |
|-------|------------------------|
| Dış sarmalayıcı | `min-h-screen bg-[#f9fafa]` veya layout’un arka planına uyum |
| Yatay boşluk | `px-4 sm:px-6 lg:px-8` (zaten main’de kısmen var; sayfa içi ek container’da) |
| Üst boşluk | `py-6 sm:py-8` veya `py-4` |
| Sayfa başlığı (hero) | Gradient kutu: `bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center`, içte `text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white` |
| Sayfa başlığı (düz) | `text-2xl sm:text-3xl font-bold text-gray-800` |
| İçerik container | `max-w-6xl mx-auto` veya `max-w-4xl mx-auto` |
| Kart | `bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6` |
| Form input (marka) | Sarmalayıcı: `rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c]`; input: `bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2]` |
| Birincil buton | `bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition` |
| Tablo / liste | `overflow-x-auto`, `table-scroll-touch` veya `scrollbar-hide` (global CSS’te tanımlı) |

Mobil: Buton/link için en az `min-h-[44px]` veya eşdeğer padding; metin için `text-sm sm:text-base`, `text-xs sm:text-sm` kırılımları.

---

## 9. Global CSS (index.css) – Sözleşme

**Dosya:** `src/index.css`

- `@tailwind base; @tailwind components; @tailwind utilities;`
- **Özel sınıflar:**
  - `.input` — form input (Tailwind @apply)
  - `@keyframes fadeInDown` + `.animate-fade-in-down` — yukarıdan aşağı fade (ör. bildirim banner)
  - `.modal-backdrop-blur` — `backdrop-filter: blur(16px)` (Safari uyumlu)
  - `.progress-indeterminate` + `::after` — belirsiz progress bar animasyonu
  - `.table-scroll-touch` — yatay kaydırma, touch uyumlu
  - `.scrollbar-hide` — scrollbar gizleme (mobil nav vb.)

Tema renkleri tailwind.config’de özel extend yok; doğrudan utility ile `#003131`, `emerald-600`, `teal-600`, `bg-[#f9fafa]` vb. kullanılır. tailwindcss-animate eklentisi kullanılır.

---

## 10. Renk ve Görsel Dil Özeti

| Kullanım | Değer / sınıf |
|----------|----------------|
| Marka koyu (header, sidebar) | `#003131`, `#004040`, `#002829`, `#001e1e` |
| Marka yeşil (vurgu, buton, aktif) | `emerald-500/600/700`, `teal-600` |
| Sayfa arka planı (açık) | `from-indigo-50 via-purple-50 to-white`, `bg-[#f9fafa]` |
| Main alanı | `bg-white/60 backdrop-blur-2xl` |
| Form / koyu kart (Company Create vb.) | `bg-[#0e1a2b]`, `bg-[#13263d]`, `from-[#003b4a] to-[#00292f]` |
| Uyarı (mağaza yok) | `yellow-400/500`, `yellow-100`, sarı banner |
| Hata / çıkış | `red-500`, `rose-600`, `red-400` (sidebar çıkış) |
| Başarı / bilgi | `green-100`, `emerald-100` |

---

## 11. Yapay Zeka İçin Özet Kontrol Listesi

Aynı mimariyi tasarlamak veya yeni sayfa/bileşen eklemek isteyen bir AI şunları uygulayabilir:

1. **Rota sınıflandırması:** Public (layout yok, SellerHeader sayfa içinde) vs Protected (SellerLayout + Topbar + Sidebar + main). İstisna: `/seller/company/create` → layout yok.
2. **Header seçimi:** Public → `SellerHeader` (logo, nav, Kayıt/Giriş; mobil hamburger + full-screen panel). Protected → Topbar (menü, logo/başlık, bildirim, UserMenu).
3. **Layout hiyerarşisi:** Sidebar + (Topbar + main); main’de `Outlet`; overlay’ler (kısıtlı erişim, mağaza uyarısı) layout seviyesinde.
4. **Topbar:** Sticky, gradient `from-[#003131] via-[#004040] to-[#003131]`, border emerald; sol: menü (md:hidden) + logo + başlık; sağ: bildirim + kullanıcı + UserMenu.
5. **Sidebar:** Gradient `from-[#003131] to-[#001e1e]`, w-64 / w-20 (collapsed), mobilde fixed + translate, collapsible gruplar, çıkış altta.
6. **Sayfa içi:** Aynı padding/max-width/hero/kart/buton/input kalıpları ve mobil touch kuralları (min-h-44/48, text-sm sm:text-base).
7. **Global CSS:** fadeInDown, modal-backdrop-blur, table-scroll-touch, scrollbar-hide; renk paleti tutarlı kullanılır.

Bu doküman + `KULLANICI_SUREÇLERI_VE_TASARIM_REFERANSI.md` birlikte, projenin giriş öncesi/sonrası header ve içerik mimarisini, klasörleme ve tasarım sözleşmesini tek referansta toplar; okuyan bir yapay zeka bu mimariyi ve tasarım dilini uygulayabilir.
