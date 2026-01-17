'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import { FiSearch } from 'react-icons/fi';
import { FiArrowLeft } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";


import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 


const QRCodePage = () => {
  const searchParams = useSearchParams();
  
  const [qrValue, setQRValue] = useState(null);
  const [shopkeeperMobile, setShopkeeperMobile] = useState('');
  const [shopkeeper, setShopkeeper] = useState(''); 

   const [showHeader,setShowHeader] = useState(false);
   const  [isSearch, setIsSearch] = useState(false);
   const  [searchTerm, setSearchTerm,] = useState('');

  const qrRef = useRef(null); // For capturing the QR code

  const getShopkeeper = async () => {
    try{
      const mobile  = shopkeeperMobile;
      if(mobile){
            const url = `${apiUrl}/api/shopkeeper-profile-data/${mobile}`;
            const res = await axios.get(url, { withCredentials: true });
            // console.log('data',res.data);
            setShopkeeper(res.data.shopkeeper)
      } 
    }catch(err){
      console.log(err)
    }
  } 


// console.log('shopkeeper', shopkeeper);


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
  // setCouponLoading(true);
  console.log(e.target.value.toLowerCase());
  setSearchTerm(e.target.value.toLowerCase());
};

// useEffect(() => {
//   const delayDebounce = setTimeout(() => {
//     if (searchTerm) {
//       const filteredValue = reserveAllCoupons.filter((shop) =>
//         shop.couponName.toLowerCase().includes(searchTerm)
//       );
//       setAllCoupons(filteredValue);
//     } else {
//       setAllCoupons(reserveAllCoupons);
//     }

//     setCouponLoading(false); 
//   }, 300);

//   return () => clearTimeout(delayDebounce);
// }, [searchTerm, reserveAllCoupons]);




useEffect(() => {
  const data = searchParams.get('data');
  if (data) {
    try {
      const decodedBase64 = atob(decodeURIComponent(data));
      const parsed = JSON.parse(decodedBase64);
      console.log('Decoded QR data:', parsed);
      setShopkeeperMobile(parsed.shopkeeper_mobile); // async set
      setQRValue(parsed);
    } catch (err) {
      console.error('Error parsing QR data:', err);
    }
  }
}, [searchParams]);

// 🔁 Runs AFTER shopkeeperMobile is set
useEffect(() => {
  if (shopkeeperMobile) {
    getShopkeeper(); // now it has value
  }
}, [shopkeeperMobile]);



  
  return (
    <>
      {/* <NavbarTop /> */}
 
       <div className="min-h-screen w-full flex-col justify-center  pb-16 bg- relative">
        

            <div className="relative w-full h-[200px] overflow-hidden rounded-b-[10px]">
      <img  src={shopkeeper?.shopImg || "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg"}
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
        {shopkeeper?.business_name}
      </h1>

      <div className="flex items-center gap-1 bg-green-600 text-white
           text-xs font-bold px-2 py-0.5 rounded-full">
        <AiFillStar size={11} />4.5
      </div>
    </div>

    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-700">
      <MdOutlineStorefront size={13} className="text-gray-600" />
      {shopkeeper?.business_category}
    </div>


    <div className="mt-2 flex items-start gap-2 text-xs font-medium text-gray-500">
      <FiMapPin size={13} className="mt-[2px] shrink-0 text-gray-400" />
      <p className="leading-relaxed line-clamp-2">{shopkeeper?.address}
        <span className="mx-1 text-gray-400">•</span>
        <span className="capitalize">{shopkeeper?.city}</span>
      </p>
    </div>

  </div>
</div>


</div>




         {/* <div className="w-full p-2  bg-[#17186C] pt-6 rounded-b-2xl">
                      
            <div className="relative w-full md:w-[400px]">
                <input type="text" placeholder="Search your shop"
                     className="w-full pl-10 pr-4 py-2 rounded-2xl border
                     border-white outline-none focus:ring-2 focus:ring-white 
                   focus:border-none text-sm text-black bg-white" 
                   />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2
                     text-black" size={20} />
            </div>

            <div className="w-full flex p-1 items-center justify-between gap-5 mt-3">
            <p className="md:text-lg text-xs text-white font-semibold">
              Shop Now with Free Coupon and get discount in your first Order 
              </p>
     
           </div>
      </div> */}

        

 
    {/* Tags */}
 <div className="w-full px-4 md:px-6 mt-4">
  <div className="bg-blue-600 rounded-lg px-4 py-1 flex items-center justify-center shadow-md">
    <p className="text-center text-sm font-medium text-white leading-relaxed">
      Ask the shopkeeper to approve your request during billing
    </p>
  </div>
</div>


 {/* Form */}
  {/* <div className="z-100 w-full grid grid-cols-1 md:grid-cols-1 gap-2 p-4 md:p-6">         
      <div className=" w-full bg-white shadow-2xl mt-2
          rounded-2xl z-50  p-3 ">

            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                   <p>{qrValue && qrValue.couponName}</p>
                 </div>
                <button disabled className="px-3 py-2 rounded-2xl bg-red-600 text-white
                  font-semibold cursor-not-allowed text-sm">Pending Accept</button>
            </div>

            <p className="mt-1 text-red-500">
              <span>You have spend minimum ₹</span>
              <span>{qrValue && qrValue.spendingAmount}</span>
              </p>
              
          <p className="mt-2 text-sm text-gray-500 px-1 italic">
                 Waiting for shopkeeper’s response...
           </p>

        </div>
          
    </div> */}

<div className="w-full px-4 py-4">
 <div className="relative bg-white rounded-2xl border border-gray-100 shadow p-4 mb-3 overflow-hidden">

    {/* Accent Strip */}
    <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500"></div>

    {/* Top Row */}
    <div className="flex items-start justify-between">
      <div className="pl-2">
        <p className="text-base font-semibold text-gray-900 leading-snug">
          {qrValue?.couponName}
        </p>
        <p className="mt-1 text-sm text-red-600 font-medium">
          Minimum spend ₹{qrValue?.spendingAmount}
        </p>
      </div>

      {/* Status Chip */}
      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold tracking-wide">
        Pending
      </span>
    </div>

    {/* Divider */}
    <div className="my-1 h-px bg-gray-100"></div>

    {/* Footer Message */}
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-lg animate-pulse">⏳</span>
      <span>Waiting for shopkeeper approval</span>
    </div>

  </div>

</div>




 </div>

      <NavbarBottom />
    </>
  );
};

export default QRCodePage;


// import { useState, useEffect, useRef } from "react";
// import { useRouter } from 'next/navigation'; 
// import axios from 'axios';
// import Image from "next/image";
// import NavbarTop from "../components/navbarTop";
// import NavbarBottom from "../components/navbarBottom";
// import { FiSearch } from 'react-icons/fi';
// import Link from "next/link";
// import { GiProgression } from "react-icons/gi";
// import { FaBagShopping } from "react-icons/fa6";
// import { BsTicketPerforated } from "react-icons/bs";
// import { LuScanLine } from "react-icons/lu";

// import { HiQrCode } from "react-icons/hi2";
// import QRCode from 'react-qr-code';



// const QRCode = () => {
//   return (
//     <>
//     <NavbarTop />
//       <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-pink-50 relative">
//         {/* pt-16 and pb-16 add space for fixed navbars */}
//         <div className="text-center w-full flex  mt-6 max-w:md mx-auto"></div>

        


// <div className="p-4 text-2xl font-bold mt-2">
//     <div className="flex rounded-2xl p-2 shadow-2xl bg-white">
//     <img src="https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg" alt="shop image" className="w-20 h-20 rounded-full object-cover"/>
//     <div className="flex flex-col justify-between flex-1">
//       {/* Shop name and address */}
      
//        <div className="ml-4">
//            <h2 className="text-lg font-bold mt-1">Shop Name</h2>
//          <p className="text-xs font-semibold">Madrasa Road Near Madrasa Masjid, 731101</p>
//        </div>
//     </div>

// </div>
//     </div>     
// {/* Tags */}
// <div className="z-100 w-full p-4 md:p-6">
//     <div className="z-50 bg-[#FF1658] rounded-xl p-3 flex justify-center">
//         <p className="text-center font-semibold text-xs text-white">
//             Ask The Shopker  To Scan The Code During Billing</p>
//     </div>

// </div>


// {/* Form */}
// <div className="z-100 w-full grid grid-cols-1 md:grid-cols-2 gap-2  p-4 md:p-6">
// <div className="mx-auto p-3 w-70 h-70 bg-gray-800 shadow-2xl rounded-2xl  z-50"></div>



// <p className="bg-white z-100 text-black p-3 rounded-xl text-sm flex justify-center">
//     10% Instant Discount On Next Purchase</p>


// </div>




// <svg className="absolute bottom-0 left-0 w-full h-[70%]"
//           viewBox="0 0 1440 320" preserveAspectRatio="none"
//           xmlns="http://www.w3.org/2000/svg">
//           <path fill="#FF1658"
//             fillOpacity="1" d="M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z"/>
// </svg>

//   </div>

//    <NavbarBottom />

//     </>
//   );
// };

// export default QRCode;