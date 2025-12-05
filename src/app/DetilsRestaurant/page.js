import { Suspense } from 'react';
import RestaurantsDetails from './restuarantDetails';

export default function RestuarantDetailsWrapper() {
  return (
    <Suspense fallback={<div>Loading QR Code Page...</div>}>
      <RestaurantsDetails />
    </Suspense>
  );
}


