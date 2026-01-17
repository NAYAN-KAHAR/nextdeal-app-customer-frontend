import { Suspense } from 'react';
import CustomerSuccessPage from './customerSucc';



export default function CustomerSuccessPageWrapper() {
  return (
    <Suspense fallback={<div>Loading Customer Success Page...</div>}>
      <CustomerSuccessPage />
    </Suspense>
  );
}


