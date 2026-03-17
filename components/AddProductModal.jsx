import { X, Upload, Image as ImageIcon } from "lucide-react";

export default function AddProductModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-8 py-5 backdrop-blur-md">
          <h3 className="text-xl font-bold text-[#0b3a4c]">Add New Product</h3>
          <button 
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Basic Information</h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">SKU</label>
                    <input 
                      type="text" 
                      placeholder="ABC-123"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Price ($)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00] outline-none transition-all bg-white">
                      <option value="active">Active</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Product Images</h4>
              
              {/* Main Image */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Main Product Image</label>
                <div className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#fa1a00] hover:bg-red-50/30">
                  <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-[#fa1a00]">
                    <Upload size={32} />
                    <span className="text-sm font-medium">Upload thumbnail</span>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* Optional Extra Images */}
              <div className="mt-6 space-y-3">
                <label className="text-sm font-medium text-slate-700">Extra Images (Optional - Max 5)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#fa1a00] hover:bg-red-50/30">
                      <div className="text-slate-300 group-hover:text-[#fa1a00]">
                        <ImageIcon size={20} />
                      </div>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-8 py-5">
          <button 
            onClick={onClose}
            className="rounded-lg px-6 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button 
            className="rounded-lg bg-[#0b3a4c] px-8 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-[#0d465c] active:scale-95"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
