import React from "react";
import { X, Package, Ruler, Tag, IndianRupee, Box, Info } from "lucide-react";

export default function ProductDetailsModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b3a4c] shadow-2xl transition-all duration-300 border border-white/10">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b3a4c]/80 px-8 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fa1a00]/10 text-[#fa1a00]">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Product Details
              </h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                ID: {product.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Images */}
            <div className="space-y-6">
              <div className="aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                {product.mainImage ? (
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/10">
                    <Package size={80} />
                  </div>
                )}
              </div>

              {product.extraImages && product.extraImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fa1a00]">
                    Additional Gallery
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {product.extraImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 group relative"
                      >
                        <img
                          src={img}
                          alt={`Extra ${idx}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
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
                <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">
                  {product.name}
                </h1>
                <span className="inline-flex items-center rounded-lg bg-[#fa1a00]/10 px-4 py-1.5 text-[10px] font-black text-[#fa1a00] uppercase tracking-widest border border-[#fa1a00]/20">
                  {product.category || "Uncategorized"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[#fa1a00]">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Base Price
                    </p>
                    <p className="text-xl font-black text-white">
                      Rs. {product.price?.toLocaleString()}
                    </p>
                    {product.printingPrice && (
                      <p className="text-[10px] font-bold text-[#00FF88] uppercase mt-1">
                        + Rs. {product.printingPrice} Printing
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[#fa1a00]">
                    <Box size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Inventory
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${product.inStock ? "bg-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" : "bg-red-500"}`}
                      />
                      <p className="text-xl font-black text-white">
                        {product.stockAmount || 0} PCS
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                  <div className="mt-1 text-[#fa1a00]">
                    <Ruler size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Dimensions
                    </p>
                    <p className="text-md font-black text-white uppercase">
                      {product.size || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                  <div className="mt-1 text-[#fa1a00]">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Serial SKU
                    </p>
                    <p className="text-md font-black text-white uppercase">
                      {product.sku || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                {product.genDescription ? (
                  <div className="rounded-2xl bg-white/5 p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 text-[#fa1a00] mb-4">
                      <Info size={18} />
                      <h4 className="text-xs font-black uppercase tracking-[0.2em]">
                        Product Description
                      </h4>
                    </div>
                    <p className="text-white/90 leading-relaxed font-medium whitespace-pre-wrap">
                      {product.genDescription}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/5 p-6 border border-white/5 text-center">
                    <p className="text-white/20 italic text-sm">
                      No description available.
                    </p>
                  </div>
                )}

                {product.technicalSpecs && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mt-4">
                    <h5 className="text-[10px] font-black text-[#fa1a00] uppercase tracking-widest mb-4">
                      Technical Specifications
                    </h5>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Colour
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.colour || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Style
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.style || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Waterproof / Oil-proof
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.waterproof ? "YES" : "NO"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Heat Sealable
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.heatSealable ? "YES" : "NO"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Tear Notch
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.tearNotch ? "YES" : "NO"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Closure
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.closure || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                          Window
                        </span>
                        <span className="text-sm font-black text-white">
                          {product.technicalSpecs.window || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {product.materialStructure &&
                  Object.keys(product.materialStructure).length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">
                        Material Structure
                      </h5>
                      <div className="space-y-3">
                        {Object.entries(product.materialStructure).map(
                          ([key, value], idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0"
                            >
                              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                                {key}
                              </span>
                              <span className="text-sm font-black text-white">
                                {value} Microns
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                {product.showCapacity &&
                  product.capacitySpecs &&
                  Object.keys(product.capacitySpecs).length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">
                        Product Capacity Specs
                      </h5>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {Object.entries(product.capacitySpecs).map(
                          ([key, value], idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                {key}
                              </p>
                              <p className="text-sm font-black text-white">
                                {value}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 bg-white/5 px-8 py-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-white px-10 py-3 font-black text-[#0b3a4c] uppercase tracking-widest text-xs shadow-2xl transition-all hover:bg-[#fa1a00] hover:text-white active:scale-95"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
