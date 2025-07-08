// src/components/sellerLanding/TestimonialsSection.jsx
const testimonials = [
    {
      name: "Sadık Özer",
      brand: "Anatolia Soap",
      quote: "Tedarika ile global sipariş almaya başladık, lojistik süreçleri kolaylaştı."
    },
    {
      name: "Aziz Aydın",
      brand: "Robotistan",
      quote: "Tedarika sayesinde ürünlerimizi binlerce işletmeye ulaştırdık."
    }
  ];
  
  const TestimonialsSection = () => (
    <section className="bg-emerald-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Satıcılarımız Ne Diyor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(({ name, brand, quote }, i) => (
            <div key={i} className="bg-white border-l-4 border-emerald-400 p-6 rounded-xl shadow">
              <h4 className="font-semibold mb-1">{brand}</h4>
              <p className="text-gray-700 italic mb-2">“{quote}”</p>
              <p className="text-sm text-gray-500">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  
  export default TestimonialsSection;
  