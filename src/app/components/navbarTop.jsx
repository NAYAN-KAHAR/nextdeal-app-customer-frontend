'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoMenuSharp, IoCloseSharp } from 'react-icons/io5';
import { IoHomeSharp, IoPersonSharp, IoPricetagSharp, IoBookmarkSharp, IoLogOutSharp } from 'react-icons/io5';
import axios from 'axios';
import { ToastContainer, toast} from  'react-toastify';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { usePathname, useRouter } from 'next/navigation';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import { FaCircleUser } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import UserShopkeeperLocation from './userShopkeeperLocation'
import { MdKeyboardBackspace } from "react-icons/md";

const NavbarTop = ({ handleCity, user }) => {
  
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [userLocation, setUserLocation] = useState();

  const [locationSelect, setLocationSelect] = useState(false);

  const  pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleRoute = (category) => {
    console.log(`Routing to category: ${category}`);
  };


  // const profileName = localStorage.getItem('profile_name');
 useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get(`${apiUrl}/api/customer-profile`, {withCredentials: true});
        console.log('from navbar', res.data);
        setUserLocation(res.data.user);
        handleCity(res.data.user.city);
        if(res.data.user.profileImg){
          setUserImage(res.data.user.profileImg);
        }
     
      }catch(err){
        console.log(err)
      }
    };

    fetchUser();
  },[locationSelect, user]);



const handleLogout = async () => {
      try{
         const res = await axios.post( `${apiUrl}/api/logout`, {}, {withCredentials: true});
         console.log(res.data.message);
         toast.success(res.data.message);
         setTimeout(() => router.push('/Signup'), 500);
      }catch(err){
        console.log('error', err);
      }
  }

  return (
    <>
    <ToastContainer />
    {/* <div className="w-full bg-[#18196D] fixed top-0 z-60 md:flex-row flex-col
     justify-center items-center"> */}

       <div className="w-full bg-white fixed top-0 z-60 md:flex-row flex-col
     justify-center items-center shadow">

      <div className="w-full px-1 flex justify-between items-center max-w-7xl">

         <Link href="/HomePage">
          <img src={'/shops/logo4.png'} className="w-30 h-15 object-cover" alt="logo" />
        </Link> 


       {/* { pathname === '/HomePage' ? <Link href="/HomePage">
            <img src={'/shops/logo4.png'} className="w-30 h-13 object-cover"  alt="logo"/>
          </Link> :
          <MdKeyboardBackspace size={40} className='pb-1 pt-1' onClick={() => router.back()}/>
          } */}
  
        {isMobile && (
          <div className="flex items-center gap-3">

         <div className="flex items-center gap-2 bg-white px-3 py-0.5 rounded-xl shadow 
            cursor-pointer" onClick={() => setLocationSelect(true)} >
          <MdLocationPin size={18} className="text-[#18196D]" />

          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-gray-900">
              {userLocation?.city || "Select City"}
            </span>

            <span className="text-[10px] text-gray-600">
              {userLocation?.address?.slice(0, 18) || "Tap to choose location"}
            </span>
          </div>
      </div>

        {isMenuOpen ? (''
            ) : (
            <FaCircleUser size={38} className="text-black cursor-pointer"
             onClick={handleMenuToggle}/>
        )}

      </div>
    )}

  </div>
</div>


{/*  */}

<UserShopkeeperLocation locationSelect={locationSelect} 
  setLocationSelect={setLocationSelect} />
{/*  */}


{/* mobile dropdown */}
    <div className={`fixed top-0 right-0 w-full max-w-xs h-screen bg-white/90 backdrop-blur-lg 
      shadow-2xl z-100 py-6 px-4
        flex flex-col gap-6 font-medium text-gray-800
        transform transition-transform duration-500 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    
      <div onClick={handleMenuToggle}
        className="self-start p-1 rounded-full bg-gray-200 cursor-pointer transition z-120">
        <MdOutlineKeyboardBackspace size={26} className="text-gray-700" />
       
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#17186C]
       to-[#2291ec] rounded-2xl shadow-xl">
        <img src={userImage ? userImage : '/demo_user.jpg'} alt="profile-img"
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"/>
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-white capitalize">
            {userLocation && userLocation.name || "User Name"}</h2>
          <span className="text-sm text-white/80">{userLocation && userLocation.mobile || '+91 99900789'}</span>

          <Link href="/Profile" className="mt-1 text-xs font-semibold text-orange-400 
          hover:underline"  onClick={() => setIsMenuOpen(false)}> Edit Profile
          </Link>
        </div>
      </div>

  {/* Menu Links */}
  <nav className="flex flex-col gap-2 mt-4">
      {[
        { name: "Home", href: "/HomePage", icon: "/home.png" },
        { name: "Profile", href: "/Profile", icon: "/user.png" },
        { name: "Coupon", href: "/MyCoupon", icon: "/promo-code (1).png" },
        { name: "Saved", href: "/Saved", icon: "/bookmark.png" },
      ].map((item) => (
        <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all 
            hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:text-blue-700 ${
            pathname === item.href ? "bg-blue-50 text-blue-700 font-semibold" : ""
          }`} >
          <img src={item.icon} width={22} height={22} />
          <span className="text-sm">{item.name}</span>
        </Link>
      ))}

      {/* Logout Button */}
      <div className="flex items-center gap-3 p-3 mt-4 rounded-xl cursor-pointer transition
       hover:bg-red-100 hover:text-red-600" onClick={handleLogout} >
        <img src="/logout.png" width={22} height={22} />
        <span className="text-sm font-semibold">Logout</span>
      </div>
    </nav>

  {/* Optional Decorative SVG Background */}
  <svg className="absolute -top-20 -right-20 w-72 h-72 opacity-30"
    viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#17186C" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2A2BA0" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#grad)" />
  </svg>
</div>

      
    </>
  );
};

export default NavbarTop;
