"use client";

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Loader2 
} from 'lucide-react';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Simulated total
  const [loading] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#f8f8f8] [font-family:var(--font-schibsted-grotesk)]">
      {/* Viewer Toolbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-center gap-6 sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-1.5 border border-black/5 rounded-xl p-0.5 bg-gray-50/50 shadow-sm">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className="p-1 px-3 text-sm font-bold text-black hover:bg-white rounded-lg transition-all disabled:opacity-20 flex items-center gap-1 shadow-sm border border-transparent hover:border-black/5"
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1 px-3 text-sm font-semibold text-black/80">
            <span>{currentPage}</span>
            <span className="text-black/30 font-medium">of</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            className="p-1 px-3 text-sm font-bold text-black hover:bg-white rounded-lg transition-all disabled:opacity-20 shadow-sm border border-transparent hover:border-black/5"
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-1 h-10 p-1 border border-black/5 rounded-xl bg-gray-50/50 shadow-sm">
           <button 
             onClick={handleRotate}
             className="p-1.5 px-2.5 text-black/70 hover:text-black hover:bg-white rounded-lg transition-all" 
             title="Rotate"
           >
             <RotateCcw className="h-4 w-4" />
           </button>
           <div className="w-[1px] h-4 bg-black/5 mx-1" />
           <button 
             onClick={handleZoomOut}
             className="p-1.5 px-2.5 text-black/70 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30" 
             title="Zoom Out"
             disabled={scale <= 0.5}
           >
             <ZoomOut className="h-4 w-4" />
           </button>
           <button 
             onClick={handleZoomIn}
             className="p-1.5 px-2.5 text-black/70 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30" 
             title="Zoom In"
             disabled={scale >= 2}
           >
             <ZoomIn className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 flex justify-center p-8 overflow-auto scrollbar-hide bg-[#f8f8f8]">
        <div 
          className="w-full max-w-2xl bg-white shadow-2xl border border-black/5 min-h-[1100px] rounded-lg relative overflow-hidden transition-all duration-300 ease-out origin-top"
          style={{ 
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
              <Loader2 className="h-8 w-8 animate-spin text-black/20" />
            </div>
          ) : (
             <iframe 
                src={`${url}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-none"
                style={{ 
                    height: '1100px',
                    width: '100%',
                }}
                title="PDF Content"
             />
          )}
        </div>
      </div>
    </div>
  );
}
