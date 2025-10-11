import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoHomeSharp, IoPersonSharp, IoPricetagSharp, IoBookmarkSharp, IoLogOutSharp } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast} from  'react-toastify';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;


const NavbarBottom = () => {
  const [isMobile, setIsMobile] = useState(false);
  const  pathname = usePathname();
  const  router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   const handleLogout = async () => {
      try{
        console.log('clicked')
         const res = await axios.post(`${apiUrl}/api/logout`,{}, {withCredentials: true});
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
    <div className="w-full bg-white shadow-sm z-50 fixed bottom-0 left-0 flex justify-center">
      <nav className="max-w-md w-full">
        <div className="py-2 flex justify-around items-center">
          {isMobile ? (
            <>
               <Link href={'/HomePage'} className="flex flex-col items-center hover:text-blue-600 cursor-pointer">
                <img src={'/home.png'} width={22} height={22} className={`${pathname === '/HomePage' ? 'text-blue-600':''}`}  />
                 <span className={` ${pathname === '/HomePage' ? 'text-blue-600':''} font-bold text-xs mt-1`}>Home</span>
              </Link>

              <Link href={'/Profile'} className="flex flex-col items-center  hover:text-blue-600 cursor-pointer">
                <img src='/user.png' width={22} height={22} className={`${pathname === '/Profile' ? 'text-blue-600':''}`}/>
                <span className={` ${pathname === '/Profile' ? 'text-blue-600':''} font-bold text-xs mt-1`}>Profile</span>
              </Link>

              <Link href={'/MyCoupon'} className="flex flex-col items-center hover:text-blue-600 cursor-pointer">
                <img src="/promo-code (1).png" width={22} height={22}
                 className={`${pathname === '/MyCoupon' || pathname === '/FreeCoupon' ? 'text-blue-600' : ''}
                 `}/>
                 <span className={`${pathname === '/MyCoupon' || pathname === '/FreeCoupon' ? 
                 'text-blue-600' : ''} font-bold text-xs mt-1`} > Coupon </span>
                 </Link>

              <Link href={'/Saved'} className="flex flex-col items-center hover:text-blue-600 cursor-pointer">
                <img src='/bookmark.png' width={22} height={22}  className={`${pathname === '/Saved' ? 'text-blue-600':''}`}/>
                <span className={` ${pathname === '/Saved' ? 'text-blue-600':''} font-bold text-xs mt-1`}>Saved</span>
              </Link>

              <div className="flex flex-col items-center text-gray-700 hover:text-red-600 
              cursor-pointer" onClick={handleLogout}>
                <img src='/logout.png' width={22} height={22} />
                <span className="text-xs mt-1 font-bold hover:text-red-600"
                 >Logout</span>
              </div>
            </>
          ) : (
            <ul className="flex gap-8 font-bold justify-center w-full px-4">
             
            </ul>
          )}
        </div>
      </nav>
    </div>
    </>
  );
};

export default NavbarBottom;
