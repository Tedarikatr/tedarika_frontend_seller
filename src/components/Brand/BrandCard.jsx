export default function BrandCard({ brand, ownership, sending, onRequest }) {
  return (
    <div className="flex justify-between items-center border p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
      <div>
        <h4 className="font-semibold text-lg">{brand.name}</h4>
        {ownership ? (
          <p className="text-sm text-gray-600">
            Tür: <b>{ownership.type}</b> | Durum: <b>{ownership.status}</b>
          </p>
        ) : (
          <p className="text-sm text-gray-400">Henüz başvuru yapılmamış.</p>
        )}
      </div>
      <button
        onClick={() => onRequest(brand.id)}
        disabled={sending || ownership}
        className={`px-4 py-2 rounded-md text-white ${
          ownership
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {ownership ? "Başvuru Mevcut" : "Sahiplik Başvurusu Yap"}
      </button>
    </div>
  );
}
