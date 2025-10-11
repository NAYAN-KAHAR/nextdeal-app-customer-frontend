
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




const ShopPage = () => {
  const [shop, setShop] = useState('');
  const [allCoupons, setAllCoupons] = useState([]);
  const [reserveAllCoupons, setReserveAllCoupons] = useState([]);
  const [customer_mobile, setCustomer_mobile] = useState();

  const [auth, setAuth] = useState();
  const [loading, setLoding] = useState(true);

  const router = useRouter();
  const socket = useRef(null);  

  const [searchTerm, setSearchTerm,] = useState('');

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
    }finally{
      setLoding(false);
    }
  };
  
  checkAuth();
 }, [router]);




const handleInput = (e) => {
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
  }, 300);

  return () => clearTimeout(delayDebounce); 
}, [searchTerm, reserveAllCoupons]);



// console.log('allcoupon', allCoupons);


  // Fetch shop and coupons
  const getShopData = async () => {
    try {
       const mobile = id;
      const res = await axios.get(`${apiUrl}/api/per-shopkeeper-shop/${mobile}`,
         { withCredentials: true });
         console.log(res.data);
      setShop(res.data.shopkeeper);
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


  return (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-pink-50 relative">
       
        <div className="text-center w-full flex  mt-6 max-w:md mx-auto">

      {/* upper navbar */}
        <div className="w-full p-2 flex justify-center items-center">
            <div className="relative w-full md:w-[400px]">
                <input type="text" placeholder="Search your Coupon" onChange={handleInput}
                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-2xl border border-gray-700 
                outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
        </div>
          

  </div>


    <div className="w-full bg-[#FF1658] flex p-2 items-center justify-center gap-5">
      <p className="md:text-lg text-[12px] text-white font-semibold">Shop Now Free Coupon and get discount in your first Order</p>
      
    </div>
        


<div className="p-4 text-2xl font-bold mt-2">
    <div className="flex rounded-2xl p-2 shadow-2xl bg-white">
    <img src={shop.shopImg ? shop.shopImg : 'https://i.ytimg.com/vi/UsV5lQ9kVJY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvcVX_rapybwEyLrWEb8HLrwi-qg'} alt="shop image" className="w-20 h-20 rounded-full object-cover"/>
    <div className="flex flex-col justify-between flex-1">
      {/* Shop name and address */}
      
       <div className="ml-4">
           <h2 className="text-lg font-bold mt-1">{shop && shop.business_name}</h2>
         <p className="text-xs font-semibold">{shop && shop.address}</p>
       </div>
    </div>

</div>
    </div>  


  {/* shopcard */}
<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
{allCoupons && allCoupons.map((value, i) => {
    return [...Array(Number(value.freeCoupon))].map((_,i) => {
      return  <div key={i} className="p-3 bg-white shadow-2xl rounded-2xl flex justify-between z-50">
            <p className="text-sm">{value.couponName}</p>
            <button onClick={() =>handleRedeemClick (value)} className="bg-[#FF1658] px-3 py-1 rounded-2xl cursor-pointer
            hover:bg-red-400 transition text-white font-semibold">Redeem</button>
        </div>

    })
    
      
      

} )}

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

export default ShopPage;