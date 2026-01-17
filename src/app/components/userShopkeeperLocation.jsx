'use client';
import { useState, useEffect, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaLocationArrow } from "react-icons/fa6";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, Marker, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;



const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "simplified" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { color: "#e6e6e6" },
      { lightness: 20 }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#555" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#777" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9e6ff" }]
  }
];




const LIBRARIES = ["places"]; // ✅ static array

const UserShopkeeperLocation = ({ locationSelect, setLocationSelect }) => {

  const [location, setLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    version: "beta",
  });

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMapEdit(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // Get user current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !results?.length) {
          console.error("Reverse Geocode Error:", status);
          return;
        }

        const components = results[0].address_components;
        const get = (type) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const parsed = {
          formatted: results[0].formatted_address,
          street: get("route"),
          area: get("sublocality_level_1"),
          subarea: get("sublocality_level_2"),
          city: get("locality") || get("administrative_area_level_3"),
          district: get("administrative_area_level_2"),
          state: get("administrative_area_level_1"),
          country: get("country"),
          pincode: get("postal_code"),
          lat,
          lng,
        };
        console.log("📍 Parsed Current Location →", parsed);
        setLocation({ label: parsed.formatted, value: { lat, lng }, details: parsed });
        setCurrentAddress(parsed.formatted);
      });
    },
      (err) => {
        console.error("Geolocation Error:", err);
        alert("Unable to fetch your location");
      }
    );
  };


  // Handle selection from Google Places Autocomplete
  const handleSelectLocation = (place) => {
    if (!place || !isLoaded || !window.google) return;

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      { placeId: place.value.place_id },
      (result, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error("Error:", status);
          return;
        }

        const components = result.address_components;

        // Helper to pick any component
        const get = (type) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const fullAddress = {
          formatted: result.formatted_address,
          street: get("route"),
          area: get("sublocality_level_1"),
          subarea: get("sublocality_level_2"),
          city: get("locality"),
          district: get("administrative_area_level_2"),
          state: get("administrative_area_level_1"),
          country: get("country"),
          pincode: get("postal_code"),
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        };

        console.log("🟢 FULL PARSED ADDRESS →", fullAddress);

        setLocation({
          label: result.formatted_address,
          value: { lat: fullAddress.lat, lng: fullAddress.lng },
          details: fullAddress,
        });
      }
    );
  };




  // confirm this is my location 
  const handleIsMylocBtn = async () => {
    try {
      const payload = {
        address: location.details.formatted,
        city: location.details.city,
        state: location.details.state,
        location: {
          type: "Point",
          coordinates: [location.value.lng, location.value.lat],
        },
      };

      console.log('location', currentAddress, location);
      const res = await axios.put(`${apiUrl}/api/profile-update`,
        payload, { withCredentials: true });
      console.log(res.data);
      setLocationSelect(false);
      setLocation('')
    } catch (err) {
      console.error("Backend error:", err);
      setError(err.response?.data?.error);
    }

  }


  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <>
      {/* Modal */}
      <div className={`fixed top-0 right-0 w-full max-w-md h-screen bg-gray-50 z-9999
          py-3 px-4 flex flex-col gap-6 text-gray-900
          transform transition-transform duration-500 ease-in-out
          ${locationSelect ? "translate-x-0" : "translate-x-full"}`}  >

        <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
          <IoIosArrowRoundBack size={35}
            className="cursor-pointer" onClick={() => setLocationSelect(false)} />
          <h1 className="text-lg font-bold">Select Your Location</h1>
        </div>

        {/* Places Autocomplete */}
        <div className="relative flex flex-col justify-center">
          <GooglePlacesAutocomplete
            autoload={false}
            autocompletionRequest={{ componentRestrictions: { country: ["in"] } }}
            selectProps={{
              value: location,
              onChange: handleSelectLocation,
              placeholder: "Search an area or address",
              isClearable: true,
              components: { DropdownIndicator: () => null },
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
              },
            }}
          />
          <CiSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2
           text-gray-600"/>
        </div>

        {/* Use Current Location Button */}
        <div className="flex items-center gap-2 p-2 pb-2 border-b-2 border-gray-300 cursor-pointer"
          onClick={handleUseCurrentLocation} >
          <div className="w-10 h-10 rounded-full bg-orange-100 flex justify-center items-center">
            <FaLocationArrow size={20} className="text-orange-500" />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="text-orange-700 text-sm font-bold">Use my current location</p>
            <span className="text-xs text-gray-700">It's same as the restaurant location</span>
          </div>
        </div>


        {/* ended my saved location */}


        {/* Google Map */}
        {location && location.value?.lat && location.value?.lng && (
          <GoogleMap center={location.value} zoom={18}
            options={{ styles: mapStyles }}
            mapContainerStyle={{ width: "100%", height: "400px" }}>

            <Marker position={location.value} />
          </GoogleMap>)}

        {/* Confirm Location */}
        {location && (
          <div className="bg-white shadow-2xl rounded-xl fixed bottom-3
            left-1/2 -translate-x-1/2 w-[90%] max-w-md
            border border-gray-300 ">


            <div className="px-2 pb-3 py-2">
              <p className="flex items-center gap-3">
                <FaLocationArrow size={28} className="text-orange-500" />
                <span className="text-[15px]">
                  {location?.label || "Select a location"}
                </span>
              </p>

              <button className="font-bold bg-orange-600 text-white rounded-2xl px-5
                py-2.5 w-full mt-2 cursor-pointer" onClick={handleIsMylocBtn}>
                Confirm Address
              </button>
            </div>
          </div>

        )}
      </div>
    </>
  );
};

export default UserShopkeeperLocation;