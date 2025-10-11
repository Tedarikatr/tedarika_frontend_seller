import React, { useEffect, useState } from "react";
import { Globe, Layers, Package } from "lucide-react";
import { fetchMyStoreProducts } from "@/api/sellerStoreService";

export default function StepProductSelect({ data, setData, next, prev }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ürünleri getir
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchMyStoreProducts();
        setProducts(res || []);
      } catch (err) {
        console.error("Ürün listesi alınamadı:", err);
        setError("Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setScope = (scope) =>
    setData((p) => ({
      ...p,
      targeting: { ...p.targeting, scope, items: [] },
    }));

  const toggleProduct = (product) => {
    const exists = data.targeting.items.some((i) => i.productId === product.id);
    if (exists) {
      setData((p) => ({
        ...p,
        targeting: {
          ...p.targeting,
          items: p.targeting.items.filter((x) => x.productId !== product.id),
        },
      }));
    } else {
      setData((p) => ({
        ...p,
        targeting: {
          ...p.targeting,
          items: [
            ...p.targeting.items,
            {
              id: crypto.randomUUID(),
              productId: product.id,
              categoryId: product.categoryId || 0,
            },
          ],
        },
      }));
    }
  };

  const isSelected = (id) =>
    data.targeting.items.some((i) => i.productId === id);

  // Sayfalama
  const totalPages = Math.ceil(products.length / pageSize);
  const visibleProducts = products.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-8">
        Kampanya Hedefi: Ürün / Kategori Seçimi
      </h2>

      {/* Scope Seçimi */}
      <div className="grid md:grid-cols-3 gap-6">
        <ScopeCard
          icon={<Globe size={26} />}
          title="Tüm Ürünler"
          desc="Mağazandaki tüm ürünlerde geçerli olur."
          active={data.targeting.scope === "AllProducts"}
          onClick={() => setScope("AllProducts")}
        />
        <ScopeCard
          icon={<Layers size={26} />}
          title="Belirli Kategoriler"
          desc="Seçtiğin kategorilerde geçerli olur."
          active={data.targeting.scope === "Categories"}
          onClick={() => setScope("Categories")}
        />
        <ScopeCard
          icon={<Package size={26} />}
          title="Belirli Ürünler"
          desc="Seçtiğin ürünlerde geçerli olur."
          active={data.targeting.scope === "SpecificProducts"}
          onClick={() => setScope("SpecificProducts")}
        />
      </div>

      {/* Ürün listesi (scope = SpecificProducts) */}
      {data.targeting.scope === "SpecificProducts" && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Ürün Seçimi
          </h3>

          {loading ? (
            <div className="text-gray-500 text-sm">Ürünler yükleniyor...</div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-gray-500 italic p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
              Henüz mağazanda kayıtlı ürün bulunmuyor.
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p)}
                    className={`relative rounded-xl border p-4 cursor-pointer transition group hover:shadow-md ${
                      isSelected(p.id)
                        ? "border-orange-500 ring-2 ring-orange-300 bg-orange-50"
                        : "border-gray-200 hover:border-orange-400"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                      <img
                        src={
                          p.productImageUrls?.[0] ||
                          "https://placehold.co/400x400?text=Ürün"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 truncate">
                      {p.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {p.categoryName} • {p.unitPrice} ₺
                    </p>
                    {isSelected(p.id) && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Seçildi
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                  >
                    ← Önceki
                  </button>
                  <span className="text-gray-600 text-sm">
                    Sayfa {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                  >
                    Sonraki →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigasyon Butonları */}
      <div className="flex justify-between mt-10">
        <button
          onClick={prev}
          className="border border-gray-300 px-8 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Geri
        </button>
        <button
          onClick={next}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}

/* 🎨 Alt bileşen: ScopeCard */
const ScopeCard = ({ icon, title, desc, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-3 justify-start shadow-sm hover:shadow-md ${
      active
        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
        : "border-gray-200 hover:border-orange-400"
    }`}
  >
    <div
      className={`w-fit p-3 rounded-xl ${
        active ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
      }`}
    >
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      <p className="text-sm text-gray-500 leading-snug">{desc}</p>
    </div>
  </button>
);
