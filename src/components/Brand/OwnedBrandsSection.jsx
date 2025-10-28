export default function OwnedBrandsSection({ ownedBrands }) {
  return (
    <div>
      {ownedBrands.length === 0 ? (
        <p className="text-gray-500">Henüz sahip olduğun marka bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedBrands.map((b) => (
            <div
              key={b.id}
              className="border rounded-lg p-4 bg-green-50 hover:bg-green-100 shadow-sm transition"
            >
              <h4 className="font-semibold text-lg text-gray-800">{b.brandName}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Tür: <b>{b.ownershipType}</b>
              </p>
              <p className="text-sm text-gray-600">
                Durum: <b>{b.status}</b>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
