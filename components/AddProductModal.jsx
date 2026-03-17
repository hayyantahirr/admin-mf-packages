import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { db } from "../config/firebase";
import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function AddProductModal({ isOpen, onClose, product = null }) {
  const isEditMode = !!product;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
    description: "",
    amountOfDescription: "",
    printingPrice: "",
    category: "",
    inStock: "true",
    stockAmount: "",
    sku: "",
  });

  const [mainImage, setMainImage] = useState(null); // File object for new uploads
  const [extraImagesState, setExtraImagesState] = useState([]); // Array of { url, file }
  const [previews, setPreviews] = useState({
    main: null, // URL string
  });

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        size: product.size || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        amountOfDescription: product.amountOfDescription || "",
        printingPrice: product.printingPrice?.toString() || "",
        category: product.category || "",
        inStock: product.inStock ? "true" : "false",
        stockAmount: product.stockAmount?.toString() || "",
        sku: product.sku || "",
      });
      setPreviews({
        main: product.mainImage || null,
      });
      setExtraImagesState(
        (product.extraImages || []).map((url) => ({ url, file: null })),
      );
      setMainImage(null);
    } else if (!product && isOpen) {
      setFormData({
        name: "",
        size: "",
        price: "",
        description: "",
        amountOfDescription: "",
        printingPrice: "",
        category: "",
        inStock: "true",
        stockAmount: "",
        sku: "",
      });
      setPreviews({ main: null });
      setExtraImagesState([]);
      setMainImage(null);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviews((prev) => ({
        ...prev,
        main: URL.createObjectURL(file),
      }));
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const remainingSlots = 5 - extraImagesState.length;
      const newFiles = files.slice(0, remainingSlots);

      const newEntries = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));

      setExtraImagesState((prev) => [...prev, ...newEntries]);
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setPreviews((prev) => ({ ...prev, main: null }));
  };

  const removeExtraImage = (index) => {
    const itemToRemove = extraImagesState[index];
    if (itemToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(itemToRemove.url);
    }
    setExtraImagesState((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mf-packages");
    data.append("cloud_name", "dblnkp5ny");

    try {
      const resp = await fetch(
        "https://api.cloudinary.com/v1_1/dblnkp5ny/image/upload",
        {
          method: "POST",
          body: data,
        },
      );
      const json = await resp.json();
      return json.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!previews.main) {
      alert("Please upload a main product image.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      // 1. Handle Main Image URL
      let mainImageUrl = previews.main;
      if (mainImage) {
        mainImageUrl = await uploadToCloudinary(mainImage);
      }

      // 2. Handle Extra Images
      const combinedExtraImages = await Promise.all(
        extraImagesState.map(async (item) => {
          if (item.file) {
            // It's a new file, upload it
            return await uploadToCloudinary(item.file);
          }
          // It's an existing URL, keep it
          return item.url;
        }),
      );

      const productData = {
        name: formData.name,
        size: formData.size,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        amountOfDescription: formData.amountOfDescription || "",
        printingPrice: formData.printingPrice
          ? parseFloat(formData.printingPrice)
          : null,
        category: formData.category,
        inStock: formData.inStock === "true",
        stockAmount: parseInt(formData.stockAmount) || 0,
        mainImage: mainImageUrl,
        extraImages: combinedExtraImages.filter((url) => url !== null),
      };

      if (isEditMode) {
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, {
          ...productData,
          updatedAt: serverTimestamp(),
        });
        alert("Product updated successfully!");
      } else {
        const docRef = doc(collection(db, "products"));
        await setDoc(docRef, {
          ...productData,
          id: docRef.id,
          createdAt: serverTimestamp(),
        });
        alert("Product added successfully!");
      }

      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all duration-300">
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-8 py-5 backdrop-blur-md">
            <h3 className="text-xl font-bold text-[#0b3a4c]">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Product Name <RequiredStar />
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Size <RequiredStar />
                      </label>
                      <input
                        required
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Category <RequiredStar />
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all bg-white"
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Stationery">Stationery</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Price (Rs.) <RequiredStar />
                      </label>
                      <input
                        required
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        type="number"
                        step="0.01"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Printing Price (Rs.)
                      </label>
                      <input
                        name="printingPrice"
                        value={formData.printingPrice}
                        onChange={handleInputChange}
                        type="number"
                        step="0.01"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        In Stock
                      </label>
                      <select
                        name="inStock"
                        value={formData.inStock}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all bg-white"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Stock Amount <RequiredStar />
                      </label>
                      <input
                        required
                        name="stockAmount"
                        value={formData.stockAmount}
                        onChange={handleInputChange}
                        type="number"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Description <RequiredStar />
                    </label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Amount of Description
                    </label>
                    <textarea
                      name="amountOfDescription"
                      value={formData.amountOfDescription}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Product Images
                </h4>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Main Product Image <RequiredStar />
                  </label>
                  <div className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#fa1a00] hover:bg-red-50/30 overflow-hidden">
                    {previews.main ? (
                      <div className="relative h-full w-full">
                        <img
                          src={previews.main}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 text-red-500 hover:bg-white transition-colors shadow-sm"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-[#fa1a00]">
                          <Upload size={32} />
                          <span className="text-sm font-medium">Upload thumbnail</span>
                        </div>
                        <input
                          required={!isEditMode}
                          type="file"
                          onChange={handleMainImageChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Extra Images (Max 5)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {extraImagesState.map((item, i) => (
                      <div
                        key={i}
                        className="group relative flex aspect-square rounded-lg border border-slate-200 bg-slate-50 overflow-hidden"
                      >
                        <img src={item.url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(i)}
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {extraImagesState.length < 5 && (
                      <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#fa1a00] hover:bg-red-50/30">
                        <div className="text-slate-300 group-hover:text-[#fa1a00]">
                          <ImageIcon size={20} />
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={handleExtraImagesChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-8 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-6 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#0b3a4c] px-8 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-[#0d465c] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Saving..." : isEditMode ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
