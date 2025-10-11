import { Suspense } from 'react';
import QRCodePage from './QRCodePage';

export default function QRCodeWrapper() {
  return (
    <Suspense fallback={<div>Loading QR Code Page...</div>}>
      <QRCodePage />
    </Suspense>
  );
}


