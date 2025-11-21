'use client';
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { TiMinus } from "react-icons/ti";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
// import { GoogleMap, Marker, useJsApiLoader,OverlayView,Autocomplete } from "@react-google-maps/api";


import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, Marker, useJsApiLoader,OverlayView } from "@react-google-maps/api";

import { FiSearch } from 'react-icons/fi';
import { FaLocationArrow } from "react-icons/fa6";

const libraries = ["places"];

const ViewCardItem = ({ isViewClick, setIsViewClick }) => {
  const [orderData, setOrderData] = useState([]);
  const [resName, setResName] = useState('');
  const [isAddressClick, setIsAddressClick] = useState(false);
  const [loc, setLoc] = useState();
  const [isLocation, setIsLocation] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const  [addressFormat, setAddressFormat] = useState();

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  libraries,
  version: "beta", // 👈 REQUIRED for new Place API
});



// Fetch all items
useEffect(() => {
    const fetchViewCardOrder = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/get-all-view-card-orders`, {
          withCredentials: true,
        });
        console.log(res.data);
        setOrderData(res.data.foodItems || []);
        if (res.data.foodItems?.length > 0) {
          setResName(res.data.foodItems[0].restuarantId.business_name);
        };
     

      } catch (err) {
        console.log(err);
      }
    };

    fetchViewCardOrder();
  }, []);


// calculate toatl price for place order
useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      orderData.forEach((item) => {
        const food = item.FoodSubCategory;
        const priceAfterDiscount = food.price  - food.Discount ;
        total += priceAfterDiscount * item.count;
      });
      setTotalPrice(total);
    };

    calculateTotal();
  }, [orderData]); // Runs every time orderData changes


const handleIncrease = async (foodId) => {
  try {
    // Update UI instantly
    setOrderData((prev) =>
      prev.map((item) =>
        item.FoodSubCategory._id === foodId
          ? { ...item, count: item.count + 1 }
          : item
      )
    );

    // Find updated count
    const updatedItem = orderData.find((item) => item.FoodSubCategory._id === foodId);
    const newCount = (updatedItem?.count || 0) + 1;

    // ✅ Send correctly structured data
    await axios.post(`${apiUrl}/api/add-food-item-view-cards`,
      { [foodId]: { count: newCount } },  { withCredentials: true });
    } catch (err) {
    console.log("Error increasing:", err);
  }
};


const handleDecrease = async (foodId) => {
  try {
    setOrderData((prev) =>
      prev.map((item) =>
          item.FoodSubCategory._id === foodId
            ? { ...item, count: Math.max(0, item.count - 1) }
            : item
        )
        .filter((item) => item.count > 0)
    );

    const updatedItem = orderData.find((item) => item.FoodSubCategory._id === foodId);
    
    const newCount = Math.max((updatedItem?.count || 1) - 1, 0);
    console.log('newCount', newCount);

    await axios.post(`${apiUrl}/api/add-food-item-view-cards`,
      { [foodId]: { count: newCount } }, { withCredentials: true });

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
    console.log("📍 Structured Location (hybrid):", structuredData);
    setAddressFormat(structuredData);
    
  } catch (error) {
    console.error("❌ Error handling place:", error);
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



const handleIsMylocBtn = async () => {
  try{
    // setIsLocation(false);
    // if(finalStructuredData){
    //    const res = await axios.post(`${apiUrl}/api/restuarents/add-location`,
    //                         finalStructuredData, { withCredentials: true });

       console.log('clicked');
       setIsAddressClick(false);
    } catch (err) {
     console.error("❌ Backend error:", err);
  }

}

const handlePlaceOrder = async () => {
  try{
    console.log('total', totalPrice);
     const res =  await axios.post(`${apiUrl}/api/customer-place-order`,
       {orderData , addressFormat},  {withCredentials:true},);
      
       console.log(res.data);
       
   
  }catch(err){
    console.log(err);
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

         <h1 className="text-gray-800 font-bold uppercase"> {resName || 'Restaurant'}</h1>
      </div>

<div className="max-w-4xl mx-auto flex flex-col h-full mt-4">

  {/* Scrollable order list */}

  <div className="flex-1 overflow-y-auto no-scrollbar  p-3 pb-60">
    {orderData.length === 0 ? (
      <div className="text-center py-32 text-gray-400 font-medium text-lg">
        🛒 Your cart is empty
      </div>
    ) : (
      <div>
        {orderData.map((v, i) => {
          const food = v.FoodSubCategory;
          const priceAfterDiscount = food.price - food.Discount;

          return (
            <div  key={i} className="flex bg-white shadow-md border-b
             border-gray-200 overflow-hidden mb-3 rounded-xl"  >
              <div className="flex-shrink-0">
                <img  src={food.image} alt={food.name}  className="w-24 h-24 object-cover rounded-l-xl"   />
              </div>

              <div className="flex flex-col justify-between flex-1 p-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-gray-800 font-bold text-lg">{food.name}</h2>
                    <p className="text-gray-500 mt-1 text-sm">
                      {food.foodType} {food.Discount > 0 && `• ${food.Discount}% off`}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-900 font-bold text-lg">
                      ₹{(priceAfterDiscount * v.count).toFixed(1)}
                    </p>
                    {food.Discount > 0 && (
                      <p className="text-gray-400 text-sm line-through">
                        ₹{(food.price * v.count).toFixed(2)}
                        
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <div className="flex items-center border border-gray-300 rounded-2xl
                   overflow-hidden px-2 py-0.5">
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
              </div>
            </div>
          );
        })}
      </div>

      
    )}

    {orderData.length !== 0 && !isLocation ? '':
    ( <div  className="flex bg-white shadow-md border-b p-4 flex-col mt-8
             border-gray-200 overflow-hidden mb-3 rounded-xl w-full"  >
          <div className="flex justify-between items-center text-lg font-bold w-full">
            <h1>Total</h1>
            <h1>₹{totalPrice.toFixed(2)}</h1> {/* Display the total */}
          </div>

          <div className="flex justify-between items-center w-full mt-2">
            <button className="bg-gray-100 text-black rounded py-1.5 px-2
            text-sm border border-gray-300 cursor-pointer" 
            >
              Add Items</button>
             <button className="bg-gray-100 text-black rounded-lg px-2
              py-1.5 text-sm border border-gray-300 cursor-pointer">Revome Item</button>
          </div>

          <button className="mt-6 px-4 py-2.5 bg-green-700 text-white font-semibold rounded-2xl
          cursor-pointer w-full" onClick={handlePlaceOrder}> Place Order

          </button>

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
    onClick={handleMapByLocationBtn}
    >
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






  {/* ended customer address  */}
    </>
  );
};

export default ViewCardItem;
