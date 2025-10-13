
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
  { value: 'oxygen_supply', label: 'Oxygen / Medical Gases Supplier' },
  { value: 'orthopedic', label: 'Orthopedic & Prosthetics Shop' }
];

const HomePage = () => {
const router = useRouter();
const [auth, setAuth] = useState(false);
const [shops, setShops] = useState([]);
const [Allshops, setAllShops] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [category, setCategory] =  useState('');
const [loading, setLoding] = useState(true);


// console.log('apiURL', apiUrl);

//Redirect if already logged in
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


const handleSelectd = (e) => {
  const selectedCategory = e.target.value.toLowerCase();
  console.log(selectedCategory);
  setCategory(selectedCategory);
};


// fetch all shops on homepage
const getAllShops = async () => {
  try{
     const url = category && category !=='all shop'
      ? `${apiUrl}/api/shopkeeper-category-shop/${category}`
      : `${apiUrl}/api/shopkeepers-shops`;

    const res = await axios.get(url, { withCredentials: true });
    // console.log(res.data);
    setShops(res.data.shopkeeper);
    setAllShops(res.data.shopkeeper);
  }catch(err){
    console.log('err => ', err);
  }
} 
// /shopkeeper-category-shop/:category

useEffect(() => {
    getAllShops();
},[category]);


const handleInput = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      const filteredValue = Allshops.filter((shop) =>
        shop.business_name.toLowerCase().includes(searchTerm)
      );
      setShops(filteredValue);
     } else {
        setShops(Allshops);
    }
  }, 300);

  return () => clearTimeout(delayDebounce); 
}, [searchTerm, Allshops]);

if(loading) return <div className="mt-4 text-center">Checking</div>
if(!auth) return <div className="mt-4 text-center">Checking</div>
  return  (
    <>
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16 bg-pink-50
       relative">
        {/* pt-16 and pb-16 add space for fixed navbars */}
        <div className="text-center w-full flex  mt-6 max-w:md mx-auto">

  {/* upper navbar */}
          <div className="w-full p-2 flex justify-between items-center gap-6">

            <select name="shop category" id="shop category" onChange={handleSelectd}
             value={category}
            className="w-1/2  border border-gray-500 rounded-md p-2 md:p-3 text-gray-700
             focus:outline-none 
            focus:ring-2 focus:ring-rose-600 focus:border-none text-sm" defaultValue="">
            <option value="" disabled>Shop Categories</option>
            {shopCategories.map(({value, label},i) => (
              <option key={i} value={value} className="text-gray-700">
                {value}
              </option>
            ))}

          </select>
          
         <div className="relative w-full md:w-[400px]">
                    <input type="text" placeholder="Search your shop"
                    className="w-full pl-10 pr-4 py-2 md:py-3 rounded-2xl border border-gray-700 
                    outline-none focus:ring-2 focus:ring-rose-500 focus:border-none text-sm"
                    onChange={handleInput}
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" size={20} />
                </div>
          </div>
          

      </div>


      <div className="w-full bg-[#FF1658] flex p-1 items-center justify-center gap-5 mt-2">
        <p className="md:text-lg text-xs text-white font-semibold">Get Free Coupon For Your Next Order</p>
        <button className="md:text-lg text-xs px-3 py-2 bg-black underline text-white cursor-pointer rounded-2xl">show now</button>
      </div>
          


            
      {/* shopcard */}

      <div className=" w-full grid grid-cols-2 md:grid-cols-4 gap-6 p-2 ">
        {shops.map((value, i) => (
          <div  className=" bg-white shadow-lg rounded-xl p-4 flex flex-col items-center
          text-center transition-transform duration-200 hover:scale-105 z-50" >
            <img src={value.shopImg ? value.shopImg:'https://img.freepik.com/free-vector/shop-with-sign-we-are-open_52683-38687.jpg?semt=ais_hybrid&w=740&q=80'} alt="shop image"
              className="w-25 h-25 md:w-32 md:h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-md md:text-lg font-semibold"> {value.business_name}</h2>
            {/* <p className="text-sm text-gray-600 mt-1 font-medium">{value.business_category}</p> */}
            <p className="text-[12px] text-green-600 mt-1 font-medium">
              <p className="text-[12px] text-green-600 mt-1 font-medium">
             <span> {value.min_offer ? value.min_offer : '10'}% to</span>
               <span className="ml-1">{value.max_offer ? value.max_offer : '30'}%</span>
                 <span className="ml-1"> Discount</span> </p>
                 </p>
          </div>
        ))}
      </div>


 <svg className="fixed bottom-0 left-0 w-full h-[70%]"
          viewBox="0 0 1440 320" preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF1658"
            fillOpacity="1" d="M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z"/>
        </svg>

      </div>
      <NavbarBottom />
    </>
  );
};

export default HomePage;