
'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 
// import axios from 'axios';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Image from "next/image";
import { FcGoogle } from 'react-icons/fc'; 
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;



const SignupSchema = Yup.object().shape({
     name: Yup.string().min(2, 'Too Short!').max(30, 'Too Long!')
   .when('isSignup', {
      is: true,
      then: (schema) => schema.required('Name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
   password: Yup.string().min(6, 'Password should beof minimum 6 characters length').required('Password Required'),
    mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
        .required('Mobile number is required'),
 });


const SignUp  = () => {
    const [signUp, setSignUp] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true); 
    const router = useRouter();
  // console.log(apiUrl)

// Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/verify`, { withCredentials: true});

        if (res.data.authenticated) {
          setAuth(true);
          router.push('/HomePage');
        }
      } catch (err) {
        console.log('User not logged in');
        router.push('/Signup');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

    const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      mobile: '',
      isSignup: signUp,
    },

    validationSchema : SignupSchema,

    onSubmit: async (values) => {
      console.log(values);
      const { isSignup, name, mobile, password} = values;
         try {
         
          if(signUp){
             const res = await axios.post(`${apiUrl}/api/signup`,
                {name, mobile, password},{ withCredentials: true });
                 console.log(res.data);
                 toast.success(res.data.message);
                 setSignUp(!signUp);
          }else{
             const res =  await axios.post(`${apiUrl}/api/login`,
              {mobile,password}, { withCredentials: true });
              console.log(res.data);
              toast.success(res.data.message);
              router.push('/HomePage');
          }
        
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.error);
        router.push('/Signup');
      }
     
    },
  });
if (loading) return null;

   return auth ? null  : (
        <>
       <ToastContainer position="top-center"  autoClose={3000}/>

       <div className="min-h-screen w-full flex flex-col items-center justify-center
        bg-gradient-to-b from-rose-500 via-pink-200 to-purple-400 px-4">
      

      <div className="w-full max-w-md text-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="mx-auto w-14 h-14 text-white">
          <path
            d="M48 28H16a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V32a4 4 0 0 0-4-4ZM32 44a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm10-16v-6a10 10 0 0 0-20 0v6"
            fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <h1 className="text-3xl font-bold text-white drop-shadow-md mt-2">
          {signUp ? 'Create Account' : 'Welcome Back!'}
        </h1>
        <p className="text-white/90 mt-1 text-sm">
          {signUp ? 'Join us and explore great deals!' : 'Login to continue your journey.'}
        </p>
      </div>



      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-2xl font-semibold text-center text-rose-600 mb-6">
            {signUp ? 'Register' : 'Login'}
          </h2>

          <div className="flex flex-col gap-4">
            {signUp && (
              <div>
                <label className="font-semibold text-gray-800">Full Name</label>
                <input  type="text" name="name" placeholder="Your name"
                  onChange={formik.handleChange} value={formik.values.name}
                  className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 outline-none transition"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                )}
              </div>
            )}

            <div>
              <label className="font-semibold text-gray-800">Mobile Number</label>
              <input type="tel" name="mobile" placeholder="Enter mobile number"
                onChange={formik.handleChange}
                value={formik.values.mobile}
                className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 outline-none transition"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>
              )}
            </div>

            <div className="relative">
              <label className="font-semibold text-gray-800">Password</label>
              <input type={showPassword ? 'text' : 'password'}  name="password"
               placeholder="Enter password"  onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full p-3 mt-1 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 outline-none transition"
              />
              <span className="absolute right-3 top-10 text-xl text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>
          </div>

          <button type="submit"
           className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition cursor-pointer"  > {signUp ? 'Register' : 'Login'}</button>

          <p className="text-center text-gray-700 mt-4">
            {signUp ? 'Already have an account?' : "Don’t have an account?"}{' '}
            <span className="text-rose-500 font-semibold cursor-pointer"
              onClick={() => { setSignUp(!signUp); formik.setFieldValue('isSignup', !signUp);}}>
              {signUp ? 'Login' : 'Register'}
            </span>
          </p>
        </form>
      </div>
    </div>
        </>
    )
}

export default SignUp;

