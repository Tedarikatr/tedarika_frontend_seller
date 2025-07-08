// src/components/sellerLanding/StepsSection.jsx
const steps = [
    {
      number: 1,
      title: "Hızlı Kayıt",
      desc: "Formu doldurarak dakikalar içinde kayıt olun."
    },
    {
      number: 2,
      title: "Şirket Bilgileri",
      desc: "Yasal bilgilerinizi girerek mağazanızı onaylatın."
    },
    {
      number: 3,
      title: "Ürünlerinizi Yükleyin",
      desc: "Mağazanızı açıp satışa başlayın!"
    }
  ];
  
  const StepsSection = () => (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">3 Adımda Satıcı Olun</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {steps.map(({ number, title, desc }, i) => (
            <div key={i} className="bg-gradient-to-br from-emerald-100 to-white rounded-2xl p-6 shadow-sm border-l-4 border-emerald-500">
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">{number}</div>
              <h4 className="text-lg font-semibold mb-1">{title}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  
  export default StepsSection;
  