"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { CustomButton } from "./custom-button";

// Dynamic import to prevent server-side execution
let pdfjsLib: any = null;

const loadPDFJS = async () => {
  if (typeof window !== 'undefined' && !pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    // Disable worker to avoid CORS issues - PDF.js will work in main thread
    pdfjsLib.GlobalWorkerOptions.workerSrc = false;
  }
  return pdfjsLib;
};

interface PDFViewerProps {
  url: string;
  className?: string;
}

export function PDFViewer({ url, className = "" }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadPDF();
    }
  }, [url, isClient]);

  const loadPDF = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load PDF.js dynamically
      const pdfjs = await loadPDFJS();
      if (!pdfjs) {
        throw new Error("PDF.js failed to load");
      }

      // Load the PDF document
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Failed to load PDF document");
      setIsLoading(false);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Calculate viewport with current scale and rotation
      const viewport = page.getViewport({ scale, rotation });
      
      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
      setError("Failed to render PDF page");
    }
  };

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, rotation]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Show loading state on server side or while client is initializing
  if (!isClient || isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">{error}</p>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={loadPDF}
            className="text-xs"
          >
            Retry
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-3 border-b border-white/20 bg-gray-900/30">
        <div className="flex items-center gap-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="text-xs"
          >
            <ChevronLeft className="w-3 h-3" />
          </CustomButton>
          
          <span className="text-xs text-gray-400 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>
          
          <CustomButton
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="text-xs"
          >
            <ChevronRight className="w-3 h-3" />
          </CustomButton>
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="text-xs"
          >
            <ZoomOut className="w-3 h-3" />
          </CustomButton>
          
          <span className="text-xs text-gray-400 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <CustomButton
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3.0}
            className="text-xs"
          >
            <ZoomIn className="w-3 h-3" />
          </CustomButton>
          
          <CustomButton
            variant="outline"
            size="sm"
            onClick={rotate}
            className="text-xs"
          >
            <RotateCw className="w-3 h-3" />
          </CustomButton>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="flex justify-center p-4">
          <canvas
            ref={canvasRef}
            className="shadow-lg border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
} 