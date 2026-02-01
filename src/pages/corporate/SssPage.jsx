import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from "lucide-react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const SssPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Sıkça Sorulan Sorular (SSS) | Tedarika Satıcı Platformu - E-İhracat Rehberi",
    description: "Tedarika satıcı platformu hakkında sıkça sorulan sorular. Kayıt, ürün ekleme, ödeme, sipariş, kargo, ihracat, faturalandırma ve daha fazlası. KOBİ'ler için e-ihracat rehberi.",
    path: location.pathname,
    keywords: "tedarika SSS, sıkça sorulan sorular, satıcı soruları, yardım, destek, FAQ, e-ihracat SSS, KOBİ ihracat soruları, satıcı rehberi"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "SSS", url: location.pathname }
  ]);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    // Kayıt ve Hesap İşlemleri
    {
      category: "Kayıt ve Hesap İşlemleri",
      question: "Tedarika Satıcı Paneli nedir?",
      answer: "Tedarika Satıcı Paneli, üretici ve tedarikçi firmaların kendi mağazalarını oluşturup yönetebilecekleri çevrimiçi bir platformdur. Bu panel üzerinden ürünlerinizi listeleyebilir, siparişlerinizi takip edebilir, alıcılarla iletişim kurabilir ve satış performansınızı analiz edebilirsiniz. Kısaca, seller.tedarika.com.tr adresindeki bu özel bölüm, Tedarika pazaryerinde satıcı olarak faaliyet göstermenizi sağlayan kontrol panelinizdir. İhracat ve toptan satış işlemlerinizi buradan kolayca yürütebilirsiniz."
    },
    {
      category: "Kayıt ve Hesap İşlemleri",
      question: "Kimler Tedarika'da satıcı olabilir?",
      answer: "Tedarika'da, ürünlerini toptan satmak isteyen tüm işletmeler satıcı olarak yer alabilir. Özellikle KOBİ'ler, üretici firmalar, imalatçılar, distribütörler ve ihracat potansiyeli olan tüccarlar platformumuza katılabilir. Satıcı olabilmek için genellikle resmi bir işletme kaydınızın (şahıs şirketi, limited, anonim şirket vb.) olması gerekmektedir; zira ticari işlemler ve faturalandırma için vergi kimliği zorunludur. Bireysel (şahıs) olarak üretim yapan ve vergi mükellefi olan girişimciler de satıcı olabilir. Önemli olan, satışa sunacağınız ürünlerin yasal olması ve gerekli belgelere sahip olmasıdır."
    },
    {
      category: "Kayıt ve Hesap İşlemleri",
      question: "Satıcı olarak platforma nasıl kayıt olabilirim?",
      answer: "Tedarika'ya satıcı olmak için ilk adım, seller.tedarika.com.tr adresine giderek çevrimiçi kayıt formunu doldurmaktır. 'Kayıt Ol' veya 'Yeni Satıcı Başvurusu' şeklindeki butonlara tıklayarak sizden istenen bilgileri girebilirsiniz. Kayıt sırasında işletme adınız, vergi numaranız, iletişim bilgileriniz ve yetkili kişi bilgileri gibi temel veriler talep edilir. Ayrıca sizden bir e-posta adresi ve şifre belirlemeniz istenir. Başvurunuzu gönderdikten sonra Tedarika ekibi kısa sürede bilgilerinizi inceleyip size geri dönüş yapacaktır. Başvurunuz onaylandığında kayıtlı e-posta adresinize onay bildirimi gelir ve artık Satıcı Paneli'ne giriş yaparak mağazanızı oluşturmaya başlayabilirsiniz."
    },
    {
      category: "Kayıt ve Hesap İşlemleri",
      question: "Kayıt için hangi belgelere ve bilgilere ihtiyaç var?",
      answer: "Kayıt esnasında dijital olarak bazı belgeleri yüklemeniz veya bilgileri sağlamanız gerekebilir. Örneğin, şirketinizi doğrulayabilmemiz için vergi levhanız veya MERSİS numaranız istenebilir. Eğer bir imalatçı ya da marka sahibiyseniz, ürünlerinizle ilgili sertifikalar veya izin belgeleri (örn. gıda üretim izni, CE belgesi, marka tescil belgesi gibi) kayıt aşamasında değil ama ürün listeleme aşamasında talep edilebilir. Kayıt formunda belirtilen alanları (firma ünvanı, adres, vergi kimlik no, iletişim kişi adı ve iletişim bilgileri vb.) eksiksiz doldurmanız önemlidir. Ayrıca ileride ödeme alabilmeniz için banka hesap bilgileriniz istenecektir (IBAN vb.)."
    },
    {
      category: "Kayıt ve Hesap İşlemleri",
      question: "Tedarika'da mağaza açmanın maliyeti nedir?",
      answer: "Tedarika'da bir mağaza açmak için herhangi bir başlangıç ücreti ödemezsiniz. Platformumuz, KOBİ'leri desteklemek adına satıcı kayıtlarını ücretsiz olarak kabul etmektedir. Yani kayıt olurken veya mağazanızı ilk oluştururken sizden aylık/üyelik ücreti talep etmiyoruz. Gelecekte sunulabilecek opsiyonel premium hizmetler veya tanıtım paketleri olabilir, ancak temel mağaza açılışı için ücret yoktur. Böylece hiçbir mali risk almadan ürünlerinizi yükleyip satış yapmaya başlayabilirsiniz. Tedarika'nın gelir modeli satış gerçekleştiğinde alınan komisyonlar üzerine kurulu olduğundan, biz ancak siz kazandıkça kazanıyoruz."
    },
    // Ödemeler
    {
      category: "Ödemeler",
      question: "Tedarika satışlardan komisyon alıyor mu?",
      answer: "Evet, Tedarika üzerinden gerçekleşen satışlardan platform hizmet bedeli olarak komisyon alınır. Bu komisyon oranı, satılan ürün kategorisine ve işlem hacmine göre belirlenmiş olup piyasadaki B2B pazaryeri standartlarıyla rekabetçi seviyededir. Komisyon, satış işlemi başarıyla tamamlandığında (ürün teslim edilip alıcı onay verdiğinde) otomatik olarak hesaplanır ve satış gelirinizden düşülerek platforma aktarılır. Tedarika, komisyon oranlarını şeffaf bir şekilde satıcı panelinde ilgili sözleşmelerde belirtir; baştan sürpriz bir kesintiyle karşılaşmazsınız."
    },
    {
      category: "Ödemeler",
      question: "Bir satış gerçekleştirdiğimde ödememi nasıl ve ne zaman alırım?",
      answer: "Tedarika'da satış yaptığınızda ödemeniz güvenli bir işlem akışıyla size ulaştırılır. Alıcı, sipariş verirken ödeme işlemini platform üzerinden gerçekleştirir; bu tutar, ürün teslimat süreci tamamlanana kadar emanet hesapta bekletilir. Siparişi kargoya verdikten sonra alıcıya teslim edildiğinde, alıcı teslimatı onaylar (veya belirli bir süre içinde itiraz gelmezse sistem otomatik onaylar). Onayın ardından, satış tutarınızdan platform komisyonu kesilerek kalan miktar satıcı bakiyenize yansıtılır. Satıcı bakiyenizde biriken tutarı kayıt sırasında belirttiğiniz banka hesabınıza talep ederek çekebilirsiniz. Tedarika genellikle haftalık veya belirli periyotlarla bakiyeleri satıcılara transfer eder."
    },
    {
      category: "Ödemeler",
      question: "Ödemeler hangi para birimiyle yapılır?",
      answer: "Tedarika'da satış işlemleri, platformun hizmet verdiği bölgelere göre farklı para birimlerinde gerçekleşebilir; ancak satıcı ödemeleri genellikle yerel para biriminize çevrilerek yapılır. Örneğin, yurt dışından bir alıcı dolar veya euro ile ödeme yapsa bile, siz ödemeyi Türk Lirası (TL) olarak alabilirsiniz. Platformumuz, farklı para birimleriyle yapılan ödemeleri güncel döviz kuru üzerinden TL'ye çevirerek satıcı bakiyenize işler. Bu yaklaşım, yurt dışı satışlarınızda döviz dalgalanmalarına karşı sizi korumayı ve işlemleri basitleştirmeyi amaçlar."
    },
    // Ürün Yönetimi
    {
      category: "Ürün Yönetimi",
      question: "Platforma ürün ekleme işlemi nasıl yapılır?",
      answer: "Satıcı Paneli'ne giriş yaptıktan sonra 'Ürün Ekle' veya 'Yeni Ürün' butonuna tıklayarak ürün ekleme sürecini başlatabilirsiniz. Karşınıza çıkacak formda, ürüne ait başlık, açıklama, kategori seçimi, fiyat, minimum sipariş adedi gibi bilgileri girmeniz istenir. Ürününüzü en iyi şekilde tanıtmak için açıklayıcı ve özgün bir açıklama metni yazmanızı, teknik özelliklerini belirtmenizi öneririz. Ardından ürün fotoğraflarını yüklemeniz gerekir – kaliteli ve net görseller alıcıların ilgisini çekmek açısından önemlidir. Eğer ürününüz için geçerli sertifikalar veya kalite belgeleri varsa, bunları da ürün detaylarına dosya olarak ekleyebilirsiniz. Çok dilli katalog özelliğimiz sayesinde, girdiğiniz Türkçe ürün bilgileri uluslararası alıcılar için otomatik olarak İngilizce gibi dillere çevrilebilir."
    },
    {
      category: "Ürün Yönetimi",
      question: "Ürün listelerken dikkat edilmesi gerekenler nelerdir?",
      answer: "Ürünlerinizi listelerken daha fazla alıcı çekebilmek için: ürün başlığı ve açıklaması net ve doğru olmalıdır; alıcıların aradığı anahtar kelimeleri metinlere ekleyerek SEO dostu içerikler hazırlayın. Fiyatlandırma ve minimum sipariş adedi gibi bilgileri piyasaya uygun ve rekabetçi belirleyin. Ürün görselleri de kritik önem taşır: Mümkünse farklı açılardan çekilmiş yüksek çözünürlüklü fotoğraflar kullanın. Kategori ve etiket seçimi de uygun olmalı; ürününüzü en doğru kategoriye yerleştirmek, doğru alıcıların sizi bulmasını sağlar. Son olarak, stok ve tedarik sürelerinizi gerçekçi girin ve güncel tutun."
    },
    {
      category: "Ürün Yönetimi",
      question: "Hangi kategorilerde ürünler satabilirim? Her ürün kabul ediliyor mu?",
      answer: "Tedarika, çok çeşitli sektörlerden ürün satışına imkan veren kapsamlı bir pazaryeridir, ancak bazı sınırlar ve kurallar vardır. Genel olarak, yasal mevzuata uygun olan ve toptan ticareti yapılabilen tüm ürünleri satabilirsiniz. Örneğin, gıda ve içecek, tekstil ve moda ürünleri, tarım ürünleri, kozmetik ve kişisel bakım, temizlik malzemeleri, endüstriyel ürünler, elektronik bileşenler, ev & yaşam ürünleri gibi pek çok kategori platformda aktiftir. Bununla birlikte, yasal olarak kısıtlanmış veya özel izin gerektiren ürünler konusunda duyarlı olmalısınız: Örneğin, reçeteyle satılması gereken tıbbi ürünler, ilaçlar, ateşli silahlar, tütün ürünleri, yasa dışı maddeler vb. platformda kesinlikle yasaktır."
    },
    {
      category: "Ürün Yönetimi",
      question: "Sadece yurt dışına mı satış yapılıyor, yurt içine de satış yapabilir miyim?",
      answer: "Tedarika, hem yurt dışı (e-ihracat) hem de yurt içi toptan satışlar için kullanılabilen bir platformdur. Yani ürünlerinizi Türkiye içindeki toptan alıcılara da satabilirsiniz, yurt dışındaki ithalatçılara da. Platform yapımız, bir satıcının her iki pazarda da etkin olmasını destekliyor. Ürünlerinizi listelerken, dilerseniz sadece belirli ülkelere görünür yapma seçeneğiniz olabilir. Ancak Tedarika'nın vizyonu size tek platformdan birden fazla pazara erişim imkanı vermektir."
    },
    // Sipariş ve Kargo
    {
      category: "Sipariş ve Kargo",
      question: "Sipariş aldığımda süreç nasıl ilerler?",
      answer: "Platform üzerinden bir alıcı ürünlerinizden birini sipariş verdiğinde veya teklifinizi kabul ettiğinde, Satıcı Paneli'nizde yeni bir sipariş bildirimi alırsınız (ayrıca e-posta bildirimi de gelir). Bu siparişte ürün, miktar, teslimat adresi, teslim süresi gibi ayrıntıları görebilirsiniz. İlk adım olarak, siparişi onaylamanız gerekebilir (stok durumunuzu kontrol ederek). Onayladıktan sonra, belirtilen hazırlık süresi içinde ürünlerinizi kargoya vermelisiniz. Ürünü kargoladıktan sonra, kargo takip numarasını yine sipariş sayfasına girerek alıcının paketi takip edebilmesini sağlarsınız. Alıcı, ürünü teslim alıp kontrol ettikten sonra sistem üzerinden teslimatı onaylar. Bu onay ile birlikte sipariş 'tamamlandı' statüsüne geçer ve ödemesi sizin bakiyenize aktarılır."
    },
    {
      category: "Sipariş ve Kargo",
      question: "Kargo ve teslimat işlemlerini kim düzenler?",
      answer: "Tedarika'da kargo işlemleri, satıcı ve alıcı arasında belirlenen şekilde yürür, fakat platform olarak biz de bu süreci kolaylaştıracak araçlar sağlıyoruz. Genellikle, ürünü göndermek satıcının sorumluluğundadır. Sipariş alındığında, satıcı olarak ürünü paketleyip alıcının adresine göndermek üzere bir kargo organize etmeniz gerekir. Eğer Tedarika'nın entegre lojistik çözümleri mevcutsa, Satıcı Paneli üzerinden anlaşmalı kargo firmalarının hizmetlerini kullanarak kolayca kargo oluşturabilirsiniz. Bu sayede indirimli gönderi ücretlerinden de faydalanmanız mümkün olur."
    },
    // İhracat
    {
      category: "İhracat",
      question: "Yurt dışı gönderim ve gümrük işlemlerinde platformun desteği nedir?",
      answer: "İhracat yaparken en kafa karıştırıcı konulardan biri gümrük ve belge işlemleridir – Tedarika, bu konuda satıcılarına önemli kolaylıklar sunar. Öncelikle platformumuz, ürün bazlı akıllı belge uyarı sistemi ile çalışır: Bir ürün eklediğinizde, hedeflediğiniz pazar ülkesine göre o ürünün ihracatında gerekli olabilecek evrakları (örn. sağlık sertifikası, CE belgesi, menşe şahadetnamesi vb.) size bildirir. Sipariş aşamasına gelindiğinde, mikro ihracat seçeneğiyle gönderim yapacaksanız, kargo firması aracılığıyla ETGB (Elektronik Ticaret Gümrük Beyannamesi) düzenlenmesi gerekebilir – Tedarika, entegrasyonları sayesinde bu süreci mümkün olduğunca otomatik hale getirir."
    },
    {
      category: "İhracat",
      question: "İhracat için gereken belge ve sertifikalar konusunda nasıl bilgilendirileceğim?",
      answer: "Tedarika, satıcıların ürünlerine dair belge gerekliliklerini önceden bilmeleri için özel bir sistem geliştirmiştir. Ürünlerinizi eklerken belirttiğiniz kategori ve ürün özelliklerine dayanarak, platformumuz arka planda ilgili ihracat mevzuatını tarar. Örneğin, gıda ürünleri eklediğinizde sizden Tarım Bakanlığı onayları veya ISO belgeleri var mı diye sorabilir; elektronik bir cihaz eklediğinizde CE sertifikası gerekliliğini hatırlatabilir. Bu akıllı belge yönetimi özelliği sayesinde, her bir ürün sayfasında 'Bu ürün için gerekli olabilecek belgeler:' şeklinde bir bildirim görebilirsiniz."
    },
    {
      category: "İhracat",
      question: "Yabancı alıcılarla dil problemi yaşamadan iletişim kurabilir miyim?",
      answer: "Evet, Tedarika'nın en sevilen özelliklerinden biri, dil bariyerini ortadan kaldıran iletişim altyapısıdır. Satıcı Paneli'nde, alıcılardan gelen mesajları veya soru taleplerini göreceğiniz bir mesajlaşma bölümü bulunur. Burada yabancı bir alıcı size örneğin İngilizce yazdığında, sistem otomatik olarak mesajı Türkçeye çevirir ve size öyle gösterir. Siz de Türkçe yanıt yazdığınızda, alıcıya otomatik olarak onun diline çevrilerek gönderilir. Tedarika, gelişmiş yapay zeka destekli çeviri araçları kullanarak mesajlaşmada büyük oranda doğru ve akıcı tercümeler sunar."
    },
    {
      category: "İhracat",
      question: "Ürün bilgilerim yabancı dile çevriliyor mu?",
      answer: "Evet, Tedarika platformu, çok dilli katalog yapısıyla ürün bilgilerinizin farklı dillerde görüntülenebilmesini sağlar. Siz ürün sayfasını oluştururken Türkçe olarak başlık, açıklama ve özellikleri girdiyseniz, uluslararası alıcılar bu sayfayı görüntülerken sistem otomatik olarak içeriği İngilizce (veya alıcının tercih ettiği dile) çevirebilir. Bu otomatik çeviri, alıcılara temel bilgi vermek içindir ve yapay zeka tarafından yapılır. Elbette isterseniz, her ürün için manuel olarak İngilizce açıklama girme seçeneğiniz de bulunabilir – bu şekilde, çeviriyi kendiniz kontrol ederek daha profesyonel bir sunum yapabilirsiniz."
    },
    {
      category: "İhracat",
      question: "Fiyatları hangi para birimiyle belirlemeliyim?",
      answer: "Satıcı panelinde ürün fiyatlarınızı girerken, temel fiyat para birimi Türk Lirası (TL) olarak belirlenmiştir. Yani siz ürünün birim fiyatını TL cinsinden girersiniz. Ancak platformumuz uluslararası alıcılara bu fiyatı onların seçeceği para biriminde gösterir. Örneğin, siz bir ürüne 100 TL fiyat belirlediyseniz, Avrupalı bir alıcı bu ürünü Euro olarak yaklaşık 3,5 € (güncel kur oranına göre) şeklinde görebilir. Kur hesaplamaları sistem tarafından gerçek zamanlı yakın oranlarla yapıldığından, sizin ekstra bir şey yapmanıza gerek kalmaz."
    },
    // Faturalandırma ve Yasal
    {
      category: "Faturalandırma ve Yasal",
      question: "Satışlar için faturalandırma işlemi nasıl gerçekleşiyor?",
      answer: "Tedarika, satıcı ile alıcı arasındaki ticari işlemlerde fatura kesme sorumluluğunu taraflara bırakır, ancak bu süreci kolaylaştıracak araçlar sunar. Bir satıcı olarak, yaptığınız her satış için alıcıya bir fatura düzenlemek zorundasınız (yurt içi satışlarda Türkçe fatura, yurt dışı satışlarda ihracat faturası şeklinde). Platform üzerinden bir sipariş tamamlandığında, sipariş detaylarında alıcının faturada yer alacak bilgilerini (ünvan, adres, vergi no/VAT no vs.) görebilirsiniz. Bu bilgilere dayanarak kendi faturalandırma sisteminizden faturayı kesip, alıcıya iletmeniz gerekir. Yurt dışı satışlarda ise genelde proforma fatura ve sonrasında ihracat faturası düzenlenir."
    },
    {
      category: "Faturalandırma ve Yasal",
      question: "Vergi ve yasal yükümlülükler konusunda destek sağlanıyor mu?",
      answer: "Tedarika, satıcılarına mümkün olduğunca rehberlik etmeye çalışır, ancak her satıcının kendi vergi ve yasal sorumluluklarını yönetmesi esastır. Bununla birlikte, özellikle ihracata yeni başlayan KOBİ'ler için kritik bazı konularda bilgilendirici destek sağlıyoruz. Örneğin, mikro ihracat yapan bir satıcıysanız, belirli bir tutara kadar KDV istisnası ve gümrük kolaylığı olduğunu size hatırlatıyoruz. Satıcı Paneli'nde bir 'Kaynaklar' veya 'Eğitim' bölümü bulunuyorsa, burada ihracat mevzuatı, vergi avantajları, devlet destekleri gibi konularda makaleler yer alabilir. Ancak Tedarika olarak vergi beyanlarınızı sizin adınıza yapamayız veya hukuki sorumluluklarınızı üstlenemeyiz – bu noktada bir mali müşavir veya gümrük müşaviri ile çalışmanızı tavsiye ederiz."
    },
    {
      category: "Faturalandırma ve Yasal",
      question: "Tedarika satıcılara eğitim veya danışmanlık sağlıyor mu?",
      answer: "Evet, Tedarika satıcılarının başarılı olması için çeşitli eğitim ve danışmanlık desteği sunar. Öncelikle, yeni kaydolan satıcılar için platformun kullanımı, ürün listeleme, fiyatlandırma ve sipariş yönetimi gibi temel konuları içeren hoş geldiniz kılavuzu ve çevrimiçi dokümanlar mevcuttur. Zaman zaman, webinarlar ve online eğitim seminerleri düzenleyerek KOBİ'lere e-ihracat hakkında bilinçlendirme yapıyoruz. Bunun yanı sıra, belirli sayıda ürünü yüklemiş ve aktif satış yapan iş ortaklarımıza özel, bir müşteri temsilcisi/hesap yöneticisi atayarak bire bir destek vermeyi planlıyoruz. Satıcı Paneli içinde bir SSS ve Yardım Merkezi bulunur; burada adım adım rehberler, video anlatımlar ve sorun giderme önerileri yer alır."
    },
    // Teknik Destek
    {
      category: "Teknik Destek",
      question: "Platformu kullanırken teknik bir sorun yaşarsam ne yapmalıyım?",
      answer: "Eğer Satıcı Paneli'ni kullanırken herhangi bir teknik problemle karşılaşırsanız, öncelikle basit bir sayfa yenileme veya çıkış yapıp tekrar giriş yapma gibi adımları denemek olabilir. Sorun devam ederse, tarayıcınızın önbelleğini (cache) temizleyip tekrar deneyin veya farklı bir tarayıcı ile giriş yapın. Eğer bunlar işe yaramazsa, Satıcı Paneli'nde bulunan 'Yardım' veya 'Destek' bölümüne geçiş yapın. Yine çözüm bulamazsanız, vakit kaybetmeden bizimle iletişime geçin: Destek ekibimize sorunuzu iletmek için bir destek talebi (ticket) oluşturabilirsiniz. Bu talepte yaşadığınız sorunu detaylıca tarif edin (hangi adımda, ne tür bir hata alıyorsunuz, mümkünse ekran görüntüsü ile). Tedarika Destek Ekibi sizin sorunsuz bir deneyim yaşamanız için 7/24 görev başındadır."
    },
    {
      category: "Teknik Destek",
      question: "Ürünlerim uluslararası alıcılara nasıl sunuluyor?",
      answer: "Tedarika'da ürünleriniz, platforma kayıtlı tüm uygun alıcılara görünür olacak şekilde global vitrine çıkar. Yani bir ürün eklediğinizde, Türkiye'den bir toptancı da o ürünü görebilir, Almanya'dan bir ithalatçı da, Birleşik Arap Emirlikleri'nden bir işletme de. Platformumuz, alıcıların coğrafi konumuna göre onlara en alakalı ürünleri ve satıcıları öne çıkarma yeteneğine sahiptir. Ayrıca, ürün sayfalarınız otomatik olarak İngilizceye çevrildiği için, dil bariyeri olmadan alıcılar içerikleri anlayabilir. Ürünleriniz platformda yayımlandıktan sonra, Tedarika'nın dijital pazarlama faaliyetleri kapsamında da görünürlük kazanır."
    },
    {
      category: "Teknik Destek",
      question: "Tedarika'da bir değerlendirme veya puanlama sistemi var mı?",
      answer: "Evet, Tedarika'nın içinde hem alıcılar hem satıcılar için bir değerlendirme/puanlama sistemi bulunmaktadır. Bu sistem, platformdaki ticaretin şeffaflığını ve güvenilirliğini artırmak amacıyla kurulmuştur. Bir satış işlemi tamamlandıktan sonra, alıcılar satıcıyı çeşitli kriterlere göre puanlayabilir ve isterlerse kısa bir yorum yazabilirler (örneğin, ürünün kalitesi, gönderim hızı, iletişim ve hizmet kalitesi gibi). Bu puanlar ve geri bildirimler, profilinizde veya ürünlerinizin altında diğer kullanıcılar tarafından görülebilir. Tedarika ekibi, yapılan yorumları ve puanlamaları belli kurallar çerçevesinde denetler; hakaret veya gerçeğe aykırı beyanlar içeriyorsa müdahale edebilir."
    },
    {
      category: "Teknik Destek",
      question: "Platformda satış yapmak için herhangi bir kota veya şart var mı?",
      answer: "Tedarika, büyüme hedeflerinizi desteklemek üzere esnek bir yapı sunar ve genellikle satış hacmi veya ürün adedi konusunda bir alt/üst sınır koymaz. Yani bir ürün de listeleyebilirsiniz, yüzlerce ürün de – platform kullanımı açısından bir kota bulunmaz. Ancak çok düşük adetli (örneğin tek tek) satışlar yerine, toptan alımlara odaklanıldığı için, her ürün için bir minimum sipariş adedi belirlemeniz beklenir. Platformumuzun amacı KOBİ'leri ihracata teşvik etmek olduğu için, satış performansı düşük olan satıcıları kısıtlamak gibi bir yaklaşımımız yoktur; aksine, onları daha aktif olmaya motive ederiz."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        
        {/* Structured Data - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="bg-white min-h-screen">
        <SellerHeader />
        
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">SSS</h1>
              <p className="text-emerald-50 mt-2">Sıkça Sorulan Sorular</p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg">
            Tedarika satıcı paneli hakkında merak ettikleriniz
          </p>
        </div>

        <div className="space-y-8">
          {(() => {
            const categories = [...new Set(faqs.map(faq => faq.category))];
            return categories.map((category, catIndex) => {
              const categoryFaqs = faqs.filter(faq => faq.category === category);
              return (
                <div key={catIndex} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
                    {category}
                  </h2>
                  {categoryFaqs.map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    return (
                      <div
                        key={globalIndex}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                      >
                        <button
                          onClick={() => toggleFaq(globalIndex)}
                          className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                        >
                          <span className="text-lg font-bold text-gray-900 pr-4 group-hover:text-emerald-600 transition-colors">
                            {faq.question}
                          </span>
                          <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            {openIndex === globalIndex ? (
                              <ChevronUp className="w-6 h-6 text-white" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-white" />
                            )}
                          </span>
                        </button>
                        
                        {openIndex === globalIndex && (
                          <div className="px-6 pb-6">
                            <div className="pt-2 border-t-2 border-emerald-100">
                              <p className="text-gray-600 leading-relaxed mt-4 text-lg">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-2xl shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">Sorunuz mu var?</h3>
          </div>
          <p className="text-gray-700 mb-5 text-lg">
            Burada bulamadığınız sorular için destek ekibimizle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/905382362605"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile İletişim
            </a>
            <a
              href="mailto:info@tedarika.com.tr"
              className="inline-flex items-center gap-3 bg-white text-emerald-700 border-2 border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              E-posta Gönder
            </a>
          </div>
        </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SssPage;
