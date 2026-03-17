import React from "react";
import { X, Package, Ruler, Tag, IndianRupee, Box, Info } from "lucide-react";

export default function ProductDetailsModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-8 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#fa1a00]">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0b3a4c]">
                Product Details
              </h3>
              <p className="text-xs text-slate-400">ID: {product.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Images */}
            <div className="space-y-6">
              <div className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                {product.mainImage ? (
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-200">
                    <Package size={80} />
                  </div>
                )}
              </div>

              {product.extraImages && product.extraImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Additional Images
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {product.extraImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
                      >
                        <img
                          src={img}
                          alt={`Extra ${idx}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {product.name}
                </h1>
                <span className="inline-flex items-center rounded-full bg-[#0b3a4c]/10 px-3 py-1 text-xs font-semibold text-[#0b3a4c]">
                  {product.category || "Uncategorized"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <IndianRupee size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                      Price
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      Rs. {product.price?.toLocaleString()}
                    </p>
                    {product.printingPrice && (
                      <p className="text-xs text-emerald-600">
                        + Rs. {product.printingPrice} Printing
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <Box size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                      Stock
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                      <p className="text-lg font-bold text-slate-800">
                        {product.stockAmount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <Ruler size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                      Size
                    </p>
                    <p className="text-md font-semibold text-slate-700">
                      {product.size || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <Tag size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                      SKU
                    </p>
                    <p className="text-md font-semibold text-slate-700">
                      {product.sku || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info size={18} />
                  <h4 className="text-sm font-semibold uppercase tracking-wider">
                    Description
                  </h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.description || "No description provided."}
                </p>
                {product.amountOfDescription && (
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Additional Details
                    </h5>
                    <p className="text-sm text-slate-500">
                      {product.amountOfDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-8 py-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#0b3a4c] px-8 py-2.5 font-semibold text-white transition-all hover:bg-[#0d465c] active:scale-95 shadow-lg shadow-blue-900/10"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
