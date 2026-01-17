
'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import Link from "next/link";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 


const SavedPage = () => {

  const [salesCoupons, setSalesCoupons] = useState([]);
  const [allSalesCoupons, setAllSalesCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [auth, setAuth] = useState(false);
  
  const router =  useRouter();

  // Redirect if already logged in
 useEffect(() => {
   const checkAuth = async () => {
     try {
      const res = await axios.get(`${apiUrl}/api/verify`, {
         withCredentials: true,
      });
      if (res.data.authenticated) {
        setAuth(true);
       }
    } catch (err) {
        router.push('/Signup');
    }
  };
      checkAuth();
    }, [router]);
  

  const getallSalesCoupons = async () => {
    try{
      const res = await axios.get(`${apiUrl}/api/my-all-save`,{withCredentials: true});
      // console.log(res.data);
     setSalesCoupons((prev) => [...res.data.data]);
     setAllSalesCoupons((prev) => [...res.data.data]);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    getallSalesCoupons();
  },[]);


const handleSearch = (e) => {
  const values = e.target.value.toLowerCase();
  setSearchTerm(values);
}

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      const filteredValue = allSalesCoupons.filter((shop) =>
        shop.shopkeeper?.business_name?.toLowerCase().includes(searchTerm)
      );
      setSalesCoupons(filteredValue);
     } else {
        setSalesCoupons(allSalesCoupons);
    }
  }, 300);

  return () => clearTimeout(delayDebounce); 
}, [searchTerm, allSalesCoupons]);


if(!auth) return (
  <>
    {/* Top Navbar Skeleton */}
      <div className="fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center justify-between px-4 z-50">
        <Skeleton height={28} width={120} />  
        <div className="flex items-center gap-4">
          <Skeleton circle height={50} width={50} />
        </div>
      </div>
  
      <div className="pt-16 pb-12 min-h-screen w-full bg-white">
  
    <div className="px-4 mt-4">
        <div className="bg-gray-200 rounded-2xl p-4 shadow
                        flex items-center justify-between">
      
          <Skeleton height={22} width='100%' borderRadius={12} />
        </div>
      </div>

      {/* sub header items */}
      <div className="px-4 mt-4 mb-4">
        <div className="bg-gray-200 rounded-2xl p-4 shadow-lg
                        flex items-center justify-between">
      
          {/* Left text */}
          <div className="space-y-2">
            <Skeleton height={14} width={120} borderRadius={6} />
            <Skeleton height={12} width={140} borderRadius={6} />
          </div>
      
          {/* Button */}
          <Skeleton height={32} width={70} borderRadius={12} />
        </div>
      </div>


      {/* TABLE SKELETON */}
       <div className="px-4">
            <div  className="bg-white rounded-3xl shadow w-full max-w-xl mx-auto 
                        relative overflow-hidden" >
             <div className="h-12 border-b border-gray-200 relative">
                <Skeleton className="absolute inset-0 w-full h-full" />
              </div>
      
              {Array.from({ length: 6 }).map((_, i) => (
                <div  key={i} className="h-14 border-b border-gray-100 relative" >
                  <Skeleton className="absolute inset-0 w-full h-full" />
                </div>
              ))}
            </div>
          </div>
    

          
  </div>
  
   <div className="fixed bottom-0 left-0 w-full h-20 bg-white shadow-inner flex items-center justify-around px-4">
     {Array(5).fill("").map((_, i) => (
        <Skeleton key={i} height={42} width={50} />
    ))}
   </div>
  
  </>
)
  return (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-white relative">
      

  <div className="sticky top-9 z-40 bg-white">
  <div className="w-full px-4 pt-8 pb-4 shadow rounded-b-3xl">

    <div className="flex gap-3 items-center">

      <div className="relative flex-1">
        <FiSearch  size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input type="text" placeholder="Search shops"
          className="w-full rounded-xl border border-gray-200
          pl-11 pr-4 py-3 text-sm font-medium text-gray-800
          focus:ring-2 focus:ring-black focus:outline-none shadow-sm" />
      </div>

    </div>


    <div className="mt-4 rounded-2xl bg-orange-50 border border-orange-100
      px-4 py-3 flex items-center justify-between">

      <div>
        <p className="text-sm font-semibold text-blue-900"> 🎁 Free Coupon </p>
        <p className="text-xs text-blue-700"> On your next order</p>
      </div>

      <Link href={'/FreeCoupon'}   className="px-4 py-2 text-xs font-semibold text-white
        bg-blue-500 rounded-xl "> Show</Link>
    </div>

  </div>
</div>


{/* Saved Table */}
<div className="md:px-6 px-4 pt-4 text-lg font-semibold text-gray-900">
  Your Savings
</div>

<div className="px-4 mt-3 overflow-x-auto rounded-2xl relative z-10">
  {salesCoupons && salesCoupons.length > 0 ? (
    <table className="min-w-full bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">
            Shop
          </th>
          <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">
            Coupon
          </th>
          <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">
            Saved
          </th>
        </tr>
      </thead>

      {/* Body */}
      <tbody className="divide-y divide-gray-100">
        {salesCoupons.map((value, i) => (
          <tr key={i} className="active:bg-gray-100 transition">
            <td className="px-4 py-4 text-sm font-medium text-gray-900">
              {value.shopkeeper?.business_name}
            </td>
            <td className="px-4 py-4 text-sm font-semibold text-green-600">
              {value.coupon?.discount}
              {value.coupon.discountType === 'percentage' ? '%' : ''} Coupon
            </td>
            <td className="px-4 py-4 text-sm font-bold text-gray-900 text-right">
              ₹{(value.coupon.purchase_amount - value.coupon.subtotal).toFixed(1)}
            </td>
          </tr>
        ))}

        {/* Total Row */}
        <tr className="bg-gray-50">
          <td className="px-4 py-4 text-sm font-semibold text-gray-700">
            Total Saved
          </td>
          <td></td>
          <td className="px-4 py-4 text-base font-bold text-gray-900 text-right">
            ₹{salesCoupons.reduce((acc, curr) =>
              acc + Number(curr.coupon.purchase_amount - curr.coupon.subtotal), 0
            ).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
    <div className="flex flex-col items-center justify-center py-16">
      <img
        src="/shops/404 error.png"
        alt="No Savings"
        className="w-32 h-32 opacity-50 mb-4"
      />
      <h2 className="text-lg font-semibold text-gray-700">No Savings Yet</h2>
      <p className="text-sm text-gray-500 mt-1 text-center">
        You haven’t saved any coupons yet. Start exploring shops to earn savings!
      </p>
    </div>
  )}
</div>




</div>
<NavbarBottom />
    </>
  );
};

export default SavedPage;