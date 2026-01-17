
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import axios from 'axios';


const ForgetPasswordMobile = () => {

  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
        e.preventDefault();
        try{
        // mobile validation
        const indianMobileRegex = /^[6-9]\d{9}$/;
        if (!indianMobileRegex.test(mobile)) return setError("Enter a valid 10-digit Indian mobile number");
        setError("");
        setLoading(true);
        
        const res =  await axios.post(`${apiUrl}/api/customer-mobile-otp`, {mobile});
        console.log(res.data);
        if(res.data.otpSent){
           setTimeout(() => {
          setLoading(false);
          // router.push("/forgetPassword");
          router.push(`/Otp?mobile=${mobile}&from=forgotMobile`);

        }, 1200);
        }
       
      }catch(err){
        console.log(err);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-gray-500 text-center mt-1 text-sm">
          Enter your registered mobile to receive an OTP.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">

          <label className="text-sm text-gray-700 font-medium">Mobile Number</label>
          <input type="tel"
            className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-black outline-none"
            maxLength={10}   placeholder="Enter mobile number"
            value={mobile}  onChange={(e) => setMobile(e.target.value)}
            required />

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button  type="submit"  disabled={loading}
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold 
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black cursor-pointer"}`} >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent
                rounded-full animate-spin"></div>
                Sending...
              </div> ) : ( "Send OTP" )}
          </button>
        </form>

        <p className="text-center text-sm text-blue-600 mt-4 cursor-pointer"
          onClick={() => router.push("/Signup")}> Back to Login</p>
      </div>
    </div>
  );
};

export default ForgetPasswordMobile;
