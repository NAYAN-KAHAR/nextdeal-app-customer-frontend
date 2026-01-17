import { Suspense } from 'react';
import QRCodePage from './QRCodePage';

export default function QRCodeWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <QRCodePage />
    </Suspense>
  );
}


