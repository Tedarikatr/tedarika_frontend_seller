import React, { useEffect, useRef, useState } from "react";
import {
  // varsa kullanılır, yoksa fallback yapılır
  listProductImages,
  uploadProductImages,
  deleteProductImage,
  fetchMyStoreProducts,
} from "@/api/sellerStoreService";
import { Image as ImageIcon, Upload, Trash2, X, Copy, Check } from "lucide-react";

/* helpers */
const cls = (...a) => a.filter(Boolean).join(" ");
const withBuster = (url, buster) => {
  if (!url) return url;
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set("v", String(buster));
    return u.toString();
  } catch {
    return `${url}${url.includes("?") ? "&" : "?"}v=${buster}`;
  }
};

/* drag-drop alanı */
const FileDrop = ({ onFiles, disabled }) => {
  const [isOver, setOver] = useState(false);
  const onDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) onFiles(files);
    setOver(false);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setOver(true);
  };
  const onDragLeave = () => setOver(false);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={cls(
        "rounded-2xl border-2 border-dashed p-6 text-center transition",
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Upload size={20} />
        <div className="text-sm font-medium">Görselleri buraya sürükle-bırak</div>
        <div className="text-xs text-gray-500">veya aşağıdan dosya seç</div>
      </div>
    </div>
  );
};

/* küçük kart */
const Thumb = ({ img, buster, onPreview, onDelete }) => (
  <div className="group relative">
    <img
      src={withBuster(img.url, buster)}
      alt=""
      className="w-28 h-28 object-cover rounded-xl border"
      onClick={() => onPreview(img)}
    />
    {/* id yoksa sil butonu görünmesin */}
    {img.id && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(img.id);
        }}
        title="Sil"
        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
);

/* büyük önizleme */
const Lightbox = ({ open, img, buster, onClose }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [img]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ImageIcon size={16} /> Önizleme
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <img
            src={withBuster(img?.url, buster)}
            alt=""
            className="max-h-[65vh] w-full object-contain rounded-lg bg-gray-50"
          />
          <div className="flex items-center justify-between">
            <div className="truncate text-xs text-gray-500">{img?.url}</div>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(img?.url || "");
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              className="text-xs px-3 py-1.5 rounded-md bg-gray-800 text-white flex items-center gap-1"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} URL kopyala
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Ana yöneticı */
const ProductImagesManager = ({ storeProductId }) => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]); // {id?, url}
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buster, setBuster] = useState(Date.now());

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const tempBlobs = useRef([]);

  /* --- LISTELEME: önce listProductImages dene, yoksa my-products fallback --- */
  const load = async () => {
    try {
      if (typeof listProductImages === "function") {
        const data = await listProductImages(storeProductId);
        const normalized =
          (data || []).map((x) => ({
            id: x.id ?? x.imageId ?? x.guid ?? null,
            url: x.url ?? x.imageUrl ?? x.path ?? "",
          })) ?? [];
        if (normalized.length) {
          setImages(normalized);
          return;
        }
      }
    } catch (e) {
      // ignore, fallback’e geç
      console.warn("listProductImages hata/boş, my-products fallback", e);
    }

    // Fallback: tüm ürünleri çekip ilgili ürünü bul
    try {
      const all = await fetchMyStoreProducts();
      const item =
        (all || []).find(
          (p) =>
            p.storeProductId === storeProductId ||
            p.id === storeProductId
        ) || {};
      const urls =
        item.storeProductImagesUrls?.length
          ? item.storeProductImagesUrls
          : item.productImageUrls || [];
      setImages((urls || []).map((u) => ({ id: null, url: u })));
    } catch (e2) {
      console.error("fallback fetchMyStoreProducts hatası:", e2);
      setImages([]);
    }
  };

  useEffect(() => {
    load();
    return () => {
      tempBlobs.current.forEach((u) => URL.revokeObjectURL(u));
      tempBlobs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeProductId]);

  /* --- İyimser ekleme --- */
  const optimisticAdd = (files) => {
    const now = Date.now();
    const items = files.map((f, i) => {
      const url = URL.createObjectURL(f);
      tempBlobs.current.push(url);
      return { id: `temp-${now}-${i}`, url, _temp: true, __file: f };
    });
    setImages((prev) => [...items, ...prev]);
  };

  /* --- Dosya seçimi --- */
  const handleFiles = async (files) => {
    if (!files?.length) return;
    optimisticAdd(files);
    setUploading(true);
    setProgress(0);
    try {
      const total = files.length;
      let done = 0;
      // tek tek yükle (çoğu backend daha stabil)
      for (const f of files) {
        await uploadProductImages(storeProductId, [f]);
        done += 1;
        setProgress(Math.round((done / total) * 100));
      }
      await load();               // server’dan taze liste
      setBuster(Date.now());      // cache kır
    } finally {
      setUploading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
      tempBlobs.current.forEach((u) => URL.revokeObjectURL(u));
      tempBlobs.current = [];
    }
  };

  const onPick = () => inputRef.current?.click();

  /* --- Silme (id yoksa buton çıkmaz) --- */
  const handleDelete = async (imageId) => {
    if (!imageId) return; // URL ile silemiyoruz
    // iyimser
    setImages((prev) => prev.filter((i) => i.id !== imageId));
    try {
      await deleteProductImage(imageId);
    } catch (e) {
      console.warn("deleteProductImage hata:", e);
    }
    await load();
    setBuster(Date.now());
  };

  return (
    <div className="space-y-4">
      {/* üst bar */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Görseller</div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={inputRef}
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            className="hidden"
          />
          <button
            onClick={onPick}
            disabled={uploading}
            className={cls(
              "px-3 py-1.5 rounded-md text-white text-sm flex items-center gap-1",
              uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <Upload size={16} /> Dosya Seç
          </button>
        </div>
      </div>

      {/* drop alanı */}
      <FileDrop onFiles={handleFiles} disabled={uploading} />

      {/* progress */}
      {uploading || progress > 0 ? (
        <div className="w-full bg-gray-100 rounded-lg h-2 overflow-hidden">
          <div
            className="h-2 bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {/* grid */}
      {images.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((img) => (
            <Thumb
              key={img.id || img.url}
              img={img}
              buster={buster}
              onPreview={(i) => {
                setPreviewImg(i);
                setPreviewOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Henüz görsel yok.</div>
      )}

      <Lightbox
        open={previewOpen}
        img={previewImg}
        buster={buster}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default ProductImagesManager;
