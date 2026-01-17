
'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter,useParams } from 'next/navigation'; 
import axios from 'axios';
import Image from "next/image";
import NavbarTop from "../../components/navbarTop";
import NavbarBottom from "../../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
import Link from "next/link";
import { io } from "socket.io-client";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import { FiArrowLeft } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 




const ShopPage = () => {

  const [shop, setShop] = useState('');
  const [allCoupons, setAllCoupons] = useState([]);
  const [reserveAllCoupons, setReserveAllCoupons] = useState([]);
  const [customer_mobile, setCustomer_mobile] = useState();
  const [showHeader,setShowHeader] = useState(false);
  const [auth, setAuth] = useState();
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [searchTerm, setSearchTerm,] = useState('');
  
  const router = useRouter();
  const socket = useRef(null);  

 

  const { id } = useParams();
  // console.log('mobile', id);


  //Redirect if already logged in
useEffect(() => {
  const checkAuth = async () => {
   try {
       const res = await axios.get(`${apiUrl}/api/verify`, {withCredentials: true});
        console.log(res.data.user.mobile);
        setCustomer_mobile(res.data.user.mobile);

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




  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos === 0) {
        setTimeout(() => setShowHeader(false), 100);
      } else if (currentScrollPos > 250) {
        setShowHeader(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);




const handleInput = (e) => {
  setCouponLoading(true);
  setSearchTerm(e.target.value.toLowerCase());
};

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      const filteredValue = reserveAllCoupons.filter((shop) =>
        shop.couponName.toLowerCase().includes(searchTerm)
      );
      setAllCoupons(filteredValue);
    } else {
      setAllCoupons(reserveAllCoupons);
    }

    setCouponLoading(false); 
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchTerm, reserveAllCoupons]);


// console.log('allcoupon', allCoupons);


  // Fetch shop and coupons
  const getShopData = async () => {
    try {
       const shopkeeperId = id;
      const res = await axios.get(`${apiUrl}/api/per-shopkeeper-shop/${shopkeeperId}`,
         { withCredentials: true });

      console.log(res.data);
      setShop(res.data.shopkeeper);
      
      if(res.data.message === 'Free coupon not found'){
        setShowEmptyMessage(true)
      }
      setAllCoupons(res.data.getFreeCoupons);
      setReserveAllCoupons(res.data.getFreeCoupons);
      
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) getShopData();
  }, [id]);



  // Connect socket after auth
  useEffect(() => {
    if (!auth) return;

    socket.current = io(`${apiUrl}`, { withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.current.on('connect', () => {
      console.log('Customer connected to socket:', socket.current.id);
    });

    return () => {
      socket.current.disconnect();
      console.log('Customer disconnected from socket');
    };
  }, [auth]);

  // Handle coupon redeem
  const handleRedeemClick = (coupon) => {
    if (!coupon || !shop || !customer_mobile) {
      console.log('Missing data for redeem');
      return;
    }

    const data = {
      couponName: coupon.couponName,
      spendingAmount: coupon.spendingAmount,
      customer_mobile: customer_mobile,
      coupon_id: coupon._id,
      shopkeeper_mobile: shop.mobile,
      discount: coupon.discount,
      discountType: coupon.discountType,
    };

    if (socket.current) {
      socket.current.emit('redeem-coupon', data);
      console.log('Sent redeem-coupon event:', data);
    }
   const jsonStr = JSON.stringify(data);
   const encoded = encodeURIComponent(btoa(jsonStr)); // base64 + encodeURIComponent
   router.push(`/QRCode?data=${encoded}`);
  };


// socket connection here 
// useEffect(() => {
//   if (!auth) return;

//   // Connect to socket.io server
//   socket.current = io("http://localhost:5000", {
//     withCredentials: true,
//     transports: ['websocket', 'polling'],  // Ensures real-time connection
//   });

//   // Log when connected
//   socket.current.on("connect", () => {
//     console.log("Connected to socket server", socket.current.id);
//   });

//   // Cleanup on unmount
//   return () => {
//     socket.current.disconnect();
//     console.log("Disconnected from socket server");
//   };
// }, [auth]);


// const handleRedeemClick = (coupon) => {
//   if(!coupon || !shop ||!customer_mobile) return console.log('something went wrong');
//   console.log(coupon, shop);

//   const data = {
//     couponName: coupon?.couponName || '',
//     spendingAmount: coupon?.spendingAmount || '', 
//     customer_mobile,
//     coupon_id: coupon?._id || '',       
//     shopkeeper_mobile: shop?.mobile || '', 
//     discount: coupon.discount || '',
//     discountType: coupon.discountType || '',
//   };
//   console.log('data', data);
//   if (!data.coupon_id || !data.shopkeeper_mobile) {
//     console.error("Missing required data for QR code:", data);
//     return;
//   }

//     if (socket.current) {
//     socket.current.emit("redeem-coupon", data);
//     console.log("Coupon redeem event sent to server:", data);
//   }

 

// };


if (!auth ) return (
  <>
    {/* Top Navbar Skeleton */}
<div className="relative w-full h-[200px] overflow-hidden rounded-b-[10px] bg-gray-200">
  <Skeleton height="100%"width="100%"borderRadius={0}  />

  <div className="absolute inset-0 bg-black/30" />

  {/* Top bar skeleton */}
  <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-2 pb-2">
    <div className="flex items-center justify-between">
      <Skeleton circle height={40} width={40} />
      <Skeleton circle height={40} width={40} />
    </div>
  </div>

  {/* Bottom merged shop card skeleton */}
  <div className="absolute bottom-3 left-4 right-4 z-30 ">
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl space-y-2">

      {/* Name + rating */}
      <div className="flex items-center justify-between">
        <Skeleton height={22} width="60%" borderRadius={6} />
        <Skeleton height={18} width={42} borderRadius={999} />
      </div>

      {/* Category */}
      <Skeleton height={14} width="40%" borderRadius={6} />

      {/* Address */}
      <div className="space-y-1">
        <Skeleton height={12} width="90%" borderRadius={6} />
        <Skeleton height={12} width="70%" borderRadius={6} />
      </div>

    </div>
  </div>

</div>

{/* sub header items */}
<div className="px-4 mt-4">
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

{/* restaurant/shop cards with a skeleton UI */}
<div className="w-full md:w-1/2 mx-auto px-2 mt-6 space-y-4">
  {[...Array(6)].map((_, i) => (
    <div  key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100
                 flex items-center justify-between" >
      <div className="flex flex-col gap-2">
        <Skeleton height={16} width={140} borderRadius={6} />
        <Skeleton height={12} width={180} borderRadius={6} />
      </div>
      <Skeleton height={32} width={80} borderRadius={12} />
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
   {/* <NavbarTop /> */}
    <div className="min-h-screen bg-gray-50 pb-20">

    <div className="relative w-full h-[200px] overflow-hidden rounded-b-[10px]">
      <img  src={shop?.shopImg || "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg"}
        alt="Shop" className="absolute inset-0 w-full h-full object-cover object-center"/>

      <div className="absolute inset-0 bg-black/50" />

    {/* Top Bar */}
    {!isSearch && (
      <div className={`fixed top-0 w-full z-30 flex items-center justify-between
          px-4 pt-4 pb-2 transition-all duration-300 ${showHeader ? 'bg-white shadow' : ''}`} >
        <button onClick={() => window.history.back()}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md
                    flex items-center justify-center" >
          <FiArrowLeft size={18} className="text-white" />
        </button>

        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md
              flex items-center justify-center" onClick={() => setIsSearch(true)}  >
          <FiSearch size={17} className="text-white" />
        </button>
      </div>
    )}


  <div className={`fixed top-0 left-0 right-0 z-40 bg-white shadow
      transform transition-transform duration-300 ease-out
      ${isSearch ? 'translate-y-0' : '-translate-y-full'}`}>

    <div className="flex items-center gap-3 px-4 py-3">
      <button onClick={() => setIsSearch(false)} className="w-9 h-9 rounded-full
        bg-gray-100 flex items-center justify-center" >
        <FiArrowLeft size={16} className="text-gray-700" />
      </button>

      <div className="flex-1 relative">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input autoFocus type="text" placeholder="Search coupons here..." onChange={handleInput}
          className="w-full h-10 pl-9 pr-3 rounded-full bg-white border border-gray-300
                text-sm outline-none " />
      </div>

    </div>
  </div>



  {/* MERGED SHOP + PROMO CARD */}
<div className="absolute bottom-3 left-4 right-4 z-30 ">
  <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl">

    <div className="flex items-center justify-between">
      <h1 className="text-lg font-extrabold text-gray-900 leading-tight capitalize">
        {shop?.business_name}
      </h1>

      <div className="flex items-center gap-1 bg-green-600 text-white
           text-xs font-bold px-2 py-0.5 rounded-full">
        <AiFillStar size={11} />4.5
      </div>
    </div>

    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-700">
      <MdOutlineStorefront size={13} className="text-gray-600" />
      {shop?.business_category}
    </div>


    <div className="mt-2 flex items-start gap-2 text-xs font-medium text-gray-500">
      <FiMapPin size={13} className="mt-[2px] shrink-0 text-gray-400" />
      <p className="leading-relaxed line-clamp-2">{shop?.address}
        <span className="mx-1 text-gray-400">•</span>
        <span className="capitalize">{shop?.city}</span>
      </p>
    </div>

  </div>
</div>


</div>




{/* PROMO CARD */}
<div className="px-4 mt-4">
  <div className="bg-gradient-to-r from-blue-500 to-blue-700
                  rounded-2xl p-4 shadow-lg flex items-center justify-between">

    <div>
      <p className="text-sm font-bold text-white flex items-center gap-1">🎁 Free Coupon</p>
      <p className="text-xs text-white/90"> On your next order</p>
    </div>

    <button className="px-4 py-2 text-xs font-semibold text-blue-500
                       bg-white rounded-xl shadow-md"> Show
    </button>
  </div>
</div>



  {/* ================= COUPONS LIST ================= */}
 {couponLoading ? (<div className="w-full md:w-1/2 mx-auto px-2 mt-6 space-y-4">
  {[...Array(6)].map((_, i) => (
    <div  key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100
                 flex items-center justify-between" >
      <div className="flex flex-col gap-2">
        <Skeleton height={16} width={140} borderRadius={6} />
        <Skeleton height={12} width={180} borderRadius={6} />
      </div>
      <Skeleton height={32} width={80} borderRadius={12} />
    </div>
  ))}
</div>) : ( <div className="px-4 mt-8 space-y-4">

    {allCoupons && allCoupons?.length > 0 && (
      allCoupons.map((value, index) =>
        [...Array(Number(value.freeCoupon))].map((_, i) => (
          <div key={`${index}-${i}`} className="bg-white rounded-2xl p-4
                       shadow-sm border border-gray-100
                       flex items-center justify-between
                       active:scale-[0.98] transition">
            <div>
              <p className="text-sm font-semibold text-gray-800">{value.couponName}</p>
              <p className="text-xs text-gray-500 mt-1">Valid on your next purchase</p>
            </div>

            <button  onClick={() => handleRedeemClick(value)}
              className="px-4 py-2 text-xs font-semibold text-white
                         bg-blue-600 rounded-xl ">Redeem
            </button>
          </div>
        ))
      )
    )}
    
    {allCoupons?.length === 0 && searchTerm.trim() && (
      <div className="flex flex-col items-center text-center mt-12">
        <img  src="/shops/404 error.png"  alt="No Coupons"
          className="w-32 h-32 opacity-70"  />
        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          No coupons available
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Check back later for new offers.
        </p>
      </div>
    )}

    {showEmptyMessage && (
     <div className="flex flex-col items-center text-center mt-12">
      <h2 className="mt-4 text-lg font-semibold text-gray-800">
        No coupons available right now
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Please check back later for new offers
      </p>
    </div>

    )}


  </div>

  )}

</div>

      <NavbarBottom />
    </>
  );
};

export default ShopPage;