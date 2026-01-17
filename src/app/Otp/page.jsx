'use client';
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import axios from "axios";

const OtpContent = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [btnLoader, setBtnLoader] = useState(false);
    const [auth, setAuth] = useState(false);

    const searchParams = useSearchParams();
    const mobile = searchParams.get('mobile');
    const from = searchParams.get("from");

    const inputRef = useRef();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/verify`, { withCredentials: true });

                if (res.data.authenticated) {
                    setAuth(true);
                    router.push('/HomePage');
                }
            } catch (err) {
                console.log('User not logged in', err);

            }
        };

        checkAuth();
    }, [router]);


    const handleOtp = (e, index) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);

        if (e.target.value && index < otp.length - 1) {
            e.target.nextElementSibling?.focus();
        }
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        console.log(otp.join(''));
        setBtnLoader(true);
        const customerOTP = otp.join('');
        try {
            const res = await axios.post(`${apiUrl}/api/customer-otp-verification`,
                { mobile, otp: customerOTP }, { withCredentials: true });
            console.log(res.data);
            if (res.data.message === 'OTP verified successfully') {
                if (from === "forgotMobile") {
                    router.push(`/forgetPassword?mobile=${mobile}`);
                    return;
                }
                router.push('/HomePage');
            };
            setBtnLoader(false);
        } catch (err) {
            console.log(err);
        } finally {
            setBtnLoader(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 overflow-hidden">

            <svg className="absolute top-0 left-0 w-72 h-72 -translate-x-1/4 -translate-y-1/4 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="100" fill="#A78BFA" />
            </svg>

            <svg className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/4 translate-y-1/4 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="100" rx="120" ry="80" fill="#FBBF24" />
            </svg>


            <svg className="absolute top-1/4 right-0 w-48 h-48 opacity-15" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <polygon points="100,0 200,50 150,200 50,150 0,50" fill="#F472B6" /> {/* Pink polygon */}
            </svg>


            <div className="relative bg-white rounded-2xl p-8 max-w-xs md:max-w-md w-full">
                <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
                    Verify Your OTP </h2>

                <p className="text-center text-gray-600 mb-6">
                    Almost done! Enter the 4-digit OTP sent to
                    <span className="font-medium text-gray-800"> +91 {mobile && mobile} </span>
                    to unlock offers and continue your order.
                </p>



                <form>
                    <div className="flex space-x-3 justify-center mb-6">
                        {/* OTP Inputs */}
                        {[...Array(4)].map((_, i) => (
                            <input key={i} type="tel" maxLength="1"
                                ref={i === 0 ? inputRef : null}
                                onChange={(e) => handleOtp(e, i)}
                                className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 
                            rounded-lg text-center text-lg font-semibold 
                            focus:outline-none focus:ring-2 focus:ring-orange-500 
                            focus:scale-110 transform transition-all duration-200 shadow-sm"
                            />
                        ))}
                    </div>

                    <button type="submit" onClick={handleSubmitOtp} disabled={btnLoader}
                        className={`w-full bg-orange-500 text-white py-2 md:py-3 rounded-lg font-semibold shadow-md
             flex justify-center items-center gap-2
            ${btnLoader ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`} >

                        {btnLoader && (
                            <span className="w-5 h-5 border-4 border-white border-t-transparent
                 rounded-full animate-spin"></span>)}

                        {btnLoader ? 'Verifying...' : 'Verify OTP'}
                    </button>

                </form>
                <p className="text-center text-gray-600 mt-6 text-sm">
                    Didn’t receive the code?{" "}
                    <span className="text-orange-500 hover:underline cursor-pointer transition duration-200">
                        Resend OTP
                    </span>
                </p>
            </div>
        </div>

    );
};

const OtpPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"></div>}>
            <OtpContent />
        </Suspense>
    );
};

export default OtpPage;
