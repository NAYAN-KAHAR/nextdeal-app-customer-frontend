'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;



const IntroPage = () => {
  const [auth, setAuth] = useState(false);
  // const [loading, setLoading] = useState(true);

  const router = useRouter();
  
  //Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/verify`, {
          withCredentials: true,
        });

        if (res.data.authenticated) {
          setAuth(true);
          router.push('/HomePage');
        }
      } catch (err) {
        console.log('User not logged in');
      }
    };

    checkAuth();
  }, [router]);



  return auth ? null : (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-rose-300 via-pink-00 to-purple-500 text-white overflow-hidden relative">
      
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full h-[140px]" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="0.3"
            d="M0,160L60,149.3C120,139,240,117,360,128C480,139,600,181,720,192C840,203,960,181,1080,165.3C1200,149,1320,139,1380,133.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center z-10 relative">
        <Image src="/logo.png" alt="Logo" width={160} height={160}
          className="rounded-full shadow-lg animate-bounce-slow"/>

        <h1 className="mt-6 text-4xl font-extrabold tracking-wide">
          Welcome to <span className="font-extrabold text-black">NEXTDEAL</span>
        </h1>
        <p className="mt-3 text-lg text-pink-100 max-w-xs">
          Discover amazing offers and save more every day!
        </p>

        <Link href="/Signup">
          <button className="mt-10 w-70 bg-white text-rose-600 font-semibold py-3 px-8 rounded-full shadow-md 
            hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
          > Get Started </button>
        </Link>
      </div>

   
    </div>
  );
}

export default IntroPage;








//  'use client';
// import Link from "next/link";
// import { useRouter } from 'next/navigation'; 
// import { useState, useEffect } from "react";
// import Image from 'next/image';
// import { FcGoogle } from 'react-icons/fc'; // Google icon
// import { MdPhoneIphone } from 'react-icons/md'; // Mobile icon



// const IntroPage = () => {
//   const [steps, setSteps] = useState(1);
//   const [count, setCount] = useState(0);

//   const router = useRouter();
//  console.log('steps', steps);

// const handleStep = () => {
//   if (steps === 3) return router.push('/Signup'); // Only go to Signup after step 4
//   setSteps(steps + 1); // Otherwise, just go to next step
// };



//     return(
//         <>
 

//        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 shadow-lg">
//   <div className="text-center w-full flex justify-center mb-4">

//                 <Image src={'/logo.png'} width={300} height={300} className="text-center" alt="image">
//                 </Image>
                
//                 </div>
//         <div className="w-full max-w-md p-6 rounded-xl text-center">
//             <div className="flex flex-col gap-8">
            
            
//                 {steps ===1 ? (
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">  Welcome to NEXTDEAL</h1>
//                          <p className="text-gray-600 text-md mt-2">The smartest way to save on your shopping.</p>
//                     </div>
                  
//                     ):null}
            
//             {steps === 2 ? (
//                <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Exclusive Discount Just for You</h1>
//                 <p className="text-gray-600 text-md mt-2">
//                  The smartest way to save on your shopping.Don’t miss this limited-time offer!
//                 </p>
//                 </div>
            
//             ):null}

//              {steps === 3 ? (
//                <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Let’s Get Started</h1>
//                 <p className="text-gray-600 text-md mt-2">
//                  Sign up now and start saving on your next order!
//                 </p>
//                 </div>
            
//             ):null}


//             {steps > 3 ? '' : (
              
//             <div className="flex gap-3 items-center justify-center mt-4">
//                 {[1, 2, 3].map((step) => ( <div key={step}
//                  className={`w-5 h-5 rounded-full border-2 ${
//                  steps >= step ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300'
//                     }`} ></div>
//                 ))}
//             </div>
//             )}

//             {steps > 3 ? '' : (
//               <button className="px-6 py-3 bg-red-600 hover:bg-red-500 transition 
//                 text-white font-semibold text-lg rounded-2xl cursor-pointer" onClick={handleStep}>
//                 {steps === 1 && 'Next'}
//                 {steps === 2 && 'Claim Your Discount'}
//                 {steps === 3 && 'Register Now'}
//             </button>
//             )}
            
//             </div>
//         </div>
// </div>


//         </>
//     )
//  }

//  export default IntroPage