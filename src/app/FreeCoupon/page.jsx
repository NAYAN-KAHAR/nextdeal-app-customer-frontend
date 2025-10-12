
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



const shops = [
  {
    shopName: "Daily Mart",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "10% Cashback",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Toy Town",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Flat 30% OFF",
        address: "Tech Park, Bengaluru",
  },
  {
    shopName: "Pixel Phones",
    image: "https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg",
    discount: "Extra ₹500 OFF",
        address: "Tech Park, Bengaluru",
  },
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


const FreeCoupon = () => {
  const [allCoupons, setAllCoupons] = useState([]);
  const [reserveAllCoupons, setReserveAllCoupons] = useState([]);
  const [groupedCoupons, setGroupedCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  

  // console.log(groupedCoupons);

  // fetch all shops on homepage
  const getAllShops = async () => {
    try{
      const res =  await axios.get(`${apiUrl}/api/all-shopkeeper-freecoupons/`, 
        {withCredentials:true});
       console.log(res.data);
      const newCoupons = [...res.data.allFreeCoupons];
      setAllCoupons(newCoupons);
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



// console.log('groupedCoupons', groupedCoupons);


  return (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-pink-50 relative">
        {/* pt-16 and pb-16 add space for fixed navbars */}
        <div className="text-center w-full flex  mt-6 max-w:md mx-auto">

      {/* upper navbar */}
        <div className="w-full p-2 flex justify-center items-center">
            <div className="relative w-full md:w-[400px]">
                <input type="text" placeholder="Search your Coupon"
                 value={searchTerm}
                 onChange={handleCouponSerach}

                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-2xl border border-gray-700
                 outline-none focus:ring-2 focus:ring-rose-500 focus:border-none text-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" size={20} />
            </div>
        </div>
          

  </div>


    <div className="w-full bg-[#FF1658] flex p-2 items-center justify-center gap-5 mt-2">
      <p className="md:text-lg text-xs text-white font-semibold">Shop Now with Free Coupon and get discount  in your first Order</p>
    </div>
        


<div className="md:p-6 p-4 text-2xl font-bold ">All Shop Free Coupons</div>      
  {/* shopcard */}
<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
{/* <div className="w-full flex justify-between items-center p-1.5 md:p-6 flex-col gap-2"> */}
{groupedCoupons && groupedCoupons.map((value, i) => (
  <div key={i} className="z-50 bg-white shadow-lg rounded-xl p-3 flex justify-between 
               transition" >

  <img
  src={value && value.shopkeeper?.shopImg ? value.shopkeeper.shopImg
      : 'https://img.freepik.com/premium-vector/twostory-store-shop-with-brick-wall-vector-3d-clipart-isolated-white-background_396616-1044.jpg?semt=ais_hybrid&w=740&q=80' } alt="shop image"
      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover" />


    <div className="flex flex-col justify-between flex-1">
      {/* Shop name and address */}
      
       <div className="ml-4">
           <h2 className="text-md md:text-lg font-semibold mt-1">{value.shopkeeper?.business_name}</h2>
        <p className="text-sm text-gray-600 mt-1 font-medium">{value.shopkeeper?.address}</p>
       
       </div>
     

      {/* Button aligned bottom-right */}
      <div className="w-full flex justify-between mt-4 items-center sm:flex-col">
         <h1 className="ml-4 font-bold">{value?.couponCount} Coupons</h1>
         <Link href={`/Shop/${value.shopkeeper?.mobile}`} className="py-2 px-2
          bg-[#FF1658] text-white rounded-2xl text-sm 
        cursor-pointer transition-all hover:bg-red-500" > Redeem Coupon</Link>
      </div>
    

</div>

  </div>
))}

</div>


 <svg className="fixed bottom-0 left-0 w-full h-[70%]"
          viewBox="0 0 1440 320" preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF1658"
            fillOpacity="1" d="M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z"/>
        </svg>


      </div>
      <NavbarBottom />
    </>
  );
};

export default FreeCoupon;