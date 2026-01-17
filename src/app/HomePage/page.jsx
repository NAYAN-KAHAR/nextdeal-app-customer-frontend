
'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from "next/image";
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import Loader from "../components/loader";
import { useLayoutEffect } from "react";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // needed for styles



import CustomerLocation from "../components/customerLocation";

const shopCategories = [
  { value: 'all shop', label: 'all shop' },
  // ... (rest of categories omitted for brevity)
];

const bannerPhotos = ['1.png', '2.png', '3.png'];


const HomePage = () => {

  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true); // Fixed typo setLoding -> setLoading
  const [user, setUser] = useState(null);

  const [location, setLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [isManualLocation, setIsManualLocation] = useState(false);


  const [currentBanner, setCurrentBanner] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerPhotos.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [bannerPhotos.length]);

  const handleDotClick = (index) => {
    setCurrentBanner(index);
  };


  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/verify`, {
          withCredentials: true,
        });

        if (res.data.authenticated) {
          setAuth(true);
        }
      } catch (err) {
        console.log('User not logged in');
        router.push('/Signup');
      } finally {
        setLoading(false); // Fixed typo setLoding -> setLoading
      }
    };

    checkAuth();
  }, [router]);



  useEffect(() => {
    const getLoginUser = async () => {
      try {
        const res = await axios(`${apiUrl}/api/customer-profile`, { withCredentials: true });
        console.log(res.data.user);
        if (res.data.user.city) {
          setShowLocationModal(false);
        }
        setUser(res.data.user);

        window.scroll(0, 0);
      } catch (err) {
        console.log(err);
      }
    }

    getLoginUser();
  }, [location]); // This dependency might need review, but keeping as is for now



  // fetch  user location lat and lng 
  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationModal(false);
      setIsManualLocation(true);
      return;
    }

    // Get the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ lat: latitude, lng: longitude });
        setShowLocationModal(false);
        console.log(latitude, longitude);
      },
      (error) => {
        console.log("Could not get location, switching to manual:", error);
        setShowLocationModal(false);
        setIsManualLocation(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };




  // Reverse geocode when location changes
  useEffect(() => {
    if (!location) return;

    const fetchLocationDetails = async () => {
      const { lat, lng } = location;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);

        const data = await res.json();
        console.log("Full place details:", data);
        console.log("Address:", data.address);

        // store formatted address details
        const formatted = data.display_name;
        const city = data.address.city || data.address.town || data.address.village;
        const state = data.address.state;

        const payload = {
          address: formatted,
          city,
          state,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };

        // save to DB
        const updateRes = await axios.put(`${apiUrl}/api/profile-update`,
          payload, { withCredentials: true });
        console.log("Updated DB:", updateRes.data);
        setUser(updateRes.data.user);
        setShowLocationModal(false);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchLocationDetails();
  }, [location]);





  if (loading || !auth) return (
    <>


      {/* Top Navbar Skeleton */}
      <div className="min-h-full w-full bg-gray-200 flex flex-col items-start justify-start px-2 gap-1
    rounded-b-3xl">


        <div className="w-full flex justify-between items-center gap-2">
          <Skeleton height={40} width={100} /> {/* Logo */}
          <div className="flex items-center gap-4">
            <Skeleton height={28} width={100} />
            <Skeleton circle={true} height={30} width={30} />
          </div>
        </div>
        <div className="w-full ">
          <Skeleton height={180} width="100%" />
        </div>

      </div>


      {/* menu div all */}
      <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 p-2 rounded-2xl">
        {Array(3).fill("").map((_, i) => (
          <div key={i} className="bg-[#FFE7D4] p-1.5 rounded-3xl animate-pulse">
            <div className="flex gap-3 items-center">
              {/* Skeleton for image */}
              <Skeleton circle={true} height={70} width={70} />

              {/* Skeleton for text */}
              <div className="flex flex-col justify-start mt-2 w-full">
                <Skeleton height={20} width="60%" className="mb-1" />
                <Skeleton height={16} width="80%" />
              </div>
            </div>

            {/* Skeleton for button */}
            <div className="flex justify-end mt-2">
              <Skeleton height={35} width={100} className="rounded-2xl" />
            </div>
          </div>
        ))}
      </div>


      {/* Bottom Navbar Skeleton */}
      <div className="fixed bottom-0 w-full h-20 bg-gray-200 flex items-center justify-around px-4 mt-2
    rounded-t-3xl">
        {Array(5).fill('').map((_, i) => (
          <Skeleton key={i} height={40} width={60} />
        ))}
      </div>
    </>
  )


  return (
    <>
      <NavbarTop user={user} />

      <div className="min-h-full w-full flex-col justify-center  pb-16 pt-6 relative">


        <div className="w-full max-w-md mx-auto px-2 pt-11">
          <div className="relative rounded-[28px] overflow-hidden shadow-lg bg-[#18186C]">


            <img src={bannerPhotos[currentBanner]} alt={`Banner ${currentBanner + 1}`}
              className="w-full h-[190px] object-cover transition-transform duration-700 ease-out" />

            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t 
      from-black/50 via-black/10 to-transparent" />

            {/* Text Content */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-lg font-semibold leading-tight">
                Exclusive Deals Near You
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Save more on every order
              </p>
            </div>

            {/* Progress Bar Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 
      w-[40%] h-[3px] bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${((currentBanner + 1) / bannerPhotos.length) * 100}%` }} />
            </div>

          </div>
        </div>





        {/* explore card start */}
        <div className=" w-full grid grid-cols-1 md:grid-cols-1 gap-4 p-2 mt-2">

          <div className=" bg-[#FFE7D4] p-1.5 rounded-3xl ">
            <div className="flex gap-4 items-center">
              <img src='explore3.png' alt="logo" width={70} height={70} />
              <div className="flex flex-col justify-start mt-2">
                <h1 className="text-[16px] font-bold">Explore your Favorite Food</h1>
                <p className="text-[13px] text-gray-700">Order from Top Rated Restuarents & Save up to 20%.</p>
              </div>
            </div>
            <Link href={'/Restaurents'} className="flex justify-end ">
              <button className="text-white rounded-2xl bg-[#18186C] px-5 py-2
            text-sm cursor-pointer">Explore now</button>
            </Link>
          </div>


          <div className=" bg-[#D4EBFF] p-1.5 rounded-3xl ">
            <div className="flex gap-4 items-center">
              <img src='explore1.png' alt="logo" width={70} height={70} />
              <div className="flex flex-col justify-start mt-2">
                <h1 className="text-[16px] font-bold">Discount on Next Purchase</h1>
                <p className="text-[13px] text-gray-700">
                  Save More on Every Purchase at Your Nearest Store.</p>
              </div>
            </div>
            <Link href={'/AllShops'} className="flex justify-end ">
              <button className="text-white rounded-2xl bg-[#18186C] px-5 py-2
            text-sm cursor-pointer">Explore now</button>
            </Link>
          </div>


          <div className=" bg-[#F0FFD6] p-1.5 rounded-3xl ">
            <div className="flex gap-4 items-center">
              <img src='explore2.png' alt="logo" width={70} height={70} />
              <div className="flex flex-col justify-start mt-2">
                <h1 className="text-[16px] font-bold">Deliver Anything. Anywhere. Anytime</h1>
                <p className="text-[13px] text-gray-700">
                  Get Your Delivery Partner at your Door Step.</p>
              </div>
            </div>
            <div className="flex justify-end ">
              <button className="text-white rounded-2xl bg-[#18186C] px-5 py-2
            text-sm cursor-pointer">Explore now</button>
            </div>
          </div>




        </div>


        {/*  user location taking modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black/60 z-[500] flex items-end justify-center">
            <div className="bg-white w-full rounded-t-2xl p-5 shadow-lg
                    transform translate-y-0 transition-transform duration-300 ease-out
                    md:w-96">

              <h2 className="text-xl font-semibold mb-2 text-center">Allow Location Access</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">
                We need your location to show nearby restaurants and shops.
              </p>

              <button onClick={handleAllowLocation} className="w-full bg-[#18196D] text-white py-3
        rounded-lg font-medium cursor-pointer mb-2" > Allow Location
              </button>

              {/* <button onClick={() => setShowLocationModal(false)}
                className="w-full text-gray-600 py-3 cursor-pointer" >Not Now
              </button> */}

            </div>
          </div>
        )}


        {/* Manual Location Component */}
        <CustomerLocation
          locationSelect={isManualLocation}
          setLocationSelect={setIsManualLocation}
          userData={user}
        />


      </div>


      <NavbarBottom />
    </>
  );
};

export default HomePage;

