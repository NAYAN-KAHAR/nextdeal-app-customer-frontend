
'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import Image from "next/image";
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
import  Link from 'next/link';

import { io } from "socket.io-client";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // needed for styles





const MyCoupon = () => {
  const [auth, setAuth] = useState();
  const [loading, setLoding] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [myAllCoupons, setMyAllCoupons] = useState([]);
  const [myTotalCoupons, setMyTotalCoupons] = useState([]);

  const router = useRouter();
  const socket = useRef(null);  // <-- useRef to keep the same socket instance


  //Redirect if already logged in
useEffect(() => {
  const checkAuth = async () => {
   try {
       const res = await axios.get(`${apiUrl}/api/verify`, {
          withCredentials: true, });
  
       if (res.data.authenticated) {
          setAuth(true);
         }
    } catch (err) {
      console.log('User not logged in');
       router.push('/Signup');
    }finally{
      setLoding(false);
    }
  };
  
  checkAuth();
 }, [router]);


const getMyAllCoupons = async () => {
    try{
      const res = await axios.get(`${apiUrl}/api/next-offers-get-mycoupons`,{withCredentials:true});
      console.log(res.data);
      setMyAllCoupons(res.data.filteredCoupons);
      setMyTotalCoupons(res.data.filteredCoupons);

    }catch(err){
      console.log(err);
    }
}

useEffect(() => {
  getMyAllCoupons();
},[]);


// socket connection here 
useEffect(() => {
  if (!auth) return;

  // Connect to socket.io server
  socket.current = io(`${apiUrl}`, {
    withCredentials: true,
    transports: ['websocket', 'polling'],  // Ensures real-time connection
  });

  // Log when connected
  socket.current.on("connect", () => {
    console.log("Connected to socket server", socket.current.id);
  });

  // Cleanup on unmount
  return () => {
    socket.current.disconnect();
    console.log("Disconnected from socket server");
  };
}, [auth]);


const handleRedeemClick = (coupon) => {
  console.log(coupon);
  const data = {
    couponName: coupon?.coupon.couponName || '',
    spendingAmount: coupon?.coupon.spendingAmount || '', 
    customer_mobile: coupon.customer_mobile || '',
    coupon_id: coupon.coupon?._id || '',       
    shopkeeper_mobile: coupon.shopkeeper?.mobile || '', 
    discount: coupon.discount || '',
    discountType: coupon.discountType || '',
  };

  if (!data.customer_mobile || !data.coupon_id || !data.shopkeeper_mobile) {
    console.error("Missing required data for QR code:", data);
    return;
  }

    if (socket.current) {
    socket.current.emit("redeem-coupon", data);
    console.log("Coupon redeem event sent to server:", data);
  }

  const jsonStr = JSON.stringify(data);
  const encoded = encodeURIComponent(btoa(jsonStr)); // base64 + encodeURIComponent
  router.push(`/QRCode?data=${encoded}`);

};


// const handleRedeemClick = async (coupon) => {
//   const data = {
//     customer_mobile: coupon.customer_mobile,
//     coupon_id: coupon.coupon?._id,
//     shopkeeper_mobile: coupon.shopkeeper?.mobile,
//     discount: coupon.discount,
//     discountType: coupon.discountType,
//   };

//   try {
//     const res = await axios.post('http://localhost:5000/api/redeem-coupon', data, {
//       withCredentials: true
//     });

//     console.log("Redemption successful:", res.data);
//     setTimeout(() =>router.push('/QRCode') ,500);
//   } catch (error) {
//     console.error("Redemption failed:", error);
//   }
// };


const handleCouponSerach = (e) => {
   const values = e.target.value.toLowerCase();
   setSearchTerm(values);
}

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      const filteredValue = myTotalCoupons.filter((shop) =>
        shop.shopkeeper?.business_name?.toLowerCase().includes(searchTerm)
      );
      setMyAllCoupons(filteredValue);
     } else {
        setMyAllCoupons(myTotalCoupons);
    }
  }, 300);

  return () => clearTimeout(delayDebounce); 
}, [searchTerm, myTotalCoupons]);


if (!auth || loading ) return (
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
      <div key={i} className="bg-white rounded-2xl shadow-md p-4 flex gap-4">
   
        <Skeleton height={80} width={80} borderRadius={12}/>

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
        <p className="text-xs text-blue-700"> On your first order</p>
      </div>
      <Link href={'/FreeCoupon'} className="px-4 py-2 text-xs font-semibold text-white
        bg-blue-500 rounded-xl"> Show</Link>
    </div>

  </div>
</div>


  


<div className="md:p-6 p-4 text-2xl font-bold mt-2">My Coupons</div>      



   <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 md:px-6 py-4">
  {myAllCoupons?.length > 0 &&
    myAllCoupons.map((value, i) => (
      <div key={i}  className="bg-white rounded-3xl shadow-sm border border-gray-100
                   p-4 flex gap-4 items-start active:scale-[0.98] transition" >

        <img src={ value?.shopkeeper?.shopImg ||
            "https://img.freepik.com/premium-vector/twostory-store-shop-with-brick-wall-vector-3d-clipart-isolated-white-background_396616-1044.jpg"
          }
          alt="shop image" className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"/>


        <div className="flex flex-col flex-1">
    
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-bold text-gray-900 capitalize leading-tight">
                {value?.shopkeeper?.business_name}
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {value?.shopkeeper?.address}
              </p>
            </div>

            {/* Status */}
            <span  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                ${value?.isUsed  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600" }`} >
              {value?.isUsed ? "USED" : "ACTIVE"}
            </span>
          </div>


          <p className="text-sm font-semibold text-blue-700 mt-2 leading-snug">
            {value?.coupon?.couponName}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Discount */}
            <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-3 py-1 rounded-full">
              {value?.discount}
              {value?.discountType === "percentage" ? "% OFF" : " OFF"}
            </span>

            {/* Min Spend */}
            <span className="bg-orange-50 text-orange-700 text-[11px] font-semibold px-3 py-1 rounded-full">
              Min ₹{value?.coupon?.spendingAmount}
            </span>

            <span className="text-[10px] text-gray-400">
              {new Date(value?.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year:"2-digit" })}
            </span>
          </div>

          {/* Action */}
          <div className="flex justify-end mt-3">
            <button
              disabled={value?.isUsed}
              onClick={() => handleRedeemClick(value)}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold
                ${value?.isUsed
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-700 text-white active:bg-blue-800"
                }`}
            >
              {value?.isUsed ? "Redeemed" : "Redeem"}
            </button>
          </div>
        </div>
      </div>
    ))}
</div>



{/* <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 md:px-6 py-4">

    { myAllCoupons.length !== 0  && myAllCoupons.map((value, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-md p-4
              flex gap-4 items-start active:scale-[0.97] transition"  >
    
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

    
          <div className="flex items-center justify-between mt-3">
             <div className="text-xs font-semibold text-white bg-white px-3 py-1 rounded-full">
              
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
</div> */}







      </div>
      <NavbarBottom />
    </>
  );
};

export default MyCoupon;