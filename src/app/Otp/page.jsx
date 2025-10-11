

'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import Image from "next/image";




const OtpPage  = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRef = useRef();

    const router = useRouter();
    
    const handleOtp = (e, index) => {
      const newOtp = [...otp];
      newOtp[index] = e.target.value;
      setOtp(newOtp);

      // Move focus to the next input if there's a value
      if (e.target.value && index < otp.length - 1) {
          e.target.nextElementSibling?.focus();
      }
  };

    const handleSubmitOtp = (e) => {
       e.preventDefault();
       console.log(otp.join(''))
    }

    return (
        <>
         <div className="min-h-screen w-full flex flex-col items-center justify-center ">
        
        <div className="text-center w-full flex justify-center">
      <Image src="/logo.jpg"  width={300}  height={300}  alt="Logo" className="text-center"/>
        </div>

        <form onSubmit={handleSubmitOtp} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold">We sent you an SMS</h1>
        <p className="text-gray-500 mt-1">Enter the 4-digit code below</p>
      </div>

      <div className="flex gap-4 justify-center mb-6">
        {otp.map((digit, i) => (
          <input  key={i} type="text"  maxLength="1"  ref={inputRef} onChange={(e) => handleOtp(e,i)}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        ))}
      </div>

      <button type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
       > Verify OTP </button>

    </form>
    </div>
    </>
    )
}

export default OtpPage;
