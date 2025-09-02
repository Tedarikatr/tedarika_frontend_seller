// src/components/seller/TaxOfficeSelect.jsx
import taxOffices from "@/assets/vergi_daire_adlari.json";

/** Tekrarlı kayıtları at ve TR’ye göre sırala */
const OPTIONS = [...new Set(taxOffices)].sort((a, b) => a.localeCompare(b, "tr"));

export default function TaxOfficeSelect({
  value,
  onChange,
  required = false,
  name = "taxOffice",
  placeholder = "Vergi Dairesi Seçin",
  className = "input bg-[#f8fdfc] text-[#002222]"
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={className}
    >
      <option value="">{placeholder}</option>
      {OPTIONS.map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
}
