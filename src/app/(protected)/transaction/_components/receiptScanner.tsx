"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { scanReceipt } from "../../../../../actions/transactions";
import converter from "@/lib/Worker";
import { z } from "zod";
import { transactionSchema } from "@/lib/schemas";



interface ReceiptScannerProps {
  onScanComplete: (data: Omit<z.infer<typeof transactionSchema>, 'accountId'>) => void;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    const url = URL.createObjectURL(file);
    const text = await converter(url);

    await scanReceiptFn(text);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    }
    //eslint-disable-next-line
  }, [scanReceiptLoading, scannedData]);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        // capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);

        }}
      />
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer w-full h-10 bg-gradient-to-br
         from-blue-500 via-purple-500 to-orange-500
          animate-gradient hover:opacity-90 transition-opacity
           text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading!}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
}