'use client';
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { TiMinus } from "react-icons/ti";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import { BsDoorOpen } from "react-icons/bs";
import { FaRegBellSlash } from "react-icons/fa";
import { HiOutlinePhoneMissedCall } from "react-icons/hi";

// import { GoogleMap, Marker, useJsApiLoader,OverlayView,Autocomplete } from "@react-google-maps/api";


import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, Marker, useJsApiLoader,OverlayView } from "@react-google-maps/api";

import { FiSearch } from 'react-icons/fi';
import { FaLocationArrow } from "react-icons/fa6";

const libraries = ["places"];


const instructionOptions = [
  {label: "Leave at the door", icon:<BsDoorOpen /> },
  {label: "Avoid ringing bell", icon:<FaRegBellSlash /> },
  {label: "Call on arrival", icon:<FaRegBellSlash />  },
  {label: "Make it less spicy",  icon:<FaRegBellSlash /> },
  {label: "Add extra napkins", icon:<FaRegBellSlash />  },
  {label: "Add custom instructions", icon:<FaRegBellSlash />  }
];


const tipOptions = [
  { amount: 10 },
  { amount: 20},
  { amount: 30},
  { amount: 50 },
  { amount: 80},
  { amount: 100},

];


const ViewCardItem = ({ isViewClick, setIsViewClick }) => {

  const router = useRouter();

  const [orderData, setOrderData] = useState([]);
  const [resName, setResName] = useState('');
  const [isAddressClick, setIsAddressClick] = useState(false);
  const [loc, setLoc] = useState();
  const [isLocation, setIsLocation] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [addressFormat, setAddressFormat] = useState();
  const [error, setError] = useState('');
  const [selectVegType, setSelectVegType] = useState('');

  const [deliveryType, setDeliveryType] = useState("Delivery Partner"); 
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [recommdationFoods, setRecommdationFoods] = useState([]);
  const [addOnFoods, setAddOnFoods] = useState([]);

  const [id, setId] = useState('');
  const [isTip, setIsTip] = useState(false);

  const [tips, setTips] = useState(0);
  const [instructions, setInstructions] = useState();

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  libraries,
  version: "beta", // 👈 REQUIRED for new Place API
});


const fetchViewCardOrder = async () => {
  try {
      const res = await axios.get(`${apiUrl}/api/get-all-view-card-orders`, {
        withCredentials: true,
      });
      console.log('carts-data =>',res.data);
      const foodItems = res.data.foodItems || [];
      setOrderData(foodItems);
      setRecommdationFoods(res.data.recommdationFoods || []);
      setAddOnFoods(res.data.addOns);
      setResName(res.data.restuarant);
      if (foodItems.length > 0) {
        const restaurantId = foodItems[0].restuarantId;
        setId(restaurantId);
        
        
      // Fetch add-ons immediately
      // const addOnRes = await axios.get(
      //   `${apiUrl}/api/customer-gets-all-addOn-items/${restaurantId}`,
      //   { withCredentials: true }
      // );
      // console.log("addOn data", addOnRes.data);
      // setAddOnFoods(addOnRes.data.addOnsData);
      // // setAddOnFoods(addOnRes.data)
    }
  } catch (err) {
    console.log(err);
  }
};


useEffect(() => {
  fetchViewCardOrder();
}, []);



  // Calculate total whenever orderData or tips change
  // useEffect(() => {
  //   let total = 0;

  //   orderData.forEach((item) => {
  //     const food = item.FoodSubCategory || item.addOn;
  //     if (!food) return;

  //     const priceAfterDiscount = (food.price || 0) - (food.Discount || 0);
  //     total += priceAfterDiscount * (item.count || 1);
  //   });

  //   total += tips; // add tip
  //   setTotalPrice(total);
  // }, [orderData, tips]);


    // Calculate total whenever orderData or selectedTip changes
  useEffect(() => {
    let total = 0;

    orderData.forEach((item) => {
      const food = item.FoodSubCategory || item.addOn;
      if (!food) return;

      const priceAfterDiscount = (food.price || 0) - (food.Discount || 0);
      total += priceAfterDiscount * (item.count || 1);
    });

    total += tips; // add selected tip
    setTotalPrice(total);
  }, [orderData, tips]);


  // Handle tip click
  const handleTipClick = (amount) => {
    if (tips === amount) {
      setTips(0);
    } else {
      setTips(amount);
    }
  };


// handle increase button of food items
const handleIncrease = async (itemId) => {
  try {
    setOrderData((prev) =>
      prev.map((item) => {
        const id = item.FoodSubCategory?._id || item.addOnId;
        if (id === itemId) {
          return { ...item, count: (item.count || 0) + 1 };
        }
        return item;
      })
    );

    // Find updated count
    const updatedItem = orderData.find(
      (item) => (item.FoodSubCategory?._id || item.addOnId) === itemId
    );
    const newCount = (updatedItem?.count || 0) + 1;

    await axios.post(
      `${apiUrl}/api/add-food-item-view-cards`,
      { [itemId]: { count: newCount } },
      { withCredentials: true }
    );
  } catch (err) {
    console.log("Error increasing:", err);
  }
};


const handleDecrease = async (itemId) => {
  try {
    setOrderData((prev) =>
      prev
        .map((item) => {
          const id = item.FoodSubCategory?._id || item.addOnId;
          if (id === itemId) {
            return { ...item, count: Math.max((item.count || 1) - 1, 0) };
          }
          return item;
        })
        .filter((item) => item.count > 0)
    );

    const updatedItem = orderData.find(
      (item) => (item.FoodSubCategory?._id || item.addOnId) === itemId
    );
    const newCount = Math.max((updatedItem?.count || 1) - 1, 0);

    await axios.post(
      `${apiUrl}/api/add-food-item-view-cards`,
      { [itemId]: { count: newCount } },
      { withCredentials: true }
    );

    fetchViewCardOrder();

  } catch (err) {
    console.log("Error decreasing:", err);
  }
};



const handleACustomerAddress = () => {
  console.log('clicked');
  setIsAddressClick(true);
};


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
     setError(err.response?.data?.error);
  }

}

// taking food order logic  
const handlePlaceOrder = async () => {
  try{
    console.log('total', totalPrice);
     const res =  await axios.post(`${apiUrl}/api/customer-place-order`,
       {orderData , addressFormat, deliveryType, tips, instructions, deliveryFee},  {withCredentials:true},);
      
       console.log(res.data);
      //  Swal.fire({
      //       title: 'Done!',
      //       text: 'Successfully Placed Order',
      //       icon: 'success',
      //       confirmButtonText: 'Ok'
      //     });
      setTimeout(() => router.push('/checkoutPage'));
  }catch(err){
    console.log(err);
    if(err.response.data) {
      setError(err.response?.data?.error);
    }
    
  }
}


// hanlde more add food items
const handleAddItems = () => {
  console.log('Clicked');
  router.push(`/DetilsRestaurant?id=${resName._id}&selectVegType=${selectVegType}`);
  setTimeout(() => setIsViewClick(false), 200);

}


// Handle remove all foods from carts
const handleRemoveItems = async () => {
  try{
    console.log('clicked');
    const res = await axios.delete(`${apiUrl}/api/customer-food-items-delete`,
      {withCredentials:true}
    );
    console.log(res.data);
    Swal.fire({
            title: 'Done!',
            text: 'Successfully Remove carts',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
    if (res.data) return setTimeout(() => setIsViewClick(false), 200);
  }catch(err){
    console.log(err);
  }
}


// Added Recommadation Foods Item to carts 
const handleAddRecommdation = async (food) => {
  if(!food) return console.log('food is required');
   console.log(food)

  try{
   
    // const { _id, name, price } = food;
    // const newItem = { [_id]: {  name, price, count: 1 } };

     const { _id } = food;
    // Backend requires: { foodId: { count: 1 } }
    const newItem = { [_id]: { count: 1 } };

    console.log("recommendationItem =>", newItem);
    const res = await axios.post( `${apiUrl}/api/add-food-item-view-cards`,
                            newItem,{ withCredentials: true } );

    console.log("Added Recommendation:", res.data);
    fetchViewCardOrder();
  }catch(err){
    console.log(err)
  }

}

if (!isLoaded) {
  // Optional: you can return a loader or a placeholder
  return <p>Loading Google Maps...</p>;
}


  return (
    <>
      {/* Overlay */}
      {isViewClick && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity 
        duration-300" onClick={() => setIsViewClick(false)}  /> )}


     <div  className={`fixed bottom-0 left-0 w-full h-[100%] bg-[#F1F0F5] z-[1000]
        transform transition-transform duration-500 ease-in-out
        ${isViewClick ? 'translate-y-0' : 'translate-y-full'}`} >

 
      <div className="p-1 flex items-center gap-2 pb-1.5 pt-1 bg-white shadow">
          <IoIosArrowRoundBack  size={42} className="cursor-pointer text-gray-600"
            onClick={() => setIsViewClick(false)} />

         <h1 className="text-gray-800 font-bold uppercase">
           {resName?.business_name || 'Restaurant'}
           </h1>
      </div>

<div className="max-w-4xl mx-auto flex flex-col h-full mt-4">

  {/* Scrollable order list */}

  <div className="flex-1 overflow-y-auto no-scrollbar p-2 pb-60">
    {orderData.length === 0 ? (
      <div className="text-center py-32 text-gray-400 font-medium text-lg">
        🛒 Your cart is empty
      </div>
    ) : (
      <div>
        {orderData.map((v, i) => {
          const food = v.FoodSubCategory || v.addOn; 
          const priceAfterDiscount = food?.price - (food?.Discount || 0);

          return (
            <div  key={i} className="flex bg-white  border-b
             border-gray-200 overflow-hidden rounded-xl"  >
              <div className="flex-shrink-0">
                <img  src={food.image} alt={food.name}  className="w-15 h-15 object-cover rounded-l-xl"   />
              </div>

              <div className="flex flex-col justify-between flex-1 px-2.5 pt-1 pb-2 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-gray-800 font-bold text-lg">{food.name}</h2>
                    <p className="text-gray-500 mt-1 text-sm">
                      {food.foodType} 
                      {/* {food.Discount > 0 && `• ${food.Discount}% off`} */}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-900 font-bold ">
                      ₹{(priceAfterDiscount * v.count).toFixed(1)}
                    </p>
                    {/* {food.Discount > 0 && (
                      <p className="text-gray-400 text-sm line-through">
                        ₹{(food.price * v.count).toFixed(2)}
                        
                      </p>
                    )} */}
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="flex items-center border border-gray-300 rounded-2xl
                   overflow-hidden  ">
                    <button className="text-green-700 font-bold text-lg px-2 rounded-full"
                      onClick={() => handleDecrease(food._id)}   >
                      <TiMinus />
                    </button>

                   <input type="tel" value={v.count} readOnly
                      className="w-8 text-center outline-none text-green-700 
                      font-semibold bg-transparent" />

                    <button className="text-green-700 font-bold text-lg px-2 hover:bg-gray-100 rounded-full"
                      onClick={() => handleIncrease(food._id)}  >
                      <GoPlus />
                    </button>
                  </div>
                </div>

                 {/* Quantity / Add Button */}
            {/* <div className="flex items-center space-x-2">
              <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold hover:bg-gray-300">
                -
              </button>
              <span className="text-gray-800 font-medium">1</span>
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-green-600">
                +
              </button>
            </div> */}
            
              </div>
            </div>
          );
        })}
      </div>

      
    )}


{/*  recommdation cards */}
   {recommdationFoods.length <= 0 ? '' : (
<div className="overflow-x-auto py-1.5 bg-white p-2 mt-2">
  <h1 className="text-start font-bold text-xl mb-2 text-gray-700"> Recommadations</h1>
  <div className="flex space-x-4">
    {recommdationFoods.map((food) => (
      <div  key={food._id} className="relative flex-shrink-0 w-16 bg-white rounded  overflow-hidden" >

        <div className="relative">
          <img  src={food.image} alt={food.name} className="w-full h-15 object-cover rounded"/>

          <button onClick={() => handleAddRecommdation(food)}  className="absolute top-0 right-0 w-10 h-5 bg-green-500
           rounded flex items-center justify-center text-white text-lg shadow-md cursor-pointer">
            +
          </button>
        </div>

        <div className="mt-2 flex flex-col items-start justify-start text-start">
          <h3 className="text-gray-800  text-xs font-bold truncate">
            {food.name}
          </h3>
          <p className="text-gray-900 font-bold text-sm mt-1">₹{food.price}</p>
        </div>
      </div>
    ))}
  </div>
</div>
   )}

{/* recommdation cards */}





{/*   add -Ons cards cards */}
{addOnFoods.length <= 0 ? '' : (
<div className="overflow-x-auto py-1.5 bg-white p-2 mt-2">
  <h1 className="text-start font-bold text-xl mb-2 text-gray-700"> Add-Onces</h1>

  <div className="flex space-x-4">
    {addOnFoods.map((food, j) => (
      <div key={j} className="relative flex-shrink-0 w-16 bg-white rounded  overflow-hidden">

        <div className="relative">
          <img  src={food.image} alt={food.name} className="w-full h-13 object-cover 
          rounded border border-gray-200"/>

          
          <button onClick={() => handleAddRecommdation(food)} className="absolute top-0 right-0 w-10 h-5 bg-green-500
           rounded flex items-center justify-center text-white text-lg shadow-md cursor-pointer">
            +
          </button>
        </div>

      
        <div className="mt-2 flex flex-col items-start justify-start text-start">
          <h3 className="text-gray-800  text-xs font-bold truncate">
            {food.name}
          </h3>
          <p className="text-gray-900 font-bold text-sm mt-1">₹{food.price}</p>
        </div>
      </div>
    ))}
  </div>
</div>
)}

{/* ended add -Ons cards */}





{/* place order carts */}

    {/* { orderData.length !== 0 && isLocation && */}
     { orderData.length !== 0 && 
    ( <div  className="flex bg-white shadow-md border-b p-4 flex-col mt-8
             border-gray-200 overflow-hidden mb-3 rounded-xl w-full"  >
          <div className="flex justify-between items-center text-lg font-bold w-full">
            <h1>Total</h1>
            <h1>₹{totalPrice.toFixed(2)}</h1> {/* Display the total */}
          </div>

          <div className="flex justify-between items-center w-full mt-2">

         <button  onClick={handleAddItems} className="bg-gray-100 text-black rounded py-1.5 px-2
            text-sm border border-gray-300 cursor-pointer"  >
              Add Items</button>

             <button onClick={handleRemoveItems} className="bg-gray-100 text-black rounded-lg px-2
              py-1.5 text-sm border border-gray-300 cursor-pointer">Revome Items</button>
          </div>



      <div className="flex justify-between items-center w-full mt-2">
            <h1 className="text-sm font-bold text-gray-900">Delivery Type</h1>
      
          </div>

       <div className="flex justify-between items-center w-full mt-2">

          {/* Self Pickup */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input  type="checkbox"  checked={deliveryType ==='Self Pickup'}
              onChange={() => {
                setDeliveryType('Self Pickup'); 
                 setTotalPrice(prev => prev - deliveryFee);
              }}
              className="h-4 w-4 rounded border-gray-300 accent-orange-600"
            />
            <span className="text-sm text-gray-700">Self Pickup</span>
          </label>

          {/* Delivery Partner */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={deliveryType==='Delivery Partner'}
              onChange={() => { setDeliveryType('Delivery Partner');  
                setTotalPrice(prev => prev + deliveryFee);}}
              className="h-4 w-4 rounded border-gray-300 accent-orange-600"
            />
            <span className="text-sm text-gray-700">Delivery Partner</span>
          </label>

      </div>

        {deliveryType==='Delivery Partner' && (
          <div className="flex justify-between items-center w-full mt-3 bg-gray-200 
          rounded-2xl">
          
              <div onClick={() => setIsTip(true)} className={`p-1.5 cursor-pointer px-4 rounded-2xl 
              ${isTip ? 'bg-black text-white':' text-black'}`}>
                <h1 className="font-medium">Tip</h1>
              </div>

              <div onClick={() => setIsTip(false)} className={`p-1.5 cursor-pointer px-4 rounded-2xl 
              ${isTip ? ' text-black':'bg-black text-white'}`}>
                <h1 className="font-medium">Instructions</h1>
              </div>

          </div>
        )}

        {deliveryType==='Delivery Partner' && isTip ? (
         <>
         <p className="text-sm mt-0.5 mb-0.5">Lorem ipsum dolor sit amet consectetur 
          adipisicing elit. Hic, aperiam aperiam aperiam!</p>
      
          <div className="flex items-center gap-2 mt-3 overflow-x-auto scroll-hide w-full">
            
            {tipOptions.map((v, i) => (
            <div  key={i}
              className={`flex-shrink-0 p-2 rounded-lg border cursor-pointer px-4 transition
                ${tips === v.amount
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-300 text-gray-800 hover:shadow-sm"
                }`}
              onClick={() => handleTipClick(v.amount)} > ₹{v.amount}
          </div>
        ))}
          </div>
          </>
        ):(
          <div className="flex items-center gap-2 mt-3 overflow-x-auto scroll-hide w-full">
          {deliveryType==='Delivery Partner' && instructionOptions.map((v, i) => {
            return (
              <div key={i} className={`
                  p-2 px-4 rounded-lg border border-gray-300 cursor-pointer whitespace-nowrap
                  flex items-center gap-2
                  ${instructions === v.label ? 'bg-black text-white' : 'text-black'}`}
                  onClick={() => setInstructions(v.label)} >
                  {v.icon}
                <h1 className="text-sm">{v.label}</h1>
              </div>
            );
          })}
        </div>

        )}

        { orderData.length !== 0 && isLocation &&   <button className="mt-6 px-4 py-2.5
         bg-green-700 text-white font-semibold rounded-2xl
          cursor-pointer w-full" onClick={handlePlaceOrder}> Process to Order
          </button>  }

    </div>)
}

  </div>

  {/* Bottom Fixed Address Section */}


   


{/*  address button at buttom code here*/}
{isLocation && loc ? (
      <div className='bg-white shadow-2xl rounded-t-2xl fixed bottom-0 left-0 w-full 
        border border-gray-300'>
         <div className=' px-2 pb-2'>
             <div className='flex items-center justify-between px-2'>
              <h1 className='font-extrabold'>Choose location on map</h1>
              <img src="https://img.freepik.com/premium-vector/house-location-symbol-vector-illustration-home-delivery-service-concept-design_929545-241.jpg?semt=ais_hybrid&w=740&q=80"
             alt="logo"  className='object-cover' width={45} height={45}/>
             </div>
            <p className='flex items-center gap-3 '> 
              <FaLocationArrow size={28} className='text-orange-500 '/>
             <span className="text-[15px]">{isLocation || "Select a location"}</span>
            </p>

             <button className='font-bold bg-orange-600 text-white rounded-2xl px-5 py-2.5
             w-full mt-2 cursor-pointer'
             onClick={handleACustomerAddress} >Change my Address</button>
         </div>
      </div>
):(
   <div className=" p-4 bg-white shadow fixed bottom-0 left-0 w-full flex flex-col gap-3">
      <h1 className="text-lg font-extrabold text-gray-800">
        Where would you like us to deliver this order?
      </h1>
      <button  className="w-full bg-[#FE5200] rounded-2xl px-6 font-bold py-3 text-sm
      text-white cursor-pointer hover:opacity-90"  
      onClick={handleACustomerAddress}>
        Add or Select Address
      </button>
    </div>
)}

{/*  adddress button code ended here */}
</div>



      </div>


  {/* taking customer adrees / location */}



{isAddressClick && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-33 transition-opacity 
        duration-300" onClick={() => setIsAddressClick(false)}  /> )}


  <div  className={`fixed bottom-0 left-0 w-full h-[100%] bg-[#F1F0F5] z-[1001]
        transform transition-transform duration-500 ease-in-out
        ${isAddressClick ? 'translate-y-0' : 'translate-y-full'}`} >

 
      <div className="p-1 flex items-center gap-2 pt-1 bg-white shadow">
          <IoIosArrowRoundBack  size={42} className="cursor-pointer text-gray-600"
            onClick={() => setIsAddressClick(false)} />
      </div>

  <div className="p-2 relative w-full md:w-[500px]">

    <GooglePlacesAutocomplete apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      autoload={false}
        selectProps={{
          value: loc,
          onChange: handleSelectLocation,
          placeholder: "Search for location",
          isClearable: true,
          components: {DropdownIndicator: () => null},
          styles: {
            control: (provided) => ({
              ...provided,
              borderRadius: "1rem",
              border: "1px solid #d1d5db",
              minHeight: "3.5rem",
              paddingLeft: "2.5rem", 
              boxShadow: "none",
            }),
            singleValue: (provided) => ({ ...provided, color: "#111827" }),
            placeholder: (provided) => ({ ...provided, color: "#6b7280" }),
            input: (provided) => ({ ...provided, margin: 0, padding: 0 }),
          },
        }}
      />

    <FiSearch className="text-gray-600 absolute left-4 top-8.5  transform -translate-y-1/2" size={20} />

     </div>



  <div className='flex items-center gap-2 p-2 pb-2 border-b-2 border-gray-300 cursor-pointer'
    onClick={handleMapByLocationBtn} >
    <div className='w-10 h-10 rounded-full bg-orange-100 flex justify-center items-center'>
      <FaLocationArrow size={20} className='text-orange-500 '/>
    </div>
    <div className='flex justify-start items-start flex-col'>
      <p className='text-orange-700 text-sm font-bold'>Use my current location</p>
      <span className='text-xs text-gray-700'>It's same as the restaurant location</span>
    </div>
  </div>



<div className="flex justify-center mt-4">
  {loc && (
    <GoogleMap center={loc.value} zoom={18}
      mapContainerClassName="w-[100%] md:w-[500px] h-[500px] shadow-lg" >
      {/* Marker */}
      <Marker position={loc.value} />

      {/* Overlay text above the marker */}
      <OverlayView position={loc.value}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} >

        <div className="bg-red px-4 py-1.5 rounded-lg shadow-md font-semibold text-black text-center"
          style={{
            whiteSpace: "nowrap",      // prevent vertical wrap
            transform: "translate(-50%, -150%)", // center above marker
            maxWidth: "300px",          // limit max width if needed
          }}>
          Order will be delivered here
        </div>
      </OverlayView>
    </GoogleMap>
  )}
</div>


{isLocation && loc && (
      <div className='bg-white shadow-2xl rounded-t-2xl fixed bottom-0 left-0 w-full
       border  border-gray-300 '>
         <div className='px-2 pb-2'>
             <div className='flex items-center justify-between px-2'>
              <h1 className='font-extrabold'>Choose location on map</h1>
              <img src="https://img.freepik.com/premium-vector/house-location-symbol-vector-illustration-home-delivery-service-concept-design_929545-241.jpg?semt=ais_hybrid&w=740&q=80"
             alt="logo"  className='object-cover' width={45} height={45}/>
             </div>
            <p className='flex items-center gap-3 '> 
              <FaLocationArrow size={28} className='text-orange-500 '/>
             <span className="text-[15px]">{isLocation || "Select a location"}</span>
            </p>

             <button className='font-bold bg-orange-600 text-white rounded-2xl px-5 py-2.5 
             w-full mt-2 cursor-pointer'
             onClick={handleIsMylocBtn} >Yes, this is my Address</button>
         </div>
      </div>

)}





  </div>

{error && (
  <>
   <div  className="fixed inset-0 z-[1050] bg-black/50 backdrop-blur-sm transition-opacity
    duration-300" onClick={() => setError('')}  />

   
    <div className={` fixed top-1/2 left-1/2 z-[1100] w-80 max-w-[90%] bg-white rounded-3xl 
        shadow-2xl transform -translate-x-1/2 -translate-y-1/2
        transition-all duration-300 ease-in-out
        ${error ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}  `} >


      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-red-500 text-xl">⚠️</span>
          Error
        </h2>
        <RxCross2
          size={24}
          className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
          onClick={() => setError('')}
        />
      </div>


      <div className="px-6 py-5 text-center text-gray-800 text-sm">
        <p>
          <span className="font-semibold text-red-600">{error}</span>
        </p>
      </div>


      <div className="px-6 pb-6 flex justify-center">
        <button className="
            w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800
            text-white font-semibold py-2 rounded-2xl shadow-lg
            transition-colors duration-200 "
          onClick={() => {  setIsAddressClick(true);  setError(''); }} >
          {error === "Please provide address." ? 'Add Address' : 'Change Address'}
        </button>
      </div>
    </div>
  </>
)}





  {/* ended customer address  */}
    </>
  );
};

export default ViewCardItem;
