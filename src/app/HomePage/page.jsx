
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




const shopCategories = [
  "grocery", "bakery", "pharmacy", "clothing", "electronics", "books",
  "furniture", "hardware", "jewelry", "toys", "pet", "beauty", "sports",
  "music", "florist", "convenience", "stationery", "optical", "shoe", "auto"
]
const HomePage = () => {
const router = useRouter();
const [auth, setAuth] = useState(false);
const [shops, setShops] = useState([]);
const [Allshops, setAllShops] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [category, setCategory] =  useState('');
const [loading, setLoding] = useState(true);


// console.log('apiURL', apiUrl);

//Redirect if already logged in
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
      }finally{
        setLoding(false);
      }
    };

    checkAuth();
  }, [router]);


const handleSelectd = (e) => {
  const selectedCategory = e.target.value.toLowerCase();
  console.log(selectedCategory);
  setCategory(selectedCategory);
};


// fetch all shops on homepage
const getAllShops = async () => {
  try{
     const url = category
      ? `${apiUrl}/api/shopkeeper-category-shop/${category}`
      : `${apiUrl}/api/shopkeepers-shops`;

    const res = await axios.get(url, { withCredentials: true });
    // console.log(res.data);
    setShops(res.data.shopkeeper);
    setAllShops(res.data.shopkeeper);
  }catch(err){
    console.log('err => ', err);
  }
} 
// /shopkeeper-category-shop/:category

useEffect(() => {
    getAllShops();
},[category]);


const handleInput = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      const filteredValue = Allshops.filter((shop) =>
        shop.business_name.toLowerCase().includes(searchTerm)
      );
      setShops(filteredValue);
     } else {
        setShops(Allshops);
    }
  }, 300);

  return () => clearTimeout(delayDebounce); 
}, [searchTerm, Allshops]);

if(loading) return <div className="mt-4 text-center">Checking</div>
if(!auth) return <div className="mt-4 text-center">Checking</div>
  return  (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-pink-50
       relative">
        {/* pt-16 and pb-16 add space for fixed navbars */}
        <div className="text-center w-full flex  mt-6 max-w:md mx-auto">

  {/* upper navbar */}
          <div className="w-full p-2 flex justify-between items-center gap-6">

            <select name="shop category" id="shop category" onChange={handleSelectd}
            className="w-1/2  border border-gray-500 rounded-md p-2 md:p-3 text-gray-700
             focus:outline-none
            focus:ring-2 focus:ring-rose-600 focus:border-none text-sm" defaultValue="">
            <option value="" disabled>Shop Categories</option>
            {shopCategories.map((value, i) => (
              <option key={i} value={value} className="text-gray-700">
                {value}
              </option>
            ))}

          </select>
          
         <div className="relative w-full md:w-[400px]">
                    <input type="text" placeholder="Search your shop"
                    className="w-full pl-10 pr-4 py-2 md:py-3 rounded-2xl border border-gray-700 
                    outline-none focus:ring-2 focus:ring-rose-500 focus:border-none text-sm"
                    onChange={handleInput}
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" size={20} />
                </div>
          </div>
          

      </div>


      <div className="w-full bg-[#FF1658] flex p-1 items-center justify-center gap-5 mt-2">
        <p className="md:text-lg text-xs text-white font-semibold">Get Free Coupon For Your Next Order</p>
        <button className="md:text-lg text-xs px-3 py-2 bg-black underline text-white cursor-pointer rounded-2xl">show now</button>
      </div>
          


            
      {/* shopcard */}

      <div className=" w-full grid grid-cols-2 md:grid-cols-4 gap-6 p-2 ">
        {shops.map((value, i) => (
          <div  className=" bg-white shadow-lg rounded-xl p-4 flex flex-col items-center
          text-center transition-transform duration-200 hover:scale-105 z-50" >
            <img src={value.shopImg ? value.shopImg:'https://img.freepik.com/free-vector/shop-with-sign-we-are-open_52683-38687.jpg?semt=ais_hybrid&w=740&q=80'} alt="shop image"
              className="w-25 h-25 md:w-32 md:h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-md md:text-lg font-semibold"> {value.business_name}</h2>
            {/* <p className="text-sm text-gray-600 mt-1 font-medium">{value.business_category}</p> */}
            <p className="text-[12px] text-green-600 mt-1 font-medium">
              <p className="text-[12px] text-green-600 mt-1 font-medium">
             <span> {value.min_offer ? value.min_offer : '10'}% to</span>
               <span className="ml-1">{value.max_offer ? value.max_offer : '30'}%</span>
                 <span className="ml-1"> Discount</span> </p>
                 </p>
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

export default HomePage;