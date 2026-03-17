import { useState } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

export default function AddProductModal({ isOpen, onClose }) {
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
    sku: "", // Kept for consistency if needed, though not in the rough schema
  });
  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [previews, setPreviews] = useState({
    main: null,
    extras: [],
  });

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
      const remainingSlots = 5 - extraImages.length;
      const newFiles = files.slice(0, remainingSlots);

      setExtraImages((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => ({
        ...prev,
        extras: [...prev.extras, ...newPreviews],
      }));
    }
  };

  const removeExtraImage = (index) => {
    URL.revokeObjectURL(previews.extras[index]);
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => ({
      ...prev,
      extras: prev.extras.filter((_, i) => i !== index),
    }));
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

    // Explicit Validation Check
    if (!mainImage) {
      alert("Please upload a main product image.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Main Image
      const mainImageUrl = mainImage ? await uploadToCloudinary(mainImage) : "";

      // 2. Upload Extra Images
      const extraImageUrls = await Promise.all(
        extraImages.map((file) => uploadToCloudinary(file)),
      );
      const filteredExtraUrls = extraImageUrls.filter((url) => url !== null);

      // 3. Save to Firestore
      const docRef = doc(collection(db, "products"));
      const productData = {
        id: docRef.id,
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
        extraImages: filteredExtraUrls,
        createdAt: serverTimestamp(),
      };

      await setDoc(docRef, productData);

      alert("Product added successfully!");
      onClose();
      // Reset form
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
      });
      setMainImage(null);
      setExtraImages([]);
      setPreviews({ main: null, extras: [] });
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product. Please try again.");
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
              Add New Product
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
            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  {/* Name */}
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
                      placeholder="Product Name"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    />
                  </div>

                  {/* Size & Category */}
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
                        placeholder="e.g. 14X20 CM"
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
                        {/* Add more categories as needed */}
                      </select>
                    </div>
                  </div>

                  {/* Price & Printing Price */}
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
                        placeholder="0.00"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Printing Price (Rs.) - Optional
                      </label>
                      <input
                        name="printingPrice"
                        value={formData.printingPrice}
                        onChange={handleInputChange}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Stock Status & Stock Amount */}
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
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Description <RequiredStar />
                    </label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed product description..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Amount of Description */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Amount of Description (Optional)
                    </label>
                    <textarea
                      name="amountOfDescription"
                      value={formData.amountOfDescription}
                      onChange={handleInputChange}
                      placeholder="Additional details..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Product Images
                </h4>

                {/* Main Image */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Main Product Image <RequiredStar />
                  </label>
                  <div className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#fa1a00] hover:bg-red-50/30 overflow-hidden">
                    {previews.main ? (
                      <img
                        src={previews.main}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-[#fa1a00]">
                        <Upload size={32} />
                        <span className="text-sm font-medium">
                          Upload thumbnail
                        </span>
                      </div>
                    )}
                    <input
                      required
                      type="file"
                      onChange={handleMainImageChange}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Optional Extra Images */}
                <div className="mt-6 space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Extra Images (Optional - Max 5)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {previews.extras.map((preview, i) => (
                      <div
                        key={i}
                        className="group relative flex aspect-square rounded-lg border border-slate-200 bg-slate-50 overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`Extra ${i}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(i)}
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {previews.extras.length < 5 && (
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

          {/* Modal Footer */}
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
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
