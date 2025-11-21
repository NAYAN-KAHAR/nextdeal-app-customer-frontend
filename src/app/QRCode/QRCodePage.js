'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import axios from 'axios';
import { toPng } from 'html-to-image';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import { FiSearch } from 'react-icons/fi';


const QRCodePage = () => {
  const searchParams = useSearchParams();
  
  const [qrValue, setQRValue] = useState(null);
  const [shopkeeperMobile, setShopkeeperMobile] = useState('');
  const [shopkeeper, setShopkeeper] = useState('');
  const qrRef = useRef(null); // For capturing the QR code

  const getShopkeeper = async () => {
    try{
      const mobile  = shopkeeperMobile;
      if(mobile){
            const url = `${apiUrl}/api/shopkeeper-profile-data/${mobile}`;
            const res = await axios.get(url, { withCredentials: true });
            console.log('data',res.data);
            setShopkeeper(res.data.shopkeeper)
      } 
    }catch(err){
      console.log(err)
    }
  } 


console.log('shopkeeper', shopkeeper);

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
      <NavbarTop />
 
       <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg- relative">
        
         <div className="w-full p-2  bg-[#17186C] pt-6 rounded-b-2xl">
                      
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
      </div>

        

        


    <div className="p-4 text-2xl font-bold mt-2">
        <div className="flex rounded-2xl p-2 shadow-2xl bg-[#E6EEFF]">
        <img src={shopkeeper.shopImg ? shopkeeper.shopImg : "https://img.freepik.com/premium-vector/twostory-store-shop-with-brick-wall-vector-3d-clipart-isolated-white-background_396616-1044.jpg?semt=ais_hybrid&w=740&q=80"} alt="shop image" className="w-20 h-20 rounded-full object-cover"/>
        <div className="flex flex-col justify-between flex-1">
          {/* Shop name and address */}
          
            <div className="ml-4">
              <h2 className="text-lg font-bold mt-1">{shopkeeper && shopkeeper.business_name}</h2>
            <p className="text-xs font-semibold">{shopkeeper && shopkeeper.address}</p>
            </div>
        </div>

    </div>
        </div>     
    {/* Tags */}
    <div className="z-100 w-full p-4 md:p-6">
        <div className="z-50 bg-[#17186C] rounded-xl p-3 flex justify-center">
            <p className="text-center font-semibold text-xs text-white">
                Ask The Shopker  To Accept Your Request During Billing</p>
        </div>

    </div>


 {/* Form */}
  <div className="z-100 w-full grid grid-cols-1 md:grid-cols-1 gap-2 p-4 md:p-6">         
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