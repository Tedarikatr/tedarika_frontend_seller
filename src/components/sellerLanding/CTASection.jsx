// src/components/sellerLanding/CTASection.jsx
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#003636] text-white py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Hemen Mağazanı Aç</h2>
      <p className="text-lg text-gray-200 mb-6">Sadece birkaç adımda Tedarika satıcısı olun.</p>
      <button
        onClick={() => navigate("/seller/register")}
        className="bg-white text-[#003636] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
      >
        Başvur ve Satışa Başla
      </button>
    </section>
  );
};

export default CTASection;
