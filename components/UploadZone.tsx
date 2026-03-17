"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  isProcessing?: boolean;
}

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/heic"];

function filterImageFiles(files: FileList | File[]): File[] {
  return Array.from(files).filter((f) => ACCEPTED.includes(f.type));
}

export function UploadZone({ onFiles, isProcessing = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const images = filterImageFiles(e.dataTransfer.files);
      if (images.length > 0) onFiles(images);
    },
    [onFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const images = filterImageFiles(e.target.files);
    if (images.length > 0) onFiles(images);
    // Reset so same files can be re-selected
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isProcessing && inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-4 w-full max-w-lg mx-auto",
        "border-2 border-dashed rounded-2xl px-10 py-16 cursor-pointer select-none",
        "transition-all duration-200",
        isDragging
          ? "border-warm-300 bg-terracotta-100"
          : "border-warm-200 bg-warm-25 hover:border-warm-300 hover:bg-warm-100",
        isProcessing && "pointer-events-none opacity-60"
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          isDragging ? "bg-warm-200" : "bg-warm-100"
        )}
      >
        <ImagePlus className="h-6 w-6 text-warm-500" strokeWidth={1.5} />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-warm-900">
          {isDragging ? "Drop photos here" : "Upload photos"}
        </p>
        <p className="text-xs text-warm-500">
          Drag &amp; drop or click to browse · JPG, PNG supported
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
