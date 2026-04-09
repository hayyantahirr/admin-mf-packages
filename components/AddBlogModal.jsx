import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Loader2,
  FileText,
  ImageIcon,
  Leaf,
  Package,
  Shield,
  Zap,
  Star,
  Info,
} from "lucide-react";
import { db } from "../config/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const ICON_OPTIONS = [
  { name: "Leaf", icon: Leaf },
  { name: "Package", icon: Package },
  { name: "Shield", icon: Shield },
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "Info", icon: Info },
];

const COLOR_OPTIONS = [
  {
    name: "Green",
    value: "bg-gradient-to-r from-green-500 to-emerald-600",
  },
  {
    name: "Blue",
    value: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  {
    name: "Red",
    value: "bg-gradient-to-r from-red-500 to-rose-600",
  },
  {
    name: "Amber",
    value: "bg-gradient-to-r from-amber-500 to-orange-600",
  },
  {
    name: "Purple",
    value: "bg-gradient-to-r from-purple-500 to-violet-600",
  },
  {
    name: "Slate",
    value: "bg-gradient-to-r from-slate-600 to-slate-800",
  },
];

export default function AddBlogModal({ isOpen, onClose, post = null }) {
  const isEditMode = !!post;
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    readTime: "",
    icon: "Leaf",
    color: "from-green-500 to-emerald-600",
  });

  useEffect(() => {
    if (post && isOpen) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category: post.category || "",
        readTime: post.readTime || "",
        icon: post.iconName || "Leaf",
        color: post.color || "from-green-500 to-emerald-600",
      });
      setImagePreview(post.image || null);
      setImageFile(null);
    } else if (!post && isOpen) {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        readTime: "",
        icon: "Leaf",
        color: "from-green-500 to-emerald-600",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      console.error("Cloudinary environment variables are missing");
      return null;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);
    data.append("cloud_name", cloudName);

    try {
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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

    if (!imagePreview) {
      alert("Please upload a featured image.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        readTime: formData.readTime,
        iconName: formData.icon, // Store name as string
        color: formData.color,
        image: imageUrl,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };

      if (isEditMode) {
        const postRef = doc(db, "blogs", post.id);
        await updateDoc(postRef, {
          ...postData,
          updatedAt: serverTimestamp(),
        });
        alert("Blog post updated successfully!");
      } else {
        const docRef = doc(collection(db, "blogs"));
        await setDoc(docRef, {
          ...postData,
          id: docRef.id,
          createdAt: serverTimestamp(),
        });
        alert("Blog post created successfully!");
      }

      onClose();
    } catch (err) {
      console.error("Error saving blog post:", err);
      alert("Failed to save blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg bg-red-50 p-2 text-[#fa1a00]`}>
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? "Edit Blog Post" : "Create New Post"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? "Update your existing article details"
                  : "Fill in the details for your new article"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="The Rise of Kraft Pouches..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00]"
              />
            </div>

            {/* Image Preview & Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Featured Image <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#fa1a00] hover:bg-red-50/30">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload size={24} />
                    <span className="text-xs font-medium">
                      Click to upload image
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="group relative h-40 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                      <p className="text-white text-xs font-medium">
                        Current Image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
                placeholder="A brief summary of the post..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00]"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                placeholder="Write your article here..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00]"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Sustainability"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00]"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Read Time <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 5 min read"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition-all focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Icon Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: opt.name }))
                      }
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                        formData.icon === opt.name
                          ? "border-[#fa1a00] bg-red-50 text-[#fa1a00]"
                          : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                      }`}
                      title={opt.name}
                    >
                      <opt.icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gradient Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: opt.value }))
                      }
                      className={`h-10 w-10 rounded-lg border-2 transition-all bg-linear-to-br ${opt.value} ${
                        formData.color === opt.value
                          ? "border-[#fa1a00] scale-110 shadow-lg"
                          : "border-transparent"
                      }`}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#fa1a00] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
