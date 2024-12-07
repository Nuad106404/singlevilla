import React from 'react';
import { motion } from 'framer-motion';

interface QRCodeProps {
  amount: number;
  promptpayId: string;
}

export function QRCode({ amount, promptpayId }: QRCodeProps) {
  // In a real application, you would generate a real QR code
  // For this example, we'll use a placeholder image
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-500">PromptPay</div>
          <div className="font-mono text-xs">{promptpayId}</div>
          <div className="text-sm font-medium">{amount.toFixed(2)} THB</div>
        </div>
      </div>
    </motion.div>
  );
}