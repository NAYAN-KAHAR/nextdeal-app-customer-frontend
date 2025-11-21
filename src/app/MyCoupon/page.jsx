
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


const shops = [
  {
    shopName: "Beauty Bliss",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "15% OFF on orders ₹999+",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Travel Troopers",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Holiday Sale - 20% OFF",   
     address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Fit & Fine",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "New Year Offer: 25% OFF",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "GameZone",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Gaming Week - 50% OFF",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Home Harmony",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Up to 35% OFF",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Watch World",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Time Deals - 30% OFF",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Smart Appliances",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Combo Offer - Save ₹1000",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Crafty Corner",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Handmade Sale - 20% OFF",
        address: "Tech Park, Bengaluru",
  },
];


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


if(loading) return <div className="text-center mt-4">Checking</div>
if(!auth) return <div className="text-center mt-4">Checking</div>

  return (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-white relative">
       
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
            <p className="md:text-lg text-xs text-white font-semibold">Get Free Coupon For Your Next Order</p>
            <Link href={'/FreeCoupon'} className="md:text-lg text-xs px-5 py-1.5 bg-red-600 
             text-white cursor-pointer rounded-2xl font-bold">show now</Link>
           </div>
      </div>


  


<div className="md:p-6 p-4 text-2xl font-bold mt-2">My Coupons</div>      
  {/* shopcard */}
<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-2 ">
{myAllCoupons && myAllCoupons.map((value, i) => (
  <div key={i} className=" z-50 bg-[#E6EEFF] shadow-lg rounded-xl p-2 flex justify-between 
               transition-transform duration-200 " >

    <img src={value?.shopkeeper?.shopImg ? value?.shopkeeper?.shopImg : 'https://img.freepik.com/premium-vector/twostory-store-shop-with-brick-wall-vector-3d-clipart-isolated-white-background_396616-1044.jpg?semt=ais_hybrid&w=740&q=80'} alt="shop image"
      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"/>

    <div className="flex flex-col justify-between flex-1">
 
       <div className="ml-4">
           <h2 className="text-lg md:text-lg font-bold mt-1">{value.shopkeeper?.business_name}</h2>
        <p className="text-xs text-gray-600 mt-1 leading-snug font-medium">{value.shopkeeper?.address}</p>
        <span  className="text-xs text-green-600  leading-snug font-medium">{value?.coupon?.couponName}</span>
       </div>
     

      {/* Button aligned bottom-right */}
      <div className="flex justify-end mt-4">
        <button className="py-2 px-4 bg-[#14339A] text-white rounded-2xl text-xs 
        cursor-pointer font-semibold"
        onClick={() => handleRedeemClick(value)} > Redeem Coupon</button>
      </div>
    

</div>

  </div>
))}

</div>



      </div>
      <NavbarBottom />
    </>
  );
};

export default MyCoupon;