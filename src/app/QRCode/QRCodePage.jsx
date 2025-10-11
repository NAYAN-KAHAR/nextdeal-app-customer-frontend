// app/QRCode/page.js
import { Suspense } from 'react';
import QRCodePage from './page';

export default function QRCodePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
     <QRCodePage />
    </Suspense>
  );
}
