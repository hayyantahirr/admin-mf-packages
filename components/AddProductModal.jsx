import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";
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
    genDescription: "",
    showCapacity: true,
    technicalSpecs: {
      colour: "",
      waterproof: "false",
      style: "",
      heatSealable: "false",
      tearNotch: "false",
      closure: "",
      window: "",
    },
    capacitySpecs: {
      ricePulses: "",
      pinkSalt: "",
      mixNimco: "",
      mixSeeds: "",
      moringaPowder: "",
      mixDryFruits: "",
      ispaghol: "",
      dehydratedFruits: "",
      mixSpices: "",
      tea: "",
      flour: "",
    },
  });

  const [mainImage, setMainImage] = useState(null); // File object for new uploads
  const [extraImagesState, setExtraImagesState] = useState([]); // Array of { url, file }
  const [previews, setPreviews] = useState({
    main: null, // URL string
  });
  const [materialRows, setMaterialRows] = useState([{ key: "", value: "" }]);

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
        genDescription: product.genDescription || "",
        showCapacity: product.showCapacity !== false, // Default to true if undefined
        technicalSpecs: {
          colour: product.technicalSpecs?.colour || "",
          waterproof: product.technicalSpecs?.waterproof ? "true" : "false",
          style: product.technicalSpecs?.style || "",
          heatSealable: product.technicalSpecs?.heatSealable ? "true" : "false",
          tearNotch: product.technicalSpecs?.tearNotch ? "true" : "false",
          closure: product.technicalSpecs?.closure || "",
          window: product.technicalSpecs?.window || "",
        },
        capacitySpecs: {
          ricePulses: product.capacitySpecs?.["Rice & Pulses"] || "",
          pinkSalt: product.capacitySpecs?.["Pink Salt"] || "",
          mixNimco: product.capacitySpecs?.["Mix Nimco"] || "",
          mixSeeds: product.capacitySpecs?.["Mix Seeds"] || "",
          moringaPowder: product.capacitySpecs?.["Moringa Powder"] || "",
          mixDryFruits: product.capacitySpecs?.["Mix Dry Fruits"] || "",
          ispaghol: product.capacitySpecs?.["Ispaghol"] || "",
          dehydratedFruits: product.capacitySpecs?.["Dehydrated Fruits"] || "",
          mixSpices: product.capacitySpecs?.["Mix Spices"] || "",
          tea: product.capacitySpecs?.["Tea"] || "",
          flour: product.capacitySpecs?.["Flour"] || "",
        },
      });
      setPreviews({
        main: product.mainImage || null,
      });
      setExtraImagesState(
        (product.extraImages || []).map((url) => ({ url, file: null })),
      );
      setMainImage(null);

      // Convert materialStructure object to rows
      const rows = Object.entries(product.materialStructure || {}).map(
        ([key, value]) => ({
          key,
          value,
        }),
      );
      setMaterialRows(rows.length > 0 ? rows : [{ key: "", value: "" }]);
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
        genDescription: "",
        showCapacity: true,
        technicalSpecs: {
          colour: "",
          waterproof: "false",
          style: "",
          heatSealable: "false",
          tearNotch: "false",
          closure: "",
          window: "",
        },
        capacitySpecs: {
          ricePulses: "",
          pinkSalt: "",
          mixNimco: "",
          mixSeeds: "",
          moringaPowder: "",
          mixDryFruits: "",
          ispaghol: "",
          dehydratedFruits: "",
          mixSpices: "",
          tea: "",
          flour: "",
        },
      });
      setPreviews({ main: null });
      setExtraImagesState([]);
      setMainImage(null);
      setMaterialRows([{ key: "", value: "" }]);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  // Material Row Handlers
  const handleAddMaterialRow = () => {
    setMaterialRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveMaterialRow = (index) => {
    if (materialRows.length > 1) {
      setMaterialRows((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMaterialRows([{ key: "", value: "" }]);
    }
  };

  const handleMaterialRowChange = (index, field, value) => {
    const updatedRows = [...materialRows];
    updatedRows[index][field] = value;
    setMaterialRows(updatedRows);
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

  const handleToggleCapacity = () => {
    setFormData((prev) => ({ ...prev, showCapacity: !prev.showCapacity }));
  };

  const isFormValid = () => {
    const hasMaterial = materialRows.some((row) => row.key.trim() !== "");
    const hasRequiredFields =
      formData.name.trim() !== "" &&
      formData.size.trim() !== "" &&
      formData.price.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.stockAmount.trim() !== "" &&
      formData.category !== "";

    return hasMaterial && hasRequiredFields && previews.main;
  };

  const formatCapacityValue = (val) => {
    if (!val) return "";
    const trimmed = val.trim();
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}g`;
    }
    return trimmed;
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
        showCapacity: formData.showCapacity,
        technicalSpecs: {
          colour: formData.technicalSpecs.colour,
          waterproof: formData.technicalSpecs.waterproof === "true",
          style: formData.technicalSpecs.style,
          heatSealable: formData.technicalSpecs.heatSealable === "true",
          tearNotch: formData.technicalSpecs.tearNotch === "true",
          closure: formData.technicalSpecs.closure,
          window: formData.technicalSpecs.window,
        },
        materialStructure: materialRows.reduce((acc, row) => {
          if (row.key.trim()) {
            acc[row.key.trim()] = row.value.trim();
          }
          return acc;
        }, {}),
        capacitySpecs: formData.showCapacity
          ? Object.entries(formData.capacitySpecs).reduce((acc, [key, val]) => {
              const formatted = formatCapacityValue(val);
              if (formatted) {
                const labels = {
                  ricePulses: "Rice & Pulses",
                  pinkSalt: "Pink Salt",
                  mixNimco: "Mix Nimco",
                  mixSeeds: "Mix Seeds",
                  moringaPowder: "Moringa Powder",
                  mixDryFruits: "Mix Dry Fruits",
                  ispaghol: "Ispaghol",
                  dehydratedFruits: "Dehydrated Fruits",
                  mixSpices: "Mix Spices",
                  tea: "Tea",
                  flour: "Flour",
                };
                acc[labels[key] || key] = formatted;
              }
              return acc;
            }, {})
          : {},
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
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b3a4c] shadow-2xl transition-all duration-300 border border-white/10">
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b3a4c]/80 px-8 py-5 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#fa1a00] mb-4">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">
                      Product Name <RequiredStar />
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="e.g. Kraft Pouch 250g"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">
                        Size <RequiredStar />
                      </label>
                      <input
                        required
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="e.g. 10x15cm"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">
                        Category <RequiredStar />
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      >
                        <option value="">Select Category</option>
                        <option value="Kraft paper standup pouch">
                          Kraft paper standup pouch
                        </option>
                        <option value="Aluminum pouches">
                          Aluminum pouches
                        </option>
                        <option value="Flat bottom pouches">
                          Flat bottom pouches
                        </option>
                        <option value="Plastic pouches">Plastic pouches</option>
                        <option value="Spout pouches">Spout pouches</option>
                        <option value="Retort pouches">Retort pouches</option>
                        <option value="Chocolate sheets">
                          Chocolate sheets
                        </option>
                        <option value="Coffee pouches">Coffee pouches</option>
                        <option value="PVC shrink capsules">
                          PVC shrink capsules
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">
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
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">
                        Printing Price (Rs.)
                      </label>
                      <input
                        name="printingPrice"
                        value={formData.printingPrice}
                        onChange={handleInputChange}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">
                        In Stock
                      </label>
                      <select
                        name="inStock"
                        value={formData.inStock}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">
                        Stock Amount <RequiredStar />
                      </label>
                      <input
                        required
                        name="stockAmount"
                        value={formData.stockAmount}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">
                      Description <RequiredStar />
                    </label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Enter main product description..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all resize-none placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">
                      General Description
                    </label>
                    <textarea
                      name="genDescription"
                      value={formData.genDescription}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Enter extra general information..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all resize-none placeholder:text-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications Section */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#fa1a00] mb-4">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl">
                  {/* Colour */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white">
                      Colour
                    </label>
                    <select
                      name="technicalSpecs.colour"
                      value={formData.technicalSpecs.colour}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    >
                      <option value="">Select Colour</option>
                      <option value="Brown">Brown</option>
                      <option value="White">White</option>
                      <option value="Black">Black</option>
                      <option value="Silver">Silver</option>
                      <option value="Transparent">Transparent</option>
                      <option value="Gold">Gold</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {/* Style */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white">
                      Style
                    </label>
                    <select
                      name="technicalSpecs.style"
                      value={formData.technicalSpecs.style}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    >
                      <option value="">Select Style</option>
                      <option value="Stand up">Stand up</option>
                      <option value="Flat Bottom">Flat Bottom</option>
                      <option value="Side Gusset">Side Gusset</option>
                      <option value="Pillow Pouch">Pillow Pouch</option>
                      <option value="Spout">Spout</option>
                    </select>
                  </div>

                  {/* Waterproof */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white">
                      Waterproof / Oil-proof
                    </label>
                    <select
                      name="technicalSpecs.waterproof"
                      value={formData.technicalSpecs.waterproof}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {/* Heat Sealable */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white">
                      Heat Sealable
                    </label>
                    <select
                      name="technicalSpecs.heatSealable"
                      value={formData.technicalSpecs.heatSealable}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {/* Tear Notch */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white">
                      Tear Notch
                    </label>
                    <select
                      name="technicalSpecs.tearNotch"
                      value={formData.technicalSpecs.tearNotch}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0b3a4c] px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {/* Closure */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white">
                      Closure
                    </label>
                    <input
                      name="technicalSpecs.closure"
                      value={formData.technicalSpecs.closure}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="e.g., Resealable Zipper"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                    />
                  </div>

                  {/* Window */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-white">
                      Window
                    </label>
                    <input
                      name="technicalSpecs.window"
                      value={formData.technicalSpecs.window}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="e.g., Clear Rectangle, Oval, or None"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Product Capacity Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[#fa1a00]">
                      Product Capacity
                    </h4>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.showCapacity}
                        onChange={handleToggleCapacity}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#fa1a00] peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none" />
                      <span className="ml-3 text-xs font-bold text-white/40 uppercase">
                        {formData.showCapacity ? "Included" : "Excluded"}
                      </span>
                    </label>
                  </div>
                  {formData.showCapacity && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300">
                      {[
                        { key: "ricePulses", label: "Rice & Pulses" },
                        { key: "pinkSalt", label: "Pink Salt" },
                        { key: "mixNimco", label: "Mix Nimco" },
                        { key: "mixSeeds", label: "Mix Seeds" },
                        { key: "moringaPowder", label: "Moringa Powder" },
                        { key: "mixDryFruits", label: "Mix Dry Fruits" },
                        { key: "ispaghol", label: "Ispaghol" },
                        { key: "dehydratedFruits", label: "Dehydrated Fruits" },
                        { key: "mixSpices", label: "Mix Spices" },
                        { key: "tea", label: "Tea" },
                        { key: "flour", label: "Flour" },
                      ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            name={`capacitySpecs.${field.key}`}
                            value={formData.capacitySpecs[field.key]}
                            onChange={handleInputChange}
                            placeholder="e.g. 50g"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Material Structure Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[#fa1a00]">
                    Material Structure
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMaterialRow}
                    className="text-xs font-bold text-white hover:text-[#fa1a00] transition-colors flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                  >
                    <Plus size={14} /> Add Layer
                  </button>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                  {materialRows.map((row, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          placeholder="Layer (e.g. MOPP)"
                          value={row.key}
                          onChange={(e) =>
                            handleMaterialRowChange(
                              index,
                              "key",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                        />
                      </div>
                      <div className="w-1/3">
                        <input
                          placeholder="Microns"
                          value={row.value}
                          onChange={(e) =>
                            handleMaterialRowChange(
                              index,
                              "value",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all placeholder:text-white/20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterialRow(index)}
                        className="rounded-xl p-2 text-white/20 hover:bg-[#fa1a00]/10 hover:text-[#fa1a00] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#fa1a00] mb-4">
                  Product Images
                </h4>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80">
                    Main Product Image <RequiredStar />
                  </label>
                  <div className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-[#fa1a00] hover:bg-[#fa1a00]/5 overflow-hidden">
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
                          className="absolute top-3 right-3 bg-[#fa1a00] rounded-full p-2 text-white hover:bg-red-700 transition-colors shadow-xl"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center space-y-2 text-white/20 group-hover:text-[#fa1a00]">
                          <Upload size={40} />
                          <span className="text-sm font-bold uppercase tracking-widest">
                            Upload thumbnail
                          </span>
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

                <div className="mt-10 space-y-3">
                  <label className="text-sm font-medium text-white/80">
                    Extra Images (Max 5)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {extraImagesState.map((item, i) => (
                      <div
                        key={i}
                        className="group relative flex aspect-square rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-lg"
                      >
                        <img
                          src={item.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(i)}
                          className="absolute top-1 right-1 bg-black/60 backdrop-blur-md rounded-full p-1 text-white hover:bg-[#fa1a00] transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {extraImagesState.length < 5 && (
                      <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-[#fa1a00] hover:bg-[#fa1a00]/5">
                        <div className="text-white/20 group-hover:text-[#fa1a00]">
                          <ImageIcon size={24} />
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

          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 border-t border-white/10 bg-[#0b3a4c] px-8 py-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-8 py-3 font-bold text-white/60 uppercase tracking-widest text-xs transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="flex items-center gap-2 rounded-xl bg-white px-10 py-3 font-black text-[#0b3a4c] uppercase tracking-widest text-xs shadow-2xl transition-all hover:bg-[#fa1a00] hover:text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
