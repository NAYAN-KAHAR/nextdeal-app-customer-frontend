'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const IntroPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/Signup'), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#19176C] overflow-hidden">
      <div className="flex flex-col items-center animate-fade-in">
        
        <Image src="/shops/logo4.png"  alt="NEXTDEAL Logo"
          width={140} height={140}
          className="rounded-full bg-white p-2 shadow-xl animate-scale"/>

        <h1 className="mt-6 text-3xl font-extrabold text-white tracking-wide animate-fade-delay">
          NEXTDEAL
        </h1>

        <p className="mt-2 text-sm text-gray-200 animate-fade-delay">
          Discover amazing offers
        </p>

      </div>
    </div>
  );
};

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