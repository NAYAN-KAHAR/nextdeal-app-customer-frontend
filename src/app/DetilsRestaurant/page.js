import { Suspense } from 'react';
import RestaurantsDetails from './restuarantDetails';

export default function RestuarantDetailsWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <RestaurantsDetails />
    </Suspense>
  );
}


