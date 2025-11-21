
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
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-white relative">
       
        <div className="w-full p-2  bg-[#17186C] pt-6 rounded-b-2xl">
                      
            <div className="relative w-full md:w-[400px]">
                <input type="text" placeholder="Search your shop"
                     className="w-full pl-10 pr-4 py-2 rounded-2xl border
                     border-white outline-none focus:ring-2 focus:ring-white 
                   focus:border-none text-sm text-black bg-white" onChange={handleInput}
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

        


<div className="p-4 text-2xl font-bold mt-2">
    <div className="flex rounded-2xl p-2 shadow-sm bg-[#E6EEFF]">
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
      return  <div key={i} className="p-3 bg-[#E6EEFF] shadow-sm rounded-2xl flex justify-between z-50">
            <p className="text-sm">{value.couponName}</p>
            <button onClick={() =>handleRedeemClick (value)} 
            className="bg-[#17186C] px-3 py-1 rounded-2xl 
            text-white font-semibold">Redeem</button>
        </div>

    })
    
      
      

} )}

</div>



      </div>
      <NavbarBottom />
    </>
  );
};

export default ShopPage;