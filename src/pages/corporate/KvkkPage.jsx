import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Shield, Lock, Eye, FileText, Bell, UserCheck } from "lucide-react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const KvkkPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "KVKK Bilgilendirme Metni | Kişisel Verilerin Korunması | Tedarika",
    description: "Tedarika Satıcı Platformu KVKK bilgilendirme metni. Kişisel verilerin toplanması, işlenmesi, saklanması ve haklarınız hakkında detaylı bilgi. 6698 sayılı KVKK uyumlu.",
    path: location.pathname,
    keywords: "KVKK, kişisel verilerin korunması, veri güvenliği, gizlilik politikası, tedarika KVKK, 6698 sayılı kanun, kişisel veri hakları, veri koruma"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "KVKK", url: location.pathname }
  ]);
  const sections = [
    {
      title: "Kişisel Verilerin Toplanması",
      icon: FileText,
      content: "Tedarika olarak, satıcı panelimizde sunduğumuz hizmetler kapsamında, satıcı hesabı oluşturma, ürün yönetimi, sipariş takibi ve iletişim süreçlerinde kişisel verilerinizi topluyoruz."
    },
    {
      title: "Verilerin İşlenme Amacı",
      icon: Eye,
      content: "Toplanan kişisel veriler, hizmet kalitesini artırmak, yasal yükümlülükleri yerine getirmek, kullanıcı deneyimini iyileştirmek ve güvenli bir platform sunmak amacıyla işlenmektedir."
    },
    {
      title: "Veri Güvenliği",
      icon: Lock,
      content: "Kişisel verileriniz, en üst düzeyde güvenlik önlemleriyle korunmaktadır. Verilerinize yetkisiz erişim, kayıp veya ifşa durumlarına karşı teknik ve idari tedbirler alınmıştır."
    },
    {
      title: "Haklarınız",
      icon: UserCheck,
      content: "KVKK kapsamında, kişisel verilerinize erişim, düzeltme, silme ve işlemenin durdurulmasını talep etme haklarına sahipsiniz. Taleplerinizi info@tedarika.com.tr adresine iletebilirsiniz."
    },
    {
      title: "Veri Paylaşımı",
      icon: Bell,
      content: "Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla paylaşılmamaktadır. İş ortaklarımızla yalnızca hizmet kalitesini artırmak için gerekli veriler paylaşılır."
    },
    {
      title: "Yasal Düzenlemeler",
      icon: Shield,
      content: "Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuat çerçevesinde işlenmekte ve korunmaktadır."
    }
  ];

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />
        
        {/* Hreflang Tags */}
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content={seoMeta.og.type} />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="bg-white min-h-screen">
        <SellerHeader />
        
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">KVKK</h1>
              <p className="text-emerald-50 mt-2">Kişisel Verilerin Korunması</p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg">
            Kişisel verilerinizin güvenliği bizim için önceliklidir
          </p>
        </div>

        {/* Ana KVKK İçeriği */}
        <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border border-gray-100 overflow-hidden">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Tedarika Satıcı Platformu ("Platform") olarak, gizliliğinize ve kişisel verilerinizin korunmasına büyük
                önem veriyoruz. Kayıtlı satıcılarımızın ve platformu ziyaret eden tüm kullanıcılarımızın verileri, <strong>6698
                sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> başta olmak üzere ilgili yasal mevzuata uygun
                olarak işlenmektedir. Bu bilgilendirme, platformumuzu kullanırken paylaştığınız veriler hakkında sizi
                özetle aydınlatmayı amaçlamaktadır.
              </p>
            </section>
          </div>
        </article>

        <div className="space-y-6">
          {/* Toplanan Veriler ve Kapsam */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FileText className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Toplanan Veriler ve Kapsam
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    Satıcı portalımıza kayıt olurken veya kullanımınız sırasında sizden
                    bazı kişisel ve ticari bilgiler talep edilir. Bu bilgiler arasında firmanızın unvanı, vergi numarası,
                    yetkili kişi adı, iletişim bilgileri (e-posta, telefon), fatura adresi, banka hesap bilgileri gibi veriler
                    bulunabilir.
                  </p>
                  <p>
                    Ayrıca platforma ürün yüklerken sağladığınız ürün fotoğrafları, açıklamaları ve
                    sertifika/doküman bilgileri gibi içerikler de tarafımızca işlenir. Siteyi kullanımınız esnasında
                    çerezler aracılığıyla cihaz ve tarayıcı bilgileriniz, IP adresiniz, oturum bilgileriniz gibi teknik veriler
                    de toplanabilir.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Veri İşleme Amaçları */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Eye className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Veri İşleme Amaçları
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    Topladığımız veriler, platformdaki üyelik işlemlerinin
                    gerçekleştirilmesi, kimlik ve firma doğrulamalarının yapılması, ürün listeleme ve sipariş
                    yönetimi gibi çekirdek hizmetlerin sunulması amaçlarıyla işlenir.
                  </p>
                  <p>
                    Örneğin, satıcı olarak kayıt
                    olurken verdiğiniz şirket bilgileri platformda mağaza profilinizi oluşturmak için kullanılır; banka
                    hesap bilgileriniz, satış gelirlerinin size ulaştırılması amacıyla alınır. Bunun yanı sıra, kullanıcı
                    deneyimini iyileştirmek, platform güvenliğini sağlamak ve yasal yükümlülüklerimizi yerine
                    getirmek (ör. fatura düzenleme, yasal bildirimler) gibi amaçlarla da verileriniz işlenmektedir.
                  </p>
                  <p>
                    Açık
                    onayınız olması durumunda, tarafınıza duyurular, yeni özellik bilgilendirmeleri veya pazarlama
                    içerikleri göndermek için iletişim bilgilerinizi kullanabiliriz.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Çerezler ve Analiz Araçları */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Lock className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Çerezler ve Analiz Araçları
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    Seller.tedarika.com.tr, kullanım deneyiminizi geliştirmek ve trafiği
                    analiz etmek adına çerezler kullanır. Örneğin, oturum çerezleri siz platformda gezinirken giriş
                    yapmış kalmanızı sağlar; tercihler çerezleri dil ve para birimi ayarlarınızı hatırlar.
                  </p>
                  <p>
                    Ayrıca, hangi
                    sayfaların daha sık ziyaret edildiğini anlamak için Google Analytics gibi üçüncü taraf analiz
                    araçları kullanılabilir ve bu araçlar tarayıcınıza çerez yerleştirebilir. Tarayıcınızın ayarlarından
                    çerezleri reddetme veya silme imkanınız bulunmaktadır; ancak çerezleri devre dışı bırakmak
                    platformdaki bazı işlevlerin doğru çalışmamasına neden olabilir.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Veri Paylaşımı ve Üçüncü Taraflar */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bell className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Veri Paylaşımı ve Üçüncü Taraflar
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    Satıcı platformunda elde edilen kişisel veriler, kesinlikle
                    izniniz dışında üçüncü kişilerle paylaşılmaz. Ancak, hizmeti sağlamak için iş birliği yaptığımız
                    bazı taraflarla veri paylaşımı zorunlu olabilir.
                  </p>
                  <p>
                    Örneğin, satış gelirlerinin ödenmesi için bankalarla,
                    ödeme sistemi sağlayıcılarıyla finansal veriler paylaşılır; kargo entegrasyonu durumlarında
                    lojistik ortaklarımıza alıcı/satıcı adı ve adresi gibi bilgiler iletilebilir. Bu paylaşımlar, yalnızca ilgili
                    işlemi gerçekleştirmek amacıyla ve gizlilik sözleşmeleri çerçevesinde yapılır.
                  </p>
                  <p>
                    Yasal mercilerden
                    gelen ve mevzuata dayalı zorunlu talepler halinde, ilgili kullanıcı verileri yetkili makamlarla
                    paylaşılabilir (örneğin, bir hukuki soruşturma kapsamında mahkeme kararıyla istenirse).
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Verilerin Saklanması ve Yurt Dışı Aktarım */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Verilerin Saklanması ve Yurt Dışı Aktarım
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    Sağladığınız veriler, şirketimizin güvenli
                    sistemlerinde ve bulut altyapılarımızda saklanır. Tedarika, global bir hizmet sunması nedeniyle
                    verilerin saklandığı sunucular veya kullanılan bazı hizmetler yurt dışında olabilir.
                  </p>
                  <p>
                    Örneğin,
                    platformumuzun barındırıldığı bulut sunucu altyapısı yurt dışındaki bir veri merkezinde
                    bulunabilir veya e-posta hizmetlerimiz uluslararası bir servis sağlayıcı tarafından sağlanıyor
                    olabilir. Bu durumlarda, KVKK'nın 9. maddesine uygun şekilde verilerinizin yurt dışına aktarımı
                    gerçekleştirilir.
                  </p>
                  <p>
                    Verileriniz hangi ülkede işlenirse işlensin, daima gizlilik ve güvenlik
                    standartlarımıza tabi olacak ve korunacaktır.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Veri Güvenliği Önlemleri */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Lock className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Veri Güvenliği Önlemleri
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    Tedarika Satıcı Platformu'nda, kullanıcı verilerinin güvenliği için
                    endüstri standardı güvenlik önlemleri uygulanır. Sistemlerimiz yetkisiz erişim, veri sızıntısı
                    veya kaybını önlemek amacıyla güçlü güvenlik duvarları ve şifreleme teknikleri ile korunmaktadır.
                  </p>
                  <p>
                    Özellikle finansal bilgiler ve şifre gibi hassas veriler, veri tabanlarımızda maskelenmiş veya
                    kriptografik olarak şifrelenmiş halde tutulur. Personelimiz, kişisel verilere yalnızca iş gereği
                    "bilmesi gerektiği kadar" prensibiyle erişebilir ve tüm çalışanlarımız KVKK konusunda
                    bilgilendirilmiştir.
                  </p>
                  <p>
                    Düzenli aralıklarla sistemlerimizi test ederek olası açıkları gidermekte ve
                    güncelleştirmelerle güvenliği en üst düzeyde tutmaktayız.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Haklarınız ve İletişim */}
          <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <UserCheck className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Haklarınız ve İletişim
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                  <p>
                    KVKK kapsamında, satıcı platformumuzda kayıtlı olan herkesin kişisel
                    verilerine ilişkin hakları bulunmaktadır. Bu haklar; verilerinizin işlenip işlenmediğini öğrenme,
                    işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya
                    yurt dışında verilerinizin aktarıldığı üçüncü kişileri bilme, veriler eksik veya yanlış işlenmişse
                    düzeltilmesini isteme, KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde verilerinizin
                    silinmesini veya yok edilmesini talep etme, ve verileriniz üzerinde otomatik sistemler aracılığıyla
                    yapılan analizler sonucunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme gibi hakları
                    kapsar.
                  </p>
                  <p>
                    Bu haklarınızı kullanmak veya kişisel verilerle ilgili herhangi bir konuda bilgi almak
                    isterseniz, <strong>kvkk@tedarika.com</strong> adresine e-posta gönderebilir veya şirketimizin resmi posta
                    adresine yazılı başvuruda bulunabilirsiniz. Başvurularınız, kimliğinizi doğrulamanız koşuluyla, en
                    geç 30 gün içinde yanıtlanacaktır.
                  </p>
                  <p>
                    Unutmayın, bu KVKK bilgilendirme metni size özet bilgi sunmak içindir. Daha detaylı bilgiye ihtiyaç
                    duyarsanız, Tedarika'nın tam kapsamlı Gizlilik/Veri Koruma Politikası ve kullanım koşullarına web
                    sitemizden ulaşabilir, aklınızdaki sorular için bizimle doğrudan iletişime geçebilirsiniz. Veri güvenliği ve
                    gizliliği konularında gösterdiğimiz titizlik, Tedarika deneyiminizin gönül rahatlığıyla sürdürülmesi içindir.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-2xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">İletişim</h3>
          </div>
          <p className="text-gray-700 mb-4 text-lg">
            KVKK kapsamındaki talepleriniz için bizimle iletişime geçebilirsiniz:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-2 rounded-xl">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">KVKK E-posta</p>
                <a href="mailto:kvkk@tedarika.com" className="text-emerald-700 font-bold text-lg hover:text-emerald-800">
                  kvkk@tedarika.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-2 rounded-xl">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Telefon</p>
                <a href="tel:+905382362605" className="text-emerald-700 font-bold text-lg hover:text-emerald-800">
                  +90 (538) 236 26 05
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default KvkkPage;
