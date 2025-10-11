'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoMenuSharp, IoCloseSharp } from 'react-icons/io5';
import { IoHomeSharp, IoPersonSharp, IoPricetagSharp, IoBookmarkSharp, IoLogOutSharp } from 'react-icons/io5';
import axios from 'axios';
import { ToastContainer, toast} from  'react-toastify';

import { usePathname, useRouter } from 'next/navigation';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;


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
     <div className="w-full bg-white shadow-sm z-60 fixed top-0 md:flex-row flex-col justify-center items-center">
  <div className="w-full px-4 flex justify-between items-center max-w-7xl">
          <Link href="/">
            <img src={'/logo.png'} className="w-30 h-13 object-cover"  alt="logo"/>
          </Link>


      <div className="w-27 md:w-80 md:px-6">
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
    </div>

          {isMobile ? (
            <div onClick={handleMenuToggle} className="cursor-pointer">
              {isMenuOpen ? <IoCloseSharp size={30} /> : <IoMenuSharp size={30} />}
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
        {isMobile && isMenuOpen && (
          <div className="fixed top-16 right-0 w-[70%] h-screen bg-white shadow-lg z-100 px-6 py-8
           flex flex-col gap-6 font-semibold transition-all duration-300 ease-in-out">
          
          <div>
            <img src={userImage ? userImage : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZRC_JCJG4XCFypC11H549nZXGFvUTJO8qQ&s'}
             alt="profile-img" className='w-20 h-20 rounded-full'/>
             <div className='flex justify-between items-center mt-2'>
              <h1 className='text-lg font-bold'>{userName && userName}</h1>
              <Link  href={'/Profile'} className='text-xs font-bold text-blue-500 cusor-pointer'
              onClick={() => setIsMenuOpen(!isMenuOpen)} >Edit</Link>
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
            


          <div className='fixed bottom-15 flex flex-col gap-2'>
              <h1 className='text-sm font-bold'>Any Queris Call At</h1>
              <p className='text-lg font-semibold cusor-pointer'>+917894561239</p>
             
          </div>

          </div>
        )}
      
    </>
  );
};

export default NavbarTop;
