
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
  const [loader, setLoader] = useState(false);

  // console.log(groupedCoupons);

  // fetch all shops on homepage
  const getAllShops = async () => {
    try{
      setLoader(true);
      const res =  await axios.get(`${apiUrl}/api/all-shopkeeper-freecoupons/`, 
        {withCredentials:true});
      //  console.log(res.data);
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



// console.log('groupedCoupons', groupedCoupons);


  return (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-white relative">


   <div className="w-full p-2  bg-[#17186C] pt-6 rounded-b-2xl">
                      
      <div className="relative w-full md:w-[400px]">
           <input type="text" placeholder="Search your shop"
               className="w-full pl-10 pr-4 py-2 rounded-2xl border
               border-white outline-none focus:ring-2 focus:ring-white 
             focus:border-none text-sm text-black bg-white" />
             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2
                text-black" size={20} />
      </div>

    <div className="w-full flex p-1 items-center justify-between gap-5 mt-3">
        <p className="md:text-lg text-xs text-white font-semibold">
          Free coupon for discount on your first order.
          </p>
        <Link href={'/FreeCoupon'} className="md:text-lg text-xs px-5 py-1.5 bg-red-600 
         text-white cursor-pointer rounded-2xl font-bold">show now</Link>
     </div>
  </div>




<div className="md:p-6 p-4 text-xl font-bold ">Free Coupons</div>      



<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-2 md:p-6">
  {loader ? (
    <div className="col-span-full flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : groupedCoupons.length === 0 ? (
    <div className="col-span-full text-center text-gray-500 text-sm py-8">
      No free coupons available.
    </div>
  ) : (
    groupedCoupons.map((value, i) => (
      <div key={i} className="z-50 bg-[#E6EEFF] shadow-lg rounded-xl p-3 flex justify-between transition">
        <img
          src={value?.shopkeeper?.shopImg || 'https://img.freepik.com/premium-vector/twostory-store-shop-with-brick-wall-vector-3d-clipart-isolated-white-background_396616-1044.jpg?semt=ais_hybrid&w=740&q=80'}
          alt="shop image"
          className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
        />
        <div className="flex flex-col justify-between flex-1">
          <div className="ml-4">
            <h2 className="text-md md:text-lg font-bold mt-1">{value.shopkeeper?.business_name}</h2>
            <p className="text-xs text-gray-600 leading-snug font-medium">{value.shopkeeper?.address}</p>
          </div>
          <div className="w-full flex justify-between mt-4 items-center sm:flex-col">
            <h1 className="ml-4 font-bold">{value?.couponCount} Coupons</h1>
            <Link
              href={`/Shop/${value.shopkeeper?.mobile}`}
              className="py-1.5 px-2 bg-[#17186C] text-white rounded-2xl text-sm"
            >
              Redeem Coupon
            </Link>
          </div>
        </div>
      </div>
    ))
  )}
</div>





      </div>
      <NavbarBottom />
    </>
  );
};

export default FreeCoupon;