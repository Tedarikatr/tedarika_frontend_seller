// src/components/sellerLanding/CTASection.jsx
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#003636] text-white py-20 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-4">Hemen Mağazanı Aç</h2>
        <p className="text-lg text-gray-300 mb-8">
          Sadece birkaç adımda <span className="text-emerald-400 font-semibold">Tedarika satıcısı</span> olun.
        </p>
        <button
          onClick={() => navigate("/seller/register")}
          className="bg-white text-[#003636] hover:bg-gray-100 font-bold px-8 py-3 rounded-full text-lg shadow-md transition-all duration-200"
        >
          Başvur ve Satışa Başla
        </button>
      </div>
    </section>
  );
};

export default CTASection;
