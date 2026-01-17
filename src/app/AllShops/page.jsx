
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



const AllShops = () => {

  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoding] = useState(true);

  const [shopsList, setShopList] = useState([]);
  const [allShopsList, setAllShopList] = useState([]);
  const [AllShopCategory, setAllShopCategory] = useState([]);
  const [city, setCity] = useState('');
  const [shopFoundError, setShopFoundError] = useState('');
  const [shopsLoading, setShopsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectCategory, setSelectCategory] = useState("ALL");


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


const handleCity = (selectedCity) => {
  console.log('Parent received city:', selectedCity);
  setCity(selectedCity);
};



useEffect(() => {
  const getLoginUser = async () => {
    try{
      const res =  await axios(`${apiUrl}/api/customer-profile`, {withCredentials:true});
      console.log(res.data.user);
      setCity(res.data.user.city);
      window.scroll(0,0);
    }catch(err){
      console.log(err);
    }
  }

  getLoginUser();
},[]);




useEffect(() => {
  if (!city) return;

  const fetchShops = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/shopkeepers-shops/${encodeURIComponent(city)}`,
          { withCredentials: true }
        );

        const shops = res.data.shopkeepers;
        setShopList(shops);
        setAllShopList(shops);

        const uniqueCategories = [...new Set(shops.map( shop => shop.business_category))];

        const categories = [
          { business_category: "ALL", shopImg: null },
          ...uniqueCategories.map(category => {
            const shopWithImage = shops.find(
              shop => shop.business_category === category
            );

          return { business_category: category, shopImg: shopWithImage?.shopImg || null };
          })
        ];

        setAllShopCategory(categories);
        setShopFoundError('');
      } 
      catch (err) {
        if (err.response?.data?.error === 'No shops found for this city') {
          setShopFoundError('No shops found for this city');
          setShopList([]);
          setAllShopList([]);
        }
      } 
      finally {
        setShopsLoading(false);
      }
    };
    fetchShops();
}, [city]);



const handleSearchLogic = (e) => {
  setSearchTerm(e.target.value.toLowerCase());
};

useEffect(() => {
  const debounce = setTimeout(() => {
    const term = searchTerm.trim();
    if (!term) {
      setShopList(allShopsList);
    } else {
      const filtered = allShopsList.filter((v) =>
        v.business_name.toLowerCase().includes(term)
      );
      setShopList(filtered);
    }
  }, 400);

  return () => clearTimeout(debounce);
}, [searchTerm, allShopsList]);



// select category logic here
const handleSelectCategory = (category) => {
  setSelectCategory(category.business_category);

  if (category.business_category === "ALL") {
    setShopList(allShopsList);
  } else {
    const filtered = allShopsList.filter(
      (shop) => shop.business_category === category.business_category
    );
    setShopList(filtered);
  }
};



const NoShopFound = () => (
  <div className="flex flex-col items-center justify-center w-full py-20">
    <img src="https://assets-v2.lottiefiles.com/a/bbbd72ce-1171-11ee-842c-0bbbb82dc9a1/6pSbyFhGTy.gif"  
     alt="No shops found"  className="w-56 h-56 opacity-85 object-contain" />
    <h2 className="text-xl font-bold text-gray-800 mt-4">
      No Stores Nearby
    </h2>
    <p className="text-gray-500 text-center text-sm mt-2 px-6">
      We couldn't find any stores in your area.
      Try changing your location or try again.
    </p>
  </div>
);



if (loading || !auth ) return (
  <>
    {/* Top Navbar Skeleton */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 
    gap-2 rounded-b-3xl pb-4">
  
      <div className="w-full flex justify-between items-center gap-2">
        <Skeleton height={40} width={100} /> {/* Logo */}
        <div className="flex items-center gap-4">
          <Skeleton height={28} width={100} /> 
          <Skeleton circle={true} height={40} width={40} /> 
        </div>
      </div>

         <div className="px-4 mt-2 w-full">
            <div className="bg-gray-200 rounded-2xl p-3 shadow
                            flex items-center justify-between">
          
              <Skeleton height={22} width='100%' borderRadius={12} />
            </div>
          </div>
    
          {/* sub header items */} 
          <div className="px-4 mt-1 mb-2 w-full">
            <div className="bg-gray-200 rounded-2xl p-3 shadow-lg
                            flex items-center justify-between">
          
              {/* Left text */}
              <div className="space-y-2">
                <Skeleton height={14} width={120} borderRadius={6} />
                <Skeleton height={12} width={140} borderRadius={6} />
              </div>
          
              {/* Button */}
              <Skeleton height={32} width={70} borderRadius={12} />
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



 return (
  <>
    <NavbarTop handleCity={handleCity} />

    <div className="min-h-full w-full flex-col justify-center pb-16 pt-10 relative">

      {/* Error View (No Shop Found) */}
      {shopFoundError ? (
        <NoShopFound />
      ) : (
        <>
  
          {/* <div className="w-full p-2 pt-6 rounded-b-2xl bg-gradient-to-b 
          from-[#17186C] to-[#1B1C8F] shadow-lg"> */}

  <div className="sticky top-9 z-40 bg-white">
  <div className="w-full px-4 pt-8 pb-4 shadow rounded-b-3xl">

    <div className="flex gap-3 items-center">

      {/* Category Select */}
      {/* <div className="relative w-[45%]">
        <select defaultValue="All Shop" onClick={hanldeSelectLogic}
          className="w-full appearance-none rounded-xl border border-gray-200
          px-4 py-3 text-sm font-medium text-gray-800 bg-white
          focus:ring-2 focus:ring-black focus:outline-none shadow-sm" >
          <option value="" disabled>Categories</option>
          {shopCategories.map((value, i) => (
            <option key={i} value={value}>{value}</option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
      </div> */}

      <div className="relative flex-1">
        <FiSearch  size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input type="text" placeholder="Search shops" onChange={handleSearchLogic}
          className="w-full rounded-xl border border-gray-200
          pl-11 pr-4 py-3 text-sm font-medium text-gray-800
          focus:ring-2 focus:ring-black focus:outline-none shadow-sm" />
      </div>

    </div>


    <div className="mt-4 rounded-2xl bg-orange-50 border border-orange-100
      px-4 py-3 flex items-center justify-between">

      <div>
        <p className="text-sm font-semibold text-blue-900"> 🎁 Free Coupon </p>
        <p className="text-xs text-blue-700"> On your next order</p>
      </div>

      <Link href={'/FreeCoupon'}  className="px-4 py-2 text-xs font-semibold text-white
        bg-blue-500 rounded-xl "> Show</Link>
    </div>

  </div>
</div>


{/* EXPLORE CATEGORIES SECTION */}
{shopsList.length !== 0 ? (<div className="w-full bg-white z-30">
  <div className="px-4 py-5">

    <h2 className="text-sm font-semibold text-gray-900 mb-3">Explore Categories </h2>
    <div className="flex gap-5 overflow-x-auto scrollbar-hide">
      {AllShopCategory?.map((value, i) => (
        <div key={i} className="flex flex-col items-center min-w-[72px] 
          cursor-pointer select-none active:scale-90 transition-transform"
          onClick={() => handleSelectCategory(value)} >
         
        <div className={`relative w-13 h-13 rounded-full p-[2px] shadow-md transition
        ${selectCategory === value.business_category ? 'border-2 border-blue-600' : ''}`}>

        {selectCategory === value.business_category && (
          <div className="absolute -top-1 -right-1 w-5 h-5  bg-blue-600 text-white
            rounded-full flex items-center justify-center shadow-md text-xs"> ✓
          </div>
        )}
      <div className="w-full h-full rounded-full overflow-hidden bg-white">
        <img src={  value.shopImg ||
            "https://t3.ftcdn.net/jpg/03/05/92/84/360_F_305928424_visqTeQnMLvzfT3XBtDZWX9TNTlVLML6.jpg" }
          alt={value.business_category} className="w-full h-full object-cover" loading="lazy" />
      </div>
  </div>

   <p className="mt-1 text-[11px] font-medium text-gray-800 text-center leading-tight
       truncate w-full">{value.business_category} </p>
     </div>
   ))}

 </div>
    </div>
  </div>
):(<div></div>)
}


 {/* SHOP LIST SECTION */}
<div className="w-full md:w-1/2 mx-auto  mt-3 py-4">
  {shopsList && shopsList.length > 0 && (
  <div className="flex flex-col gap-4 px-2 pb-6">
  {shopsList.map((v, i) => (
    <Link  key={v._id || i} href={`/Shop/${v._id}`}
      className="group bg-white rounded-3xl p-3
            flex items-center gap-4 shadow-[0_4px_14px_rgba(0,0,0,0.06)]
            active:scale-[0.97] transition-all duration-200" >

      <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={v.shopImg || "/shops/32340.jpg"} alt={v.business_name}
          className="w-full h-full object-cover" />
     
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="font-semibold text-gray-900 truncate capitalize">{v.business_name}</h1>

        <p className="text-[12px] text-gray-500 mt-0.5 capitalize">
          {v.business_category || "Local Store"}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] font-semibold text-green-700
                           bg-green-50 px-2 py-0.5 rounded-lg">
            Offers Available
          </span>

          <span className="text-xs text-gray-800 transition"> View →</span>
        </div>
      </div>
    </Link>
  ))}
</div>

  )}


{shopsList.length === 0 && searchTerm.trim() &&
    (
        /* EMPTY STATE */
    <div className="flex flex-col items-center justify-center mt-5 px-6 text-center">

      <div className="w-35 h-35 rounded-full   flex items-center justify-center
        mb-5 shadow-sm">
        <img src="/shops/404 error.png" alt="No Shops"
          className="w-35 h-35 object-contain opacity-80" />
      </div>

      <h2 className="text-lg font-semibold text-gray-800">No shops found</h2>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-xs">
        We couldn’t find any shops matching your search.
        Try changing category or location.
      </p>

      <button onClick={() => setSearchTerm("")} className="mt-6 px-6 py-2 rounded-xl 
           bg-black text-white text-sm font-semibold active:scale-95 transition-all"  >
        Clear Search
      </button>
    </div>

      )
}
</div>


          {/* FOOTER IMAGE */}
          {/* <div className="relative w-full mt-10">
            <div className="rounded-2xl overflow-hidden">
              <img  src="/shops/footer.png" alt="Footer"
                className="w-full h-40 md:h-60 object-cover brightness-[0.60]"
                loading="lazy" />
            </div>
          </div> */}

        </>
      )}
    </div>

     {/* SHOW NAVBAR ONLY WHEN SHOPS EXIST */}
      {!shopFoundError && <NavbarBottom />}
  </>
);

};

export default AllShops;