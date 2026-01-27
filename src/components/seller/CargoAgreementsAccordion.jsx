import React, { useState } from "react";
import { ChevronDown, ChevronUp, Truck, Package } from "lucide-react";
import { cargoAgreements } from "@/data/cargoAgreements";

const CargoAgreementsAccordion = () => {
  const [openBrands, setOpenBrands] = useState({});

  const toggleBrand = (brand) => {
    setOpenBrands((prev) => ({
      ...prev,
      [brand]: !prev[brand],
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getBrandColor = (brand) => {
    const colors = {
      ARAS: "from-blue-500 to-blue-600",
      HEPSIJET: "from-purple-500 to-purple-600",
      KOLAYGELSIN: "from-emerald-500 to-emerald-600",
      PTT: "from-red-500 to-red-600",
      SURAT: "from-orange-500 to-orange-600",
      YURTICI: "from-indigo-500 to-indigo-600",
    };
    return colors[brand] || "from-gray-500 to-gray-600";
  };

  const getBrandBgColor = (brand) => {
    const colors = {
      ARAS: "bg-blue-50 border-blue-200",
      HEPSIJET: "bg-purple-50 border-purple-200",
      KOLAYGELSIN: "bg-emerald-50 border-emerald-200",
      PTT: "bg-red-50 border-red-200",
      SURAT: "bg-orange-50 border-orange-200",
      YURTICI: "bg-indigo-50 border-indigo-200",
    };
    return colors[brand] || "bg-gray-50 border-gray-200";
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Tedarika Anlaşmalı Kargo Fiyatları</h3>
          <p className="text-sm text-gray-600 mt-1">
            Marka bazında desi ve fiyat bilgilerini görüntüleyin
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {cargoAgreements.map((agreement) => {
          const isOpen = openBrands[agreement.brand];
          const brandColor = getBrandColor(agreement.brand);
          const brandBgColor = getBrandBgColor(agreement.brand);

          return (
            <div
              key={agreement.brand}
              className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                isOpen ? brandBgColor : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => toggleBrand(agreement.brand)}
                className={`w-full flex items-center justify-between p-4 text-left transition-all duration-200 ${
                  isOpen ? "bg-gradient-to-r " + brandColor + " text-white" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isOpen
                        ? "bg-white/20 text-white"
                        : `bg-gradient-to-br ${brandColor} text-white`
                    }`}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${isOpen ? "text-white" : "text-gray-900"}`}>
                      {agreement.brand}
                    </h4>
                    <p className={`text-sm ${isOpen ? "text-white/90" : "text-gray-600"}`}>
                      {agreement.prices.length} fiyat aralığı mevcut
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isOpen
                        ? "bg-white/20 text-white"
                        : `bg-gradient-to-r ${brandColor} text-white`
                    }`}
                  >
                    {formatPrice(agreement.prices[0].price)} - {formatPrice(agreement.prices[agreement.prices.length - 1].price)}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {agreement.prices.map((priceItem, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
                      >
                        <div className="flex flex-col items-center text-center">
                          <span className="text-xs font-semibold text-gray-600 mb-1">
                            {priceItem.desi} Desi
                          </span>
                          <span className={`text-lg font-bold bg-gradient-to-r ${brandColor} bg-clip-text text-transparent`}>
                            {formatPrice(priceItem.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Toplam {agreement.prices.length} fiyat aralığı</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">En düşük:</span>
                      <span className="text-emerald-600 font-bold">
                        {formatPrice(Math.min(...agreement.prices.map((p) => p.price)))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <p className="text-sm text-gray-700 flex items-start gap-2">
          <Truck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <span>
            <strong className="text-gray-900">Not:</strong> Fiyatlar Tedarika ile anlaşmalı kargo firmaları için geçerlidir. 
            Fiyatlar güncel olarak güncellenmektedir. Detaylı bilgi için lütfen destek ekibimizle iletişime geçin.
          </span>
        </p>
      </div>
    </div>
  );
};

export default CargoAgreementsAccordion;
