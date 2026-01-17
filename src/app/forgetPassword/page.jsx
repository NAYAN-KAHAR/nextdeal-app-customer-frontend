"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;


const ForgetPasswordContent = () => {

  const router = useRouter();

  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile");

  const [loading, setLoading] = useState(false);
  const [showPass1, setShowPass1] = useState(false);


  // Yup validation
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm password is required"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Submitted:", values);
      setLoading(true);
      try {
        const { password } = values;
        const res = await axios.put(`${apiUrl}/api/profile-update`, { password, mobile },
          { withCredentials: true }
        );
        console.log(res.data);
        if (res.data.isUpdate) {
          setTimeout(() => {
            setLoading(false);
            router.push("/Signup");
          }, 1500);
        }
      } catch (err) {
        console.log(err);
      }

    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br
     from-gray-100 to-gray-200">

      <div className="bg-white w-full max-w-md p-6 rounded-2xl ">
        <h1 className="text-3xl font-bold text-center text-black">Reset Password</h1>
        <p className="text-center text-gray-600 mt-1">Set your new password</p>

        <form onSubmit={formik.handleSubmit} className="mt-6">

          {/* New Password */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-800">New Password</label>

            <div className="relative">
              <input type={showPass1 ? "text" : "password"} name="password"
                placeholder="Enter new password" onChange={formik.handleChange}
                value={formik.values.password} maxLength={12}
                className="w-full p-2.5 mt-1 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-black outline-none pr-10" />

              <span className="absolute right-3 top-4 text-xl text-gray-500 cursor-pointer"
                onClick={() => setShowPass1(!showPass1)} >
                {showPass1 ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Confirm Password</label>

            <div className="relative">
              <input type="password" name="confirmPassword"
                placeholder="Confirm password" onChange={formik.handleChange}
                value={formik.values.confirmPassword} maxLength={12}
                className="w-full p-2.5 mt-1 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-black outline-none pr-10" />
            </div>

            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl text-white font-semibold 
            flex justify-center items-center gap-2 transition 
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-700 cursor-pointer"}`}  >
            {loading && (
              <div className="h-5 w-5 border-2 border-white border-t-transparent 
              rounded-full animate-spin"></div>
            )}
            Update Password
          </button>

          <p onClick={() => router.push("/Signup")}
            className="text-center mt-4 text-sm text-blue-600 cursor-pointer">
            Back to Login
          </p>

        </form>
      </div>
    </div>
  );
};

const ForgetPassword = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <ForgetPasswordContent />
    </Suspense>
  );
};

export default ForgetPassword;
