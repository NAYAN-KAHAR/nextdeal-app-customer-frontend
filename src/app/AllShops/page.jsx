
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

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // needed for styles



const shopCategories = [
  { value: 'all shop', label: 'all shop' },
  { value: 'grocery', label: 'Grocery Shop' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'hypermarket', label: 'Hypermarket' },
  { value: 'kirana', label: 'Kirana Store' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'sweetshop', label: 'Sweet Shop / Mithai Shop' },
  { value: 'confectionery', label: 'Confectionery Store' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'clothing', label: 'Clothing Store' },
  { value: 'ethnicwear', label: 'Ethnic Wear Store' },
  { value: 'westernwear', label: 'Western Wear' },
  { value: 'kidswear', label: 'Kids Wear Store' },
  { value: 'footwear', label: 'Shoe Store / Footwear' },
  { value: 'electronics', label: 'Electronics Shop' },
  { value: 'mobile', label: 'Mobile Phone Showroom' },
  { value: 'appliance', label: 'Home Appliances Store' },
  { value: 'computer', label: 'Computer / Laptop Store' },
  { value: 'books', label: 'Bookstore' },
  { value: 'stationery', label: 'Stationery Shop' },
  { value: 'furniture', label: 'Furniture Store' },
  { value: 'home_decor', label: 'Home Decor / Furnishings' },
  { value: 'hardware', label: 'Hardware Store' },
  { value: 'paint', label: 'Paints & Wallpaper Shop' },
  { value: 'plumbing', label: 'Plumbing & Sanitary Store' },
  { value: 'electrical', label: 'Electrical Goods Store' },
  { value: 'jewelry', label: 'Jewelry Shop' },
  { value: 'artificial_jewelry', label: 'Artificial / Fashion Jewelry' },
  { value: 'precious_jewelry', label: 'Precious Jewelry' },
  { value: 'watches', label: 'Watch Store' },
  { value: 'beauty', label: 'Beauty Products / Cosmetics' },
  { value: 'perfume', label: 'Perfume / Fragrance Shop' },
  { value: 'salon', label: 'Beauty Salon / Parlor' },
  { value: 'spa', label: 'Spa' },
  { value: 'haircare', label: 'Hair Care Products' },
  { value: 'skincare', label: 'Skincare Products' },
  { value: 'tattoo', label: 'Tattoo Studio' },
  { value: 'optical', label: 'Optical Store / Eyewear' },
  { value: 'watch_repair', label: 'Watch Repair Shop' },
  { value: 'repair', label: 'Repair Shop (General)' },
  { value: 'tailor', label: 'Tailor / Alteration Shop' },
  { value: 'drycleaning', label: 'Dry Cleaners' },
  { value: 'laundry', label: 'Laundry Service' },
  { value: 'photography', label: 'Photo Studio' },
  { value: 'camera', label: 'Camera & Photography Equipment' },
  { value: 'gift', label: 'Gift & Souvenir Shop' },
  { value: 'toy', label: 'Toy Store' },
  { value: 'pet', label: 'Pet Supplies / Pet Shop' },
  { value: 'pet_grooming', label: 'Pet Grooming' },
  { value: 'florist', label: 'Florist' },
  { value: 'garden', label: 'Nursery / Plant Shop' },
  { value: 'sports', label: 'Sports Equipment' },
  { value: 'fitness', label: 'Gym / Fitness Equipment' },
  { value: 'cycling', label: 'Bicycle Shop' },
  { value: 'motorcycle', label: 'Motorcycle / Scooter Store' },
  { value: 'auto_parts', label: 'Auto Parts Store' },
  { value: 'tyre_shop', label: 'Tyre & Tube Shop' },
  { value: 'petrol_pump_shop', label: 'Fuel Station Convenience Store' },
  { value: 'car_dealership', label: 'Car Dealership' },
  { value: 'motorbike_dealership', label: 'Motorbike Dealership' },
  { value: 'convenience', label: 'Convenience Store' },
  { value: 'department_store', label: 'Department Store' },
  { value: 'mall_kiosk', label: 'Mall Kiosk' },
  { value: 'mobile_accessories', label: 'Mobile Accessories Shop' },
  { value: 'hardware_tools', label: 'Tools & Machinery' },
  { value: 'stationery_and_art', label: 'Art & Stationery’' },
  { value: 'music', label: 'Music Store / Instruments' },
  { value: 'vinyl_records', label: 'Record/CD Store' },
  { value: 'internet_cafe', label: 'Internet Cafe / Cyber Cafe' },
  { value: 'photocopy', label: 'Photocopy / Print Shop' },
  { value: 'luggage', label: 'Luggage & Bags' },
  { value: 'leather_goods', label: 'Leather Products' },
  { value: 'handicrafts', label: 'Handicrafts & Local Crafts' },
  { value: 'antique', label: 'Antique Shop' },
  { value: 'fabrics', label: 'Fabric / Textile Store' },
  { value: 'silk_shop', label: 'Silk / Saree Shop' },
  { value: 'unstitched_fabrics', label: 'Unstitched Fabrics Shop' },
  { value: 'hosiery', label: 'Hosiery Shop' },
  { value: 'innerwear', label: 'Lingerie / Innerwear Store' },
  { value: 'swimwear', label: 'Swimwear Store' },
  { value: 'luxury_goods', label: 'Luxury Goods Boutique' },
  { value: 'designer_wear', label: 'Designer Wear' },
  { value: 'bridal_wear', label: 'Bridal Store' },
  { value: 'wedding_shops', label: 'Wedding Shop (decor / clothes / services)' },
  { value: 'party_supplies', label: 'Party Supplies Shop' },
  { value: 'bakery_cafe', label: 'Bakery + Cafe' },
  { value: 'coffee_shop', label: 'Tea / Coffee Shop' },
  { value: 'juice_bar', label: 'Juice Bar / Fresh Juice Shop' },
  { value: 'icecream_parlor', label: 'Ice Cream Parlor' },
  { value: 'chat_stall', label: 'Street Food / Chat Stall' },
  { value: 'fast_food', label: 'Fast Food Outlet' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'dhaba', label: 'Dhaba / Roadside Eatery' },
  { value: 'food_truck', label: 'Food Truck' },
  { value: 'takeaway', label: 'Takeaway / Takeout' },
  { value: 'hotel_shop', label: 'Hotel / Guest House Gift Shop' },
  { value: 'travel_agency', label: 'Travel Agency' },
  { value: 'ticketing', label: 'Ticketing Office' },
  { value: 'florist_supplies', label: 'Flower & Decoration Supplies' },
  { value: 'cosmetic_salon', label: 'Cosmetic / Makeup Studio' },
  { value: 'skin_clinic', label: 'Skin Clinic' },
  { value: 'ayurvedic_shop', label: 'Ayurvedic / Herbal Products' },
  { value: 'homeopathy_shop', label: 'Homeopathy / Unani Products' },
  { value: 'organic_food', label: 'Organic Food & Health Store' },
  { value: 'dietary_supplements', label: 'Health Foods Store' },
  { value: 'medical_equipment', label: 'Medical Equipment Shop' },
  { value: 'orthopedic', label: 'Orthopedic & Prosthetics Shop' }
];


const foodCategories = [
  {
    name: "Electronic",
    image: "https://b.zmtcdn.com/data/pictures/chains/3/143/ce0341e58cf96f163101b4dff77ed938.jpg"
  },
  {
    name: "Computer",
    image: "https://www.foodandwine.com/thmb/XE8ubzwObCIgMw7qJ9CsqUZocNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg"
  },
  {
    name: "Cloth",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTajz7dRbTo3giRInUr6Xvw9BaDAtK3MK6GA&s"
  },
  {
    name: "Salad",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmglESoehFJXMDr2mNvtBQVVu4W5RkEs3XuA&s"
  },
  {
    name: "Grocery",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpR7Ebfhvn1Bdu6TlQd_hrgExg2lbDDSYlQ&s"
  },
   
];

const AllShops = () => {

const router = useRouter();
const [auth, setAuth] = useState(false);
const [loading, setLoding] = useState(true);

const [showHeader, setShowHeader] = useState(true);
const [prevScrollPos, setPrevScrollPos] = useState(0);


useEffect(() => {
  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos === 0) {
      // At the very top of the page
      setTimeout(() =>setShowHeader(true), 100);
    } else if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
      // Scrolling down past threshold
      setShowHeader(false);
    }
    setPrevScrollPos(currentScrollPos);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [prevScrollPos]);


// console.log('apiURL', apiUrl);

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
      }finally{
        setLoding(false);
      }
    };

    checkAuth();
  }, [router]);



if (loading || !auth) return (
  <>
    {/* Top Navbar Skeleton */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 
    gap-2 rounded-b-3xl pb-4">
  
      <div className="w-full flex justify-between items-center gap-2">
        <Skeleton height={40} width={100} /> {/* Logo */}
        <div className="flex items-center gap-4">
          <Skeleton height={28} width={100} /> 
          <Skeleton circle={true} height={30} width={30} /> 
        </div>
      </div>

      <div className="w-full flex justify-between items-center gap-4">
        <div className="flex-1">
          <Skeleton height={30} width="100%" />
        </div>
        <div className="flex-2">
          <Skeleton height={30} width="100%" />
        </div>
      </div>

      <div className="w-full flex justify-between items-center gap-4 ">
        <div className="flex-[3]">
          <Skeleton height={18} width="100%" />
        </div>
        <div className="flex-[1] rounded-2xl">
          <Skeleton height={30} width="100%" />
        </div>
      </div>

</div>


{/* sub header items */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 mt-2
    gap-2  rounded-b-xl pb-4">
  
    <Skeleton height={27} width={250} /> 
    <div className="h-20 bg-gray-200 flex items-center justify-around  mt-4 gap-6 
    rounded-t-3xl">
      {Array(4).fill('').map((_, i) => (
        <div className="flex justify-start items-start gap-2 flex-col">
           <Skeleton key={i} circle={true} height={60} width={60} />
              <Skeleton height={22} width={70} /> 
        </div>
      ))}
    </div>
    
</div>

{/* restaurant/shop cards with a skeleton UI */}
<div className="w-full md:w-1/2 mx-auto px-2 mt-6 grid grid-cols-1 gap-6">
  {[...Array(18)].map((_, i) => (
    <div key={i} className="bg-white rounded-xl flex items-start gap-4 p-2">

   
      <div className="w-28 h-40 rounded-xl overflow-hidden flex-shrink-0">
        <Skeleton height="100%" width="100%" borderRadius="1rem" />
      </div>


      <div className="flex flex-col justify-between flex-1 gap-2">
        <Skeleton height={20} width="60%" />   
        <Skeleton height={14} width="90%" />   
        <Skeleton height={14} width="80%" />   
        <Skeleton height={18} width="40%" />   
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


  return  (
    <>
      <NavbarTop />
      <div className="min-h-full w-full flex-col justify-center  pb-16 pt-10 relative">

 <div className="w-full p-2  bg-[#17186C] pt-6 rounded-b-2xl">

      <div className="flex justify-between items-center gap-6 ">
              <select name="shop category" id="shop category" 
             className="w-[50%] border border-white rounded-xl px-1 py-[5px] text-black
              focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-white"
            defaultValue="" >
             <option value="" disabled>Shop Categories</option>
             {shopCategories.map(({value, label},i) => (
               <option key={i} value={value} className="text-gray-700">
                 {value}
               </option>
            ))}

           </select>
          
         <div className="relative w-full md:w-[400px]">
           <input type="text" placeholder="Search your shop"
               className="w-full pl-10 pr-4 py-[5px] md:py-3 rounded-2xl border
                 border-white outline-none focus:ring-2 focus:ring-white 
                focus:border-none text-sm text-black bg-white" />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2
                 text-black" size={20} />
         </div>

    </div>

    <div className="w-full flex p-1 items-center justify-between gap-5 mt-2">
         <p className="md:text-lg text-xs text-white font-semibold">Get Free Coupon For Your Next Order</p>
         <button className="md:text-lg text-xs px-5 py-1.5 bg-red-600 
          text-white cursor-pointer rounded-2xl font-bold">show now</button>
    </div>
</div>
          
{/* ended upper section */}




 {/* explore shops start */}
 
<div className={`w-full mx-auto z-30 bg-white transition-all duration-300 ${
    showHeader ? 'sticky top-0' : 'fixed top-0 md:w-1/2 shadow-md' }`}>

  <div className="flex flex-col w-full bg-[#E6EEFF] py-6 px-4 gap-4 rounded-b-2xl shadow-sm">
    <h1 className="text-lg font-semibold text-gray-900">Explore Store Categories </h1>

    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
      {foodCategories.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-1 min-w-[72px] 
        cursor-pointer hover:scale-105 transition-transform duration-200" >
          <img src={value.image} alt={value.name}
            className="w-14 h-14 rounded-full object-cover shadow-md border border-white" />
          <p className="text-sm text-center text-gray-700 font-medium"> {value.name} </p>
        </div>
      ))}
    </div>
  </div>
</div>
{/* Explore shops ended */}




{/* start all shop listed */}
<div className="w-full md:w-1/2 mx-auto px-4 mt-6 grid grid-cols-1 gap-6">
{[1,1,1,1,1,1,1].map((value,i) => {
  return <div key={i} className="bg-white rounded-xl flex items-start gap-4" >

    <div className="w-30 h-35 rounded-xl overflow-hidden flex-shrink-0 ">
      <img src="/shops/32340.jpg" alt="Electronic"
        className="w-full h-full object-cover"/>
    </div>

    <div className="flex flex-col justify-between">
      <h1 className="text-lg font-bold text-gray-900">Shriman Electronic </h1>
      <p className="text-xs text-gray-600 mt-1 leading-snug">
        Computer, Laptop Sales & Service, CCTV, Speaker, Other Electronics Items...
      </p>
      <p className="text-sm font-bold mt-2">
        10% to 30% OFF
      </p>
    </div>
  </div>
})}

</div>
{/*  ended all shop listed*/}

{/* Footer Section */}
<div className="relative w-full mt-10 ">
  <div className="rounded-2xl overflow-hidden">
    <img src="/shops/footer.png" alt="Fotter"
      className="w-full h-40 md:h-60 object-cover" loading="lazy" />
  </div>
</div>


</div>
<NavbarBottom />
    </>
  );
};

export default AllShops;
