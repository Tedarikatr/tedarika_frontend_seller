const testimonials = [
  {
    name: "Sadık Özer",
    brand: "Anatolia Soap",
    quote:
      "Tedarika ile sadece Türkiye’de değil, yurtdışından da sipariş almaya başladık. Lojistik ve faturalandırma süreçleri sorunsuz ilerliyor.",
  },
  {
    name: "Aziz Aydın",
    brand: "Robotistan",
    quote:
      "Tedarika sayesinde ürünlerimizi binlerce kurumsal alıcıyla buluşturduk. B2B satışlarımızda ciddi bir artış yakaladık.",
  },
];

const TestimonialsSection = () => (
  <section className="bg-emerald-50 py-24 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Başlık */}
      <h2 className="text-4xl font-extrabold text-center text-[#002222] mb-4">
        Satıcılarımız Ne Diyor?
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
        Tedarika’yı tercih eden satıcılar; erişim, hız ve operasyon kolaylığından memnun. İşte bazı başarı hikayeleri:
      </p>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map(({ name, brand, quote }, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition duration-300"
          >
            <p className="text-gray-700 italic mb-4 leading-relaxed">“{quote}”</p>
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-[#003636]">{name}</p>
              <p className="text-sm text-gray-500">{brand}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
