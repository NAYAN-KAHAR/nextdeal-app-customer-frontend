'use client';
import { IoIosArrowRoundBack } from "react-icons/io";
import { HiLocationMarker } from "react-icons/hi";
import {  FaAngleRight, FaMoneyBillWave, FaRegCreditCard } from "react-icons/fa";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import { RxCross2 } from "react-icons/rx";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Loader from "../components/loader";
// import { GoogleMap, Marker, useJsApiLoader,OverlayView,Autocomplete } from "@react-google-maps/api";


import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, Marker, useJsApiLoader,OverlayView } from "@react-google-maps/api";
import { FiSearch } from 'react-icons/fi';
import { FaLocationArrow } from "react-icons/fa6";
import { load } from "@cashfreepayments/cashfree-js";

const libraries = ["places"];


const CheckoutPage = () => {

  const router = useRouter();
  const [orderData, setOrderData] = useState([]);
  const [resName, setResName] = useState('');
  const [isAddressClick, setIsAddressClick] = useState(false);
  const [loc, setLoc] = useState();
  const [isLocation, setIsLocation] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [addressFormat, setAddressFormat] = useState();
  const [error, setError] = useState('');


  const [paymentType, setPaymentType] = useState("online"); 
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [restaurantDetails, setRestaurantDetails] = useState();
  const [locationDetails, setLocationDetails] = useState();
  const [billDetails, setBillDetails] = useState();
  const [tips, setTips] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [cfLoaded, setCfLoaded] = useState(false);


 const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    version: "beta", // 👈 REQUIRED for new Place API
 });


 // getch process to carts food items
const checkoutGetFoodData = async () => {
  try {
      const res = await axios.get(`${apiUrl}/api/get-checkout-data-customer`, {
        withCredentials: true,
      });
      console.log('carts-data =>',res.data.checkoutData);
      setOrderId(res.data.checkoutData._id);
      setRestaurantDetails(res.data.checkoutData.restaurantId);
      setLocationDetails(res.data.checkoutData.deliveryAddress);
      setTips(res.data.checkoutData.tip);
      setBillDetails(res.data?.checkoutData?.pricing)
      console.log(restaurantDetails);
      
  } catch (err) {
    console.log(err);
  }
};


useEffect(() => {
  checkoutGetFoodData();
}, []);



// You use the place_id with PlacesService.getDetails() to fetch the full details
const handleSelectLocation = async (place) => {
  if (!place) return setLoc(null);

  const placeId = place.value.place_id;

  try {
    // --- STEP 1: Try new API first ---
    let details = null;
    if (google.maps.places.Place) {
      try {
        const gPlace = new google.maps.places.Place({ id: placeId });
        details = await gPlace.fetchFields({
          fields: [
            "id",
            "displayName",
            "formattedAddress",
            "location",
            "addressComponents",
            "plusCode",
            "types",
          ],
        });
      } catch (err) {
        console.warn("⚠️ New API fetchFields() failed, will fall back:", err);
      }
    }

    // --- STEP 2: Fallback to legacy PlacesService.getDetails() ---
    if (!details || !details.formattedAddress) {
      const service = new google.maps.places.PlacesService(document.createElement("div"));
      details = await new Promise((resolve, reject) => {
        service.getDetails({ placeId }, (res, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) resolve(res);
          else reject(status);
        });
      });
    }

    // --- STEP 3: Normalize field differences between new & old APIs ---
    const get = (type) => {
      const comps = details.addressComponents || details.address_components || [];
      const key = comps.find((c) => c.types.includes(type));
      return (
        key?.longText ||
        key?.long_name ||
        key?.shortText ||
        key?.short_name ||
        ""
      );
    };

    const structuredData = {
      place_id: details.id || details.place_id || placeId,
      name:
        details.displayName?.text ||
        details.displayName ||
        details.name ||
        "",
      plot_number: get("street_number"),
      building: get("premise") || get("subpremise"),
      floor: "",
      street: get("route"),
      area: get("sublocality_level_1") || get("neighborhood"),
      city: get("locality") || get("administrative_area_level_2"),
      state: get("administrative_area_level_1"),
      country: get("country"),
      postal_code: get("postal_code"),
      plus_code:
        details.plusCode?.globalCode ||
        details.plus_code?.global_code ||
        "",
      latitude:
        details.location?.lat?.() ||
        details.geometry?.location?.lat?.() ||
        null,
      longitude:
        details.location?.lng?.() ||
        details.geometry?.location?.lng?.() ||
        null,
      formatted_address:
        details.formattedAddress ||
        details.formatted_address ||
        "",
      types: details.types || [],
      delivery_radius_km: 5,
    };

    // --- STEP 4: Update state ---
    setLoc({
      label: structuredData.formatted_address,
      value: {
        lat: structuredData.latitude,
        lng: structuredData.longitude,
      },
      ...structuredData,
    });

    setIsLocation(structuredData.formatted_address);
    console.log("Structured Location:", structuredData);
    setAddressFormat(structuredData);
    
  } catch (error) {
    console.error("Error handling place:", error);
  }
};



// get current location using mobile location
const handleMapByLocationBtn = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  try {
    // 1️⃣ Get current position
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude: lat, longitude: lng } = position.coords;

    // 2️⃣ Reverse geocode using Google Maps API
    const geocoder = new google.maps.Geocoder();
    const results = await new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (res, status) => {
        if (status === "OK" && res[0]) resolve(res);
        else reject(status);
      });
    });

    const place = results[0];
    const comp = place.address_components || [];
    const get = (type) => comp.find((c) => c.types.includes(type))?.long_name || "";

    // 3️⃣ Try to get place details for better data (if place_id exists)
    let details = null;
    if (place.place_id) {
      const service = new google.maps.places.PlacesService(document.createElement("div"));
      details = await new Promise((resolve) => {
        service.getDetails({ placeId: place.place_id }, (res, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) resolve(res);
          else resolve(null);
        });
      });
    }
// Extractor helper
const getComp = (type) => details.address_components.find((c) => c.types.includes(type))?.long_name || "";

  //  Build Swiggy-like structured data
      const structuredData = {
        place_id: details.place_id || "",
        name: details.name || "",                             
        plot_number: getComp("street_number") || "",            
        building: getComp("premise") || getComp("subpremise") || "",  
        floor: "",                                   
        street: getComp("route") || "",     
        area: getComp("sublocality_level_1") || getComp("neighborhood") || "", 
        city: getComp("locality") || getComp("administrative_area_level_2") || "",
        state: getComp("administrative_area_level_1") || "",
        country: getComp("country") || "",
        postal_code: getComp("postal_code") || "",
        plus_code: details.plus_code?.global_code || "",
        latitude: lat,
        longitude: lng,
        types: details.types || [],
        formatted_address: details.formatted_address || "",
        delivery_radius_km: 5,
      };

    console.log("Current Location Structured Data:", structuredData);

    

    // Update UI / State
    const formatted = details?.formatted_address || place.formatted_address;
    setLoc({ label: formatted, value: { lat, lng }, ...structuredData });
    setIsLocation(structuredData.formatted_address);
    // setFormData((prev) => ({ ...prev, isLocation: formatted, ...structuredData }));

  } catch (error) {
    console.error("Error location:", error);

  }
};


// confirm this is my location 
const handleIsMylocBtn = async () => {
  try{
    // setIsLocation(false);
    // if(finalStructuredData){
    //    const res = await axios.post(`${apiUrl}/api/restuarents/add-location`,
    //                         finalStructuredData, { withCredentials: true });
      const { latitude, longitude } = addressFormat;
      const res = await axios.post(`${apiUrl}/api/customer-restaurants-distance`,
        {latitude, longitude, restuarantId:resName._id}, {withCredentials:true},
      );
       console.log(res.data);
       console.log('clicked');
       setIsAddressClick(false);

      const data = res.data;

      setDeliveryFee(data.deliveryFee);
      setTotalPrice(prev => prev + data.deliveryFee);
      console.log(totalPrice);

    } catch (err) {
     console.error("Backend error:", err);
  }

}

// taking food order logic  
// const hanldePayBtn = async (totalPrice) => {

//   if(!totalPrice || !orderId) return;
//   if (paymentType ==='COD') return alert('COD not valid right now');

//   try{
//     console.log('total', totalPrice);
//      const res =  await axios.post(`${apiUrl}/api/customer-order-payment`,
//       {totalPrice, orderId},  {withCredentials:true},);
      
//     //    console.log(res.data);
       
//        Swal.fire({
//             title: 'Done!',
//             text: 'Successfully Placed Order',
//             icon: 'success',
//             confirmButtonText: 'Ok'
//           });
//   }catch(err){
//     console.log(err);
//     if(err?.response?.data) {
//     //   setError(err.response?.data?.error);
//     }
    
//   }
// }

const hanldePayBtn = async (totalPrice) => {
  try {
    if (!totalPrice || !orderId) return alert("Invalid order");

    // const res = await axios.post(
    //   `${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/api/customer-order-payment`,
    //   { totalPrice, orderId },
    //   { withCredentials: true }
    // );

    // const { paymentSessionId } = res.data;
    // if (!paymentSessionId) return alert("Failed to get payment session");

    // // Load Cashfree SDK and trigger checkout
    // const cashfree = await load({ mode: "sandbox" }); // 'prod' for production
    // cashfree.checkout({
    //   paymentSessionId,
    //   redirectTarget: "_self", // or "_blank" if you want a new tab
    // });

     Swal.fire({
             title: 'Done!',
            text: 'Successfully Placed Order',
            icon: 'success',
             confirmButtonText: 'Ok'
          });

  } catch (err) {
    console.error("Payment initiation failed:", err);
    alert("Payment initiation failed");
  }
};


if (!isLoaded) {
  return <div className="h-screen w-full flex justify-center items-center"><Loader /></div>;
}


  return (
    <>
    <div className="h-full w-full bg-gray-100">

      {/* TOP HEADER */}
      <div className="p-2 flex items-center gap-4 bg-white shadow sticky top-0 z-50">
       <Link href={'/Restaurents'}> 
        <IoIosArrowRoundBack size={42} className="cursor-pointer text-gray-900" />
       </Link>

        <h1 className="text-gray-900 font-bold text-xl tracking-wide">Checkout</h1>
      </div>


    {/* RESTAURANT DETAILS */}
    <div className="p-2">
        <div className="bg-white w-full shadow-sm rounded-xl p-2 mb-4 flex items-center gap-5 mt-2">
    <img src="https://images.unsplash.com/photo-1682778418768-16081e4470a1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"
        className="w-16 h-16 rounded-lg object-cover"
        alt="Restaurant" />

  
    <div className="flex-1">
        <h1 className="font-bold text-lg text-gray-900 capitalize">
            {restaurantDetails && restaurantDetails.business_name}</h1>
        <p className="text-gray-500 text-sm">
        Burgers • Fast Food • Beverages
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
        <span className="font-medium text-green-600">⭐ 4.3</span>
        <span>•</span>
        <span>30 mins</span>
        <span>•</span>
        {/* <span>2 km away</span> */}
        </div>
    </div>

    </div>
    </div>


      <div className="max-w-3xl mx-auto p-2 pb-28">

        {/* ADDRESS CARD */}
        <div className="bg-white w-full shadow-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <HiLocationMarker size={23} className="text-orange-500" />
              Delivering To
            </h1>
            <button className="text-orange-500 font-medium text-sm
            cursor-pointer">EDIT</button>
          </div>

          <p className="mt-2 text-gray-700 flex items-center gap-2">
              <span>{locationDetails && locationDetails.street}</span>
              <span>{locationDetails && locationDetails.name}</span>,
              <span>{locationDetails && locationDetails.city}</span>
         </p>

          {/* Map */}
        

            <div className="w-full h-40 rounded-lg mt-3 overflow-hidden">
    {locationDetails?.coordinates ? (

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={locationDetails.coordinates}
            zoom={16}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker position={locationDetails.coordinates} title="Delivery Location" />
          </GoogleMap>
        ) : (
      <div className="w-full h-full bg-gray-300 flex items-center justify-center">No location</div>
    )}
  </div>

        </div>


        {/* DELIVERY TIME */}
        <div className="bg-white w-full shadow-sm rounded-xl p-4 mt-4">
          <h1 className="font-semibold">Delivery in 30 mins</h1>
          <p className="text-gray-500 text-sm">Based on current traffic & restaurant
             preparation time</p>
        </div> 

        

        {/* TIP SECTION */}
        <div className="bg-white w-full shadow-sm rounded-xl p-4 mt-4 ">
          <h1 className="font-semibold mb-2">Tip Your Delivery Partner</h1>

          <div className="flex gap-2  overflow-x-auto scroll-hide ">
            {[20, 30, 50, 80, 100,150,200].map((tip) => (
              <button key={tip} className={`px-3 py-1 rounded-lg border text-gray-700 shadow-sm
                 hover:bg-gray-100 transition ${tips === tip ? 'border-orange-600 text-orange-600':''}`}  >
                ₹{tip}
              </button>
            ))}
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-white w-full shadow-sm rounded-xl p-4 mt-4">
          <h1 className="text-lg font-bold mb-3">Payment Method</h1>

          {/* Online */}
          <div className={`flex items-center justify-between py-3 cursor-pointer

            ${paymentType === 'online'?'border-2 border-orange-500 rounded-2xl' : ''}`}
          onClick={() => setPaymentType('online')}>

            <div className="flex items-center gap-3 p-1">
              <FaRegCreditCard className="text-purple-600" size={28} />
              <span className="font-medium">UPI / Card / Netbanking</span>
            </div>
            <FaAngleRight size={20} className="text-gray-400" />
          </div>

          {/* COD */}
          <div className={`flex items-center justify-between py-3 cursor-pointer
            ${paymentType === 'COD'?'border-2 border-orange-500 rounded-2xl' : ''}`}
           onClick={() => setPaymentType('COD')}>
            <div className="flex items-center gap-3 p-1">
              <FaMoneyBillWave className="text-green-600" size={30} />
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <FaAngleRight size={20} className="text-gray-400" />
          </div>
        </div>
        

        {/* ORDER BREAKUP */}
        <div className="bg-white w-full shadow-sm rounded-xl p-4 mt-4">
          <h1 className="text-lg font-bold mb-4">Bill Details</h1>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{billDetails && billDetails.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tips Amount</span>
              <span>₹{tips && tips}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{billDetails && billDetails.deliveryFee}</span>
            </div>
            
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-base font-semibold">
            <span>To Pay</span>
            <span>₹{billDetails && billDetails.total}</span>
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-xl border-t">
        <button className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg 
        font-semibold hover:bg-orange-600 transition cursor-pointer" 
        onClick={() => hanldePayBtn(billDetails.total)}> 
          Place Order • ₹{billDetails && billDetails.total}
        </button>
      </div>
    </div>

    </>
  );
};


export default CheckoutPage;
