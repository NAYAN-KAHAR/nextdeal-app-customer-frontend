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

const NavbarTop= () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
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

  const handleSelect = (e) => {
    console.log(e.target.value)
  };

  // const profileName = localStorage.getItem('profile_name');
 useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get(`${apiUrl}/api/customer-profile`, {withCredentials: true});
        // console.log(res.data.user);
    
         if(res.data.user.name){
          setUserName(res.data.user.name);
        }
        if(res.data.user.profileImg){
          setUserImage(res.data.user.profileImg);
        }
     
      }catch(err){
        console.log(err)
      }
    };

    fetchUser();
  },[]);

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
     <div className="w-full bg-[#18196D]  z-60 fixed top-0 md:flex-row flex-col justify-center items-center">
  <div className="w-full px-1 flex justify-between items-center max-w-7xl">
          <Link href="/HomePage">
            <img src={'/logo3.png'} className="w-30 h-13 object-cover"  alt="logo"/>
          </Link>


      {/* <div className="w-27 md:w-80 md:px-6">
        <select name="city" id="city" onChange={handleSelect}
          className="w-full border border-gray-500 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2
           focus:ring-blue-500 text-sm" defaultValue="">
          <option value="" disabled>
            Choose City
          </option>
          <option value="newyork">New York</option>
          <option value="losangeles">Los Angeles</option>
          <option value="chicago">Chicago</option>
          <option value="houston">Houston</option>
          <option value="miami">Miami</option>
        </select>
    </div> */}

          {isMobile ? (
            <div className="cursor-pointer flex gap-3 items-center">
          <select name="city"  id="city"
            onChange={(e) =>  handleSelect(e) }
            className="w-full border border-white rounded-lg px-2 py-[2px] text-black
              focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-white"
            defaultValue="" >
            <option value="" disabled className="text-black bg-white">
              Choose City
            </option>
            <option value="newyork" className="text-black bg-white">New York</option>
            <option value="losangeles" className="text-black bg-white">Los Angeles</option>
            <option value="chicago" className="text-black bg-white">Chicago</option>
            <option value="houston" className="text-black bg-white">Houston</option>
            <option value="miami" className="text-black bg-white">Miami</option>
      </select>

    {isMenuOpen ? (
      <IoCloseSharp size={35} className="text-white" onClick={handleMenuToggle}/>
    ) : (
      <FaCircleUser size={38} className="text-white" onClick={handleMenuToggle}/>
    )}
  </div>
          ) : (
            <div className="flex items-center gap-8 font-bold">

              <Link href="/HomePage" className="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                 <img src='/home.png' width={22} height={22} className={`${pathname === '/HomePage' ? 'text-blue-600':''}`}  />
                 <span className={` ${pathname === '/HomePage' ? 'text-blue-600':''} text-xs mt-1`}>Home</span>
              </Link>

              <Link href="/Profile" className="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                 <img src='/user.png' width={22} height={22} className={`${pathname === '/Profile' ? 'text-blue-600':''}`}  />
                 <span className={` ${pathname === '/Profile' ? 'text-blue-600':''}
                  text-xs mt-1`}>Profile</span>
              </Link>

            <Link href="/MyCoupon" className="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                 <img src='/promo-code (1).png' width={22} height={22} className={`${pathname === '/MyCoupon' ? 'text-blue-600':''}`}  />
                 <span className={` ${pathname === '/MyCoupon' ? 'text-blue-600':''}
                  text-xs mt-1`}>Coupon</span>
              </Link>


             <Link href="/Saved" className="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                 <img src='/bookmark.png' width={22} height={22} className={`${pathname === '/Saved' ? 'text-blue-600':''}`}  />
                 <span className={` ${pathname === '/Saved' ? 'text-blue-600':''}
                  text-xs mt-1`}>Saved</span>
              </Link>
              
              <div className="flex flex-col items-center text-gray-700 hover:text-red-600 
              cursor-pointer" onClick={handleLogout}>
               <img src='/logout.png' width={22} height={22}  />
                <span className="text-xs mt-1" >Logout</span>
              </div>
            </div>
          )}
        </div>
</div>


{/* mobile dropdown */}

<div className={` fixed top-0 right-0 w-full  h-screen bg-gray-100 shadow-lg z-100 py-2 p-2
      flex flex-col gap-6 font-semibold 
    transform transition-transform duration-500 ease-in-out
    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div onClick={handleMenuToggle} className="self-start cursor-pointer">
      <MdOutlineKeyboardBackspace size={33} className="text-gray-700" />
    </div>

   <div className='flex items-center justify-between p-4 bg-[#18186C] rounded-xl shadow-xl'>
       <img src={userImage ? userImage : '/demo_user.jpg'}
        alt="profile-img"
        className='w-20 h-20 rounded-full border-4 border-gray-200 shadow-lg'
      />
      <div className='flex flex-col items-start'>
        <h1 className='text-xl font-semibold text-white'>{userName && userName}</h1>
        <span className='text-sm text-white'>9632587412</span>
        <Link href={'/Profile'} className='mt-1 text-xs font-semibold text-blue-300 hover:underline'
         onClick={() => setIsMenuOpen(!isMenuOpen)}>
          Edit Profile
        </Link>
      </div>
    </div>



            <Link href="/HomePage" className={`py-2 border-b mt-3 flex gap-2 items-center text-gray-700
               hover:text-blue-600 cursor-pointer ${pathname === '/HomePage' ? 'bg-gray-200 text-black':''}`
               } onClick={() => setIsMenuOpen(!isMenuOpen)}>
               <img src='/home.png' width={22} height={22} />
              <span className="text-xs">Home</span>  
            </Link>
        
            <Link href={'/Profile'} className={`py-2 border-b flex gap-2 items-center text-gray-700
               hover:text-blue-600 cursor-pointer ${pathname === '/Profile' ? 'bg-gray-200 text-black':''} `
               } onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 <img src='/user.png' width={22} height={22} />
                <span className="text-xs">Profile</span>
            </Link>



            <Link href={'/MyCoupon'} className={`py-2 border-b flex gap-2 items-center text-gray-700 hover:text-blue-600 cursor-pointer ${pathname === '/MyCoupon' ? 'bg-gray-200 text-black':''}` }
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
               <img src='/promo-code (1).png' width={22} height={22} />
                <span className="text-xs">Coupon</span>
            </Link>


            <Link href={'/Saved'} className={`py-2 border-b flex gap-2 borde-b border-gray-600 items-center text-gray-700 hover:text-blue-600 cursor-pointer ${pathname === '/Saved' ? 'bg-gray-200 text-black':''}` } onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 <img src='/bookmark.png' width={22} height={22} />
                <span className="text-xs">Saved</span>
            </Link>

            <div className="ml-1 flex gap-2 items-center text-gray-700 hover:text-red-600 
            cursor-pointer" onClick={handleLogout}>
               <img src='/logout.png' width={22} height={22}  />
                <span className="text-xs" >Logout</span>
            </div>
            


          </div>
        
      
    </>
  );
};

export default NavbarTop;
