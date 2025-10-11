
'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import Image from "next/image";
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;


// const shopData = [
//   { shopName: "Anubhab", discount: "10%", totalSaved: 110 },
//   { shopName: "Bistro Mart", discount: "15%", totalSaved: 85 },
//   { shopName: "Urban Wear", discount: "20%", totalSaved: 240 },
//   { shopName: "Gadget World", discount: "5%", totalSaved: 50 },
//   { shopName: "Home Living", discount: "25%", totalSaved: 180 },
//   { shopName: "Beauty Bliss", discount: "12%", totalSaved: 90 },
//   { shopName: "Auto Hub", discount: "8%", totalSaved: 130 },
//   { shopName: "Fresh Farm", discount: "18%", totalSaved: 75 },
//   { shopName: "Style Central", discount: "10%", totalSaved: 210 },
//   { shopName: "Book Nook", discount: "30%", totalSaved: 60 },
// ];


const SavedPage = () => {

  const [salesCoupons, setSalesCoupons] = useState([]);
  const [allSalesCoupons, setAllSalesCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // console.log(salesCoupons);

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

  return (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-pink-50 relative">
      

        <div className="text-center w-full flex  mt-6 max-w:md mx-auto">

      {/* upper navbar */}
        <div className="w-full p-2 flex justify-center items-center">
            <div className="relative w-full md:w-[400px]">
                <input type="text" placeholder="Search shop here" onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-2xl border border-gray-700 outline-none focus:ring-2 focus:ring-red-500  focus:border-none text-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" size={20} />
            </div>
        </div>
          

  </div>


    <div className="w-full bg-[#FF1658] flex p-1 items-center justify-center gap-5">
      <p className="md:text-lg text-xs text-white font-semibold">Get Free Coupon For Your Next Order</p>
      <button className="md:text-lg text-xs px-3 py-2 bg-black underline text-white cursor-pointer rounded-2xl">show now</button>
    </div>
        

{/* Saved Table */}
<div className="md:p-6 p-4 text-2xl font-bold mt-2 ">You Saved</div>      
<div className="p-2 overflow-x-auto rounded-2xl relative z-10">
  <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-2xl ">
    <thead className="bg-gray-100 ">
      <tr>
        <th className="text-left px-4 py-3 text-xs font-bold">SHOP NAME </th>
        <th className="text-left px-4 py-3 text-xs font-bold">DISCOUNT COUPON</th>
        <th className="text-left px-4 py-3 text-xs font-bold"> TOTAL SAVED</th>
      </tr>
    </thead>

    <tbody className="bg-white ">
    {salesCoupons && salesCoupons.map((value,i) => {
        return  <tr key={i} className="hover:bg-gray-200 border-b
         border-gray-500 mb-2 transition ">
        <td className="px-4 py-4 text-sm text-gray-800 ">{value.shopkeeper?.business_name}</td>
        <td className="px-4 py-4 text-sm text-green-700">
          <span>{value.coupon?.discount}</span>
          <span>{value.coupon.discountType === 'percentage' ? '%':''} Coupon</span>
          </td>
        <td className="px-4 py-4 text-sm text-gray-800">
          ₹{ (value.coupon.purchase_amount - value.coupon.subtotal).toFixed(1) }

          </td>
      </tr>
      
    })}
  <tr  className="hover:bg-gray-200">
     <td className="px-4 font-semibold">Total Saved</td><td></td>
    <td className="p-1.5 px-2 font-semibold">
      ₹ {salesCoupons && salesCoupons.reduce((acc, curr) => {
        return acc + Number(curr.coupon.purchase_amount - curr.coupon.subtotal);
      }, 0).toFixed(2)}
    </td>

  </tr>
     
    </tbody>
  </table>
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

export default SavedPage;