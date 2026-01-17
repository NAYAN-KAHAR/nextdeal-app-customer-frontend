
'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import Image from "next/image";
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // needed for styles




const FreeCoupon = () => {
  const [allCoupons, setAllCoupons] = useState([]);
  const [reserveAllCoupons, setReserveAllCoupons] = useState([]);
  const [groupedCoupons, setGroupedCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loader, setLoader] = useState(false);
  const [auth, setAuth] = useState(false);

  const router = useRouter();
  // console.log(groupedCoupons);


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
        console.log('User not logged in');
        router.push('/Signup');
      }
    };
    checkAuth();
  }, [router]);

  // fetch all shops on homepage
  const getAllShops = async () => {
    try{
      setLoader(true);
      const res =  await axios.get(`${apiUrl}/api/all-shopkeeper-freecoupons/`, 
        {withCredentials:true});
       console.log(res.data);
      const newCoupons = [...res.data.allFreeCoupons];
      setAllCoupons(newCoupons);
      setLoader(false);
      // console.log(newCoupons.length); // ✅ correct value


    }catch(err){
      console.log('err => ', err);
    }
  } 
  
  useEffect(() => {
     getAllShops();
  },[]);

//  counting all free coupon of each shopkeeper
useEffect(() => {
  const grouped = {};
  allCoupons.forEach((coupon) => {
    const shop = coupon.shopkeeper;
    const shopId = shop?._id;

    // If shop doesn't exist yet, initialize it
    if (!grouped[shopId]) {
      grouped[shopId] = {
        shopkeeper: shop,
        couponCount: 0,
        coupons: [],
      };
    }

    // Add current coupon and update count
    grouped[shopId].coupons.push(coupon);
    grouped[shopId].couponCount += Number(coupon.freeCoupon || 0);
  });

  setGroupedCoupons(Object.values(grouped));
  setReserveAllCoupons(Object.values(grouped));
}, [allCoupons]);


const handleCouponSerach = (e) => {
   const values = e.target.value.toLowerCase();
   setSearchTerm(values);
}

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      const filteredValue = reserveAllCoupons.filter((shop) =>
        shop.shopkeeper?.business_name?.toLowerCase().includes(searchTerm)
      );
      setGroupedCoupons(filteredValue);
    } else {
      setGroupedCoupons(reserveAllCoupons);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchTerm, reserveAllCoupons]);



if (!auth ) return (
  <>
    {/* Top Navbar Skeleton */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 
    gap-2 rounded-b-3xl pb-4">
  
      <div className="w-full flex justify-between items-center gap-2">
        <Skeleton height={40} width={100} /> {/* Logo */}
        <div className="flex items-center gap-4">
          <Skeleton height={28} width={100} /> 
          <Skeleton circle={true} height={40} width={40} /> 
        </div>
      </div>


</div>


  {/* ================= STICKY SEARCH HEADER SKELETON ================= */}
  <div className="sticky top-9 z-40 bg-white">
    <div className="w-full px-4 pt-4 pb-4 shadow rounded-b-3xl space-y-4">

      <Skeleton height={48} width="100%" borderRadius={12} />

      {/* Free coupon promo */}
      <div className="rounded-2xl px-4 mt-2 flex items-center justify-between bg-gray-200">
        <div className="space-y-2">
          <Skeleton height={14} width={120} />
          <Skeleton height={12} width={180} />
        </div>
        <Skeleton height={32} width={70} borderRadius={12} />
      </div>

    </div>
  </div>

  <div className="px-4 md:px-6 mt-6">
    <Skeleton height={26} width={220} />
  </div>

  {/* ================= COUPON GRID SKELETON ================= */}
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 md:px-6 py-4">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-md p-4 flex gap-4"
      >
        {/* Image */}
        <Skeleton
          height={80}
          width={80}
          borderRadius={12}
        />

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-h-[96px]">
          <div className="space-y-2">
            <Skeleton height={18} width="70%" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="75%" />
          </div>

          <div className="flex items-center justify-between mt-3">
            <Skeleton height={20} width={90} borderRadius={999} />
            <Skeleton height={30} width={80} borderRadius={12} />
          </div>
        </div>
      </div>
    ))}
  </div>



{/* Bottom Navbar Skeleton */}
 <div className="fixed bottom-0 w-full h-20 bg-gray-200 flex items-center justify-around px-4 mt-2
    rounded-t-3xl">
      {Array(5).fill('').map((_, i) => (
        <Skeleton key={i} height={40} width={60} />
      ))}
    </div>
  </>
)



// console.log('groupedCoupons', groupedCoupons);


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
        <p className="text-xs text-blue-700">for discount On your first order</p>
      </div>
      <button  className="px-4 py-2 text-xs font-semibold text-white
        bg-blue-500 rounded-xl "> Show</button>
    </div>

  </div>
</div>



<div className="md:p-6 p-4 text-xl font-bold text-gray-900 mt-2 ">Available Free Coupons</div>


<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 md:px-6 py-4">

    { groupedCoupons.length !== 0 && groupedCoupons.map((value, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-md p-4
              flex gap-4 items-start active:scale-[0.97] transition"  >
        {/* Shop Image */}
        <img src={ value?.shopkeeper?.shopImg ||
            "https://img.freepik.com/premium-vector/twostory-store-shop-with-brick-wall-vector-3d-clipart-isolated-white-background_396616-1044.jpg?semt=ais_hybrid&w=740&q=80"
          }
          alt="shop image" className="w-20 h-20 md:w-24 md:h-24 rounded-xl
           object-cover flex-shrink-0"/>

        <div className="flex flex-col justify-between flex-1 min-h-[96px]">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 leading-tight capitalize">
              {value.shopkeeper?.business_name}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
              {value.shopkeeper?.address}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              {value?.couponCount} Coupons
            </div>

            <Link  href={`/Shop/${value.shopkeeper?.mobile}`}
              className="px-4 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold
                   shadow-sm" >Redeem
            </Link>
          </div>
        </div>
      </div>
    )
  )}
</div>








      </div>
      <NavbarBottom />
    </>
  );
};

export default FreeCoupon;