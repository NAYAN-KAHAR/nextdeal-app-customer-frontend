'use client';
import { IoIosArrowRoundBack, IoIosArrowDown, IoIosStar} from "react-icons/io";
import { FiSearch } from 'react-icons/fi';
import { FaCircleUser, FaAngleUp } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { GoPlus } from "react-icons/go";
import { TiMinus } from "react-icons/ti";
import { RiBookOpenLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FiBookmark } from "react-icons/fi";
import { MdOutlineReport, MdArrowRight } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 

import AddCardItem from '../components/addCard';
import ViewCardItem from '../components/viewCard';


const NinetiNinePage = () => {

 
  const router = useRouter();

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isPastaOpen, setIsPastaOpen] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  const [isAcceptingOrders, setIsAcceptingOrders] = useState(false);
 
  const [foodCategory, setFoodCategory] = useState([]);
  const [subFoodCategory, setSubFoodCategory] = useState([]);
  const [allSubFoodCategory, setAllSubFoodCategory] = useState([]);

  const [FoodType, setFoodType] = useState('All');
  const [openMenu, setOpenMenu] = useState(false);

  // const [itemCount, setItemCount] = useState(1);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [activeIndex,  setActiveIndex] = useState(null);
  const [showHeader,   setShowHeader] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const [isFoodOpen, setIsFoodOpen] = useState(true);
  const [showCounter, setShowCounter] = useState({});
  const [itemsState, setItemsState] = useState({});
  const [totalItems, setTotalItems] = useState(); 
  const [addItemError, setAddItemError] = useState('');

  const [isViewClick, setIsViewClick] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLoader, setFilterLoader] = useState(false);
  const [foodSubHeader, setFoodSubHeader] = useState([]);
  const [subHeader, setSubHeader] = useState();
  const [isSearch, setIsSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);


// Redirect if already logged in
useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/verify`, {withCredentials: true });
        console.log(res.data);
        if (res.data.authenticated) {
          setAuth(true);
        }
      } catch (err) {
        console.log('User not logged in', err);
        router.push('/Signup');
      }finally{
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);


 // scrolled logic  throttled
// useEffect(() => {
//   let throttleTimeout = null;

//   const handleScroll = () => {
//     const currentScrollPos = window.scrollY;

//     if (currentScrollPos === 0) {
//       setTimeout(() => setShowHeader(true), 100);
//     } else if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
//       setShowHeader(false);
//     }

//     setPrevScrollPos(currentScrollPos);
//   };

//   const throttledScroll = () => {
//     if (throttleTimeout === null) {
//       throttleTimeout = setTimeout(() => {
//         handleScroll();
//         throttleTimeout = null;
//       }, 200); // <-- adjust throttle delay (200ms is good)
//     }
//   };

//   window.addEventListener("scroll", throttledScroll);

//   return () => {
//     window.removeEventListener("scroll", throttledScroll);
//     if (throttleTimeout) clearTimeout(throttleTimeout);
//   };
// }, [prevScrollPos]);


useEffect(() => {
  let throttleTimeout = null;
  let prevScroll = window.scrollY;

  const handleScroll = () => {
    const current = window.scrollY;
    // Hide header when scrolling down past 100px
    if (current > prevScroll && current > 100) {
      setShowHeader(false);
    }
    // Show header when reaching top (100px or less)
    if (current <= 100) {
      setShowHeader(true);
    }

    // Transparency: only near top
    setSubHeader(current <= 100);
    prevScroll = current;
  };

  const throttledScroll = () => {
    if (!throttleTimeout) {
      throttleTimeout = setTimeout(() => {
        handleScroll();
        throttleTimeout = null;
      }, 100);
    }
  };

  window.addEventListener("scroll", throttledScroll);
  return () => {
    window.removeEventListener("scroll", throttledScroll);
    if (throttleTimeout) clearTimeout(throttleTimeout);
  };
}, []);


const fetchAll99Foods= async () => {
  try{
     const lat = 23.9057271;
     const lng = 87.4961469; 

     const res  = await axios.get(`${apiUrl}/api/customer-gets-all-99-food-items?lat=${lat}&lng=${lng}`, 
                          {withCredentials:true } );
     console.log('fetchAllCategory', res.data);
     const nineTyNineFood= res.data.nineTyNineFood;
     const cat = res.data.Categories;
     const allRestuarants = res.data.restaurants;

     const nineTyNineFoodIDs = [...new Set(nineTyNineFood.map(v => v.FoodCategory))];
     const reverseHeader = cat.filter(v => nineTyNineFoodIDs.includes(v._id));
    
     const nineTyNineResIDs = [...new Set(nineTyNineFood.map(v => v.restaurant))];
     const filteredRestuarans = allRestuarants.filter((v) => nineTyNineResIDs.includes(v._id));


    console.log("reverseHeader", reverseHeader);
    setRestaurants(filteredRestuarans);
    setFoodSubHeader(reverseHeader);
    
    setSubFoodCategory(nineTyNineFood);
    setAllSubFoodCategory(nineTyNineFood);

  }catch(err){
    console.log('err', err);
  }
}
 

useEffect(() => {
  fetchAll99Foods();
},[]);


const handleSubHeader = (e, value, i) => {
    e.stopPropagation();
    setSubHeader(i);
    setFilterLoader(true);

    if (!value) {
      setSubFoodCategory(allSubFoodCategory);
      setFilterLoader(false);
      return;
    }

    setFoodType('');

    const filtered = allSubFoodCategory.filter(v => v.FoodCategory === value._id);
    setSubFoodCategory(filtered);

    console.log('filtered', filtered); console.log('subFoodCategory', subFoodCategory);
    setFilterLoader(false);
    
};



  // All Filter veg and non veg, rating ,price high to  low
useEffect(() => {
  if (!allSubFoodCategory.length) return;
  setFilterLoader(true);

  setTimeout(() => {
    let filtered = [];
    if (FoodType === 'All restaurants' || FoodType === 'Pure veg restaurants only') {
      filtered = allSubFoodCategory.filter((v) => v.foodType === "Veg");
    } 
    else if (FoodType === 'NonVeg') {
      filtered = allSubFoodCategory.filter((v) => v.foodType === "Non Veg");
    }
    else {
      filtered = allSubFoodCategory;
    }
    setSubFoodCategory(filtered);
    setFilterLoader(false);
  }, 500);

}, [FoodType]);



// food item add button logic here 
const handleAddClick = async (id, name, price) => {
  if (addItemError) return;

  try {
    const newItem = { [id]: { name, price, count: 1 } };
    console.log('newItem', newItem);

    const res = await axios.post(`${apiUrl}/api/add-food-item-view-cards`,
                newItem,{ withCredentials: true });

    console.log(res.data);

    // Only update state if backend succeeded
    setItemsState((prev) => ({...prev, ...newItem }));
    setShowCounter((prev) => ({ ...prev, [id]: true }));

  } catch (err) {
    console.log(err.response);
    if (err.response?.data?.error ===
      "You already have items from another restaurant. Please remove them before adding new items."){
        setAddItemError(err.response.data?.restaurantName?.business_name);
    }
  }
};


// add card item logic here
const handleIncrease = async (id) => {
  if (addItemError) return;

  const updatedItem = (prev) => ({
    ...prev,
    [id]: { ...prev[id], count: (prev[id]?.count || 0) + 1 },
  });

  const newState = updatedItem(itemsState);

  try {
     await axios.post(`${apiUrl}/api/add-food-item-view-cards`,
       newState,{ withCredentials: true });

    setItemsState(updatedItem);
  } catch (err) {
    console.log(err.response);
  }
};


// minimise card logic here
const handleDecrease = async (id) => {
  if (addItemError) return;

  const currentCount = itemsState[id]?.count || 0;
  const newCount = currentCount - 1;

  // 🧠 Immediately update UI
  setItemsState((prev) => {
    const updated = { ...prev };

    if (newCount <= 0) {
      // Remove item entirely from local state
      delete updated[id];
    } else {
      updated[id] = { ...updated[id], count: newCount };
    }

    return updated;
  });

  // 📨 Send request to backend
  try {
    const updatedData = {
      [id]: { count: Math.max(newCount, 0) },
    };

    await axios.post(`${apiUrl}/api/add-food-item-view-cards`, updatedData, {
      withCredentials: true,
    });
   
     console.log('updatedData', updatedData);
  } catch (err) {
    console.log(err.response);
  }
};


const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/get-food-item-view-cards`, { withCredentials: true });
      const cartItems = res.data.cartItem || [];
      console.log('cards',res.data);

      // Convert array to object by id for itemsState
      const initialItemsState = {};
      const initialShowCounter = {};

      cartItems.forEach((item) => {
        initialItemsState[item.FoodSubCategory] = {
          name: item.name || '', // use your backend field
          price: item.price || 0,
          count: item.count || 1,
        };
        initialShowCounter[item.FoodSubCategory] = true;
      });

      setItemsState(initialItemsState);
      setShowCounter(initialShowCounter);

      const totalCount = cartItems.reduce((acc, cur) => acc + (cur.count || 0), 0);
      setTotalItems(totalCount);
    } catch (err) {
      console.log(err);
    }
  };

 
useEffect(() => {
  fetchCartItems();
}, [isViewClick]);


useEffect(() => {
  const total = Object.values(itemsState).reduce((acc, cur) => acc + (cur.count || 0), 0);
  setTotalItems(total);
}, [itemsState]);



// Handle Replace Card 
const handleReplaceCard = async () => {
  console.log('clicked');
  try{
    const res =  await axios.delete(`${apiUrl}/api/delete-food-item-view-cards`,
      { withCredentials: true});
    
    console.log(res.data);
    fetchCartItems();
    setAddItemError('');
    handleAddClick();
    

  }catch(err){
    console.log(err);
  }
}



// Debounced search
useEffect(() => {
   setFilterLoader(true);
  const timer = setTimeout(() => {
    let filtered;
    if (searchTerm) {
       filtered = allSubFoodCategory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSubFoodCategory(filtered);
    } else {
      filtered = allSubFoodCategory;
    }

    setSubFoodCategory(filtered);
    setFilterLoader(false); 
  }, 400);
 
  return () => clearTimeout(timer); 
}, [searchTerm, allSubFoodCategory]);


const handleViewClick  = (response) => {
  console.log(response);
  setIsViewClick(response);
}


// Search logic with autocomplete
const handleSearch = (e) => {
  e.stopPropagation();
  const term = (e.target.value || "").toString().toLowerCase(); // ✅ Safe
  setSearchTerm(term);

  if (term.trim() === "") {
    setSuggestions([]);
    return;
  }

  const filtered = allSubFoodCategory.filter((item) =>
    item.name.toLowerCase().includes(term)
  );

  const seen = new Set();
  const uniqueFiltered = filtered.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

  setSuggestions(uniqueFiltered);
};



if(loading || !auth ) {
  return (
    <>
      {/* Top Navbar Skeleton */}
      <div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 gap-2 pb-4">
        <div className="w-full flex justify-between items-center gap-2">
          <Skeleton height={23} width={50} />
          <Skeleton circle={true} height={44} width={44} />
        </div>

        <div className="w-full bg-gray-200 flex justify-between items-center gap-4 h-28  p-2">
           <Skeleton height={45} width="100%" />
        </div>
      </div>

      {/* Sub header items */}
      <div className="w-full bg-gray-200  px-2 mt-2 rounded-2xl mb-1">
         <Skeleton height={45} width="100%"  />
      </div>

      {/* Filters */}
      <div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 mt-2 
       gap-2 pb-2">
        <div className="bg-gray-200 flex items-center justify-around mt-4 gap-6 pb-1">
          {Array(4).fill('').map((_, i) => (
              <div key={i} className="flex justify-start items-start gap-2 flex-col">
                <Skeleton height={38} width={85} />
              </div>
            ))}
        </div>
      </div>


    {/* Food Cards */}
     <div className="w-full md:w-11/12 mx-auto px-2 mt-4 grid grid-cols-2 gap-4">
  {[...Array(6)].map((_, i) => (
    <div key={i} className="bg-white rounded-xl shadow-sm flex flex-col items-center p-2" >
    
      <div className="w-full h-36 rounded-xl overflow-hidden mb-2">
        <Skeleton height="100%" width="100%" borderRadius="1rem" />
      </div>
      <div className="w-full text-center mb-2">
        <Skeleton height={20} width="60%" className="mx-auto" />
      </div>
      <div className="w-full flex justify-between items-center mt-1 px-2">
        <div>
          <Skeleton height={18} width={40} />
        </div>
        <div>
          <Skeleton height={28} width={50} borderRadius="12px" />
        </div>
      </div>
    </div>
  ))}
</div>

     
    </>
  );
}



return (
   <>
     <div className="min-h-screen w-full flex-col justify-center relative bg-white">
     <div className="text-center w-full md:w-1/2  flex flex-col max-w:md mx-auto">
        

{isSearch && (
  <div className="fixed inset-0 z-[998] bg-black/60 transition-opacity duration-300"
    onClick={() => setIsSearch(false)} />)}

  <div className={`fixed top-0 left-0 w-full bg-[#F1F0F5] z-[999] scrollbar-hide pb-2
  transform transition-all duration-500 ease-in-out 
  ${isSearch ? 'translate-y-0' : '-translate-y-full'}
   ${isSearch && (searchTerm || suggestions.length > 0) ? 'h-screen' : 'h-[20%]'}
  overflow-y-auto`}>

 {/* // ${isSearch && (searchTerm || suggestions.length > 0) ? 'h-screen' : 'h-[20%]'} */}

  {/* Sticky Search Header Inside Popup */}
  <div className={`w-full mx-auto z-[1000] bg-white transition-all duration-300 
      ${isSearch ? 'sticky top-0' : 'fixed top-0 md:w-1/2 shadow-5xl'}  `}>

    <div className="relative flex items-center justify-center w-full text-center py-2 border-b
       border-gray-200 bg-white">
      <IoIosArrowRoundBack size={36} className="absolute left-3 cursor-pointer"
        onClick={() => { setIsSearch(false); setSearchTerm(''); setSuggestions([])}} />
      <h1 className="font-bold text-gray-700 text-sm">
        Search for 99 dishes
      </h1>
    </div>

    {/* Search Input */}
    <div className="relative w-full p-4 font-medium text-gray-700 bg-white ">
      <div className="relative w-full md:w-[500px] mx-auto">
        <input type="text"  placeholder="Search for 'food or restaurant'"
          value={searchTerm} onChange={handleSearch}
          className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white border
           border-gray-300 outline-none" />
        <FiSearch className="text-gray-600 absolute left-2.5 top-6 
            transform -translate-y-1/2" size={18}  />

         {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-2 bg-white
            z-[1000] max-h-[80vh] overflow-y-auto scrollbar-hide">
            {suggestions.map((s, index) => (
            <li key={index} onClick={() => {
                  setSearchTerm(s.name); 
                  setIsSearch(false);
                  setSuggestions([]); 
                }}
                className="px-3 py-2 cursor-pointer flex items-center gap-4" >
                <img src={s.image} alt="food" className='w-18 h-12 rounded-xl' />
                <p>{s.name}</p>
              </li>
            ))}
          </ul>
        )} 
      </div>
    </div>
  </div>

</div>



{/* Header */}

<div className="h-55 rounded-b-4xl relative z-0"
  style={{
    backgroundImage:
      "url('https://i.pinimg.com/736x/fc/f5/dc/fcf5dc2e37b8ab7071593435215a1eb5.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(90%)",
  }}
></div>


<div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
    ${showHeader ? "bg-transparent" : "bg-white shadow-md"}`}>
  <div className="relative w-full flex justify-between items-center p-4">
    <Link href="/Restaurents">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md cursor-pointer
          transition-colors duration-300
          ${showHeader ? "bg-black" : "bg-white"}`} >
        <IoIosArrowRoundBack
          size={28}
          className={`${showHeader ? "text-white" : "text-black"}`}
        />
      </div>
    </Link>

    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md cursor-pointer
        transition-colors duration-300
        ${showHeader ? "bg-black" : "bg-white"}`}
      onClick={() => {
        setIsSearch(true);
        setSearchTerm("");
        setSuggestions([]);
      }}
    >
      <CiSearch
        size={26}
        className={`${showHeader ? "text-white" : "text-black"}`}
      />
    </div>
  </div>
</div>






  
<div className="w-full h-full  border-b border-gray-200 mt-2">
<p className='text-start px-4 mt-4  text-sm font-extrabold text-gray-700'>
  What’s on your mind?
</p>

<div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-hide bg-white">
  {foodSubHeader && foodSubHeader.filter((v, i, arr) => arr.findIndex((x) => x.name === v.name) === i )
    .map((value, i) => (
      <div key={value._id || i} className={`flex flex-col items-center gap-2 min-w-[80px]
         cursor-pointer`} 
         onClick={(e) => handleSubHeader(e, value, i)} >
         <div className={`relative w-13 h-13 rounded-full overflow-hidden shadow-md
            ${subHeader === i ? 'border-2 border-orange-700 p-1' : 'border-none'}`}>
          <img src={value.image} alt={value.name}
            className="w-full h-full object-cover rounded-full"/>
        </div>
        <p className={`text-xs truncate whitespace-nowrap text-center font-bold
            ${subHeader === i ? 'text-orange-700' : 'text-gray-700'}`}>
          {value.name}
        </p>
      </div>
    ))}
</div>


{/* Ended Filter */}
</div>




{/* Start FIlter */}
 <div className="flex items-center gap-3 overflow-x-auto px-2 py-2 scrollbar-hide">

    <div className={`flex items-center gap-1 px-6 py-1.5  rounded-lg  shadow-sm whitespace-nowrap 
        cursor-pointer ${FoodType === 'All' ? 'border border-orange-700 text-orange-500':
        'border border-gray-400 text-gray-800'}`}>
        <p className="text-sm font-medium"
        onClick={() => { setFoodType('All'); setSubHeader('') }}>All</p>
      </div>



    <div className="flex items-start gap-1 px-3 py-2 rounded-xl border border-gray-400 ">
      <span className="text-gray-600 text-sm font-medium">Veg</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox"  className="sr-only peer"
          checked={FoodType === 'All restaurants' || FoodType === 'Pure veg restaurants only'}
          onChange={() => { setFoodType(
              FoodType === 'All restaurants' || FoodType === 'Pure veg restaurants only'
                ? 'All' : 'All restaurants' );
                setSubHeader('') }}/>
        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition duration-300"></div>
        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></div>
      </label>
    </div>


    {/* NonVeg Filter */}
    <div className={`flex items-center gap-1 px-4 py-1.5 border border-gray-400 rounded-lg 
    shadow-sm cursor-pointer hover:shadow-md transition`}>
      <span className="text-gray-600 text-sm font-medium">NonVeg</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={FoodType === 'NonVeg'}
            onChange={() =>  {
              setFoodType(FoodType === 'NonVeg' ? 'All' : 'NonVeg');
              setSubHeader('') }
              }/>
        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition duration-300"></div>
        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></div>
      </label>
    </div>

</div>
{/* Ended Filter */}



{/***********************  started all food items  *******************************/}
{!loading && filterLoader ? (
  <>
  <div className="w-full md:w-11/12 mx-auto px-2 mt-4 grid grid-cols-2 gap-4">
  {[...Array(6)].map((_, i) => (
    <div key={i} className="bg-white rounded-xl shadow-sm flex flex-col items-center p-2" >
    
      <div className="w-full h-36 rounded-xl overflow-hidden mb-2">
        <Skeleton height="100%" width="100%" borderRadius="1rem" />
      </div>
      <div className="w-full text-center mb-2">
        <Skeleton height={20} width="60%" className="mx-auto" />
      </div>
      <div className="w-full flex justify-between items-center mt-1 px-2">
        <div>
          <Skeleton height={18} width={40} />
        </div>
        <div>
          <Skeleton height={28} width={50} borderRadius="12px" />
        </div>
      </div>
    </div>
  ))}
</div>
  </>
):(
<div className="p-2 bg-gray-50 min-h-screen">

{restaurants && restaurants.map((restaurant) => (
  <div key={restaurant._id} className="mb-10 bg-white rounded-2xl p-3"  >

    <div className="grid grid-cols-2 gap-4">
        {subFoodCategory ?.filter((item) => item.restaurant === restaurant._id)
          .map((item) => (
            <div  key={item._id} className="bg-white rounded-xl  p-2"  >

            <div className="w-full h-[130px] rounded-lg overflow-hidden mb-2">
               <img src={item.image} alt={item.name}
                  className={`w-full h-full object-cover ${
                    restaurant.isAcceptingOrders ? "brightness-100" : "filter grayscale brightness-75"
                  }`}
                />
              </div>

          
         <h1 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h1>
           <p className="text-xs text-gray-500 mt-0.5">{item.foodType}</p>

            <div className="flex justify-between items-center mt-3">
                <h1 className="text-base font-bold text-gray-900">
                  ₹{item.price - (item.Discount || 0)}
                </h1>

                {/* Counter OR Add Button */}
                {itemsState[item._id]?.count > 0 ? (
                  <div className="flex items-center border border-gray-300 rounded-full py-1 px-2
                   bg-white shadow-sm">
                    <button className="text-green-700 font-bold text-lg"
                      onClick={() => handleDecrease(item._id)} >
                      <TiMinus />
                    </button>

                    <span className="w-6 text-center text-green-700 font-semibold">
                      {itemsState[item._id]?.count}
                    </span>

                    <button className="text-green-700 font-bold text-lg "
                      onClick={() => handleIncrease(item._id)}   >
                      <GoPlus />
                    </button>
                  </div>
                ) : (
                  restaurant.isAcceptingOrders && (
                    <button className="text-green-700 border border-green-600 px-3 py-1
                     rounded-full text-sm font-semibold"
                      onClick={() => handleAddClick(item._id, item.name, item.price)}  >
                      Add
                    </button>
                  )
                )}
              </div>
               <div className="flex justify-between items-center">
                  <h2 className="text-gray-900 mt-4 capitalize truncate ">
                   {restaurant.business_name}
                 </h2>
                <h2 className="text-xs text-gray-500 mt-4">
                  <span className="font-semibold">30-40</span>mins</h2>
               </div>
                <hr className="mt-2 border-gray-300" />
            </div>
            
          ))}
      </div>

     
    </div>
  ))}

</div>

)}

{/**************************  Ended food items  ********************************/}


{/* start footer  */}
  <div className="w-full bg-gray-100 flex flex-col items-center justify-center h-80 p-6 text-center">
    <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
      Taste the Magic!
    </h1>
    <p className="text-lg text-gray-600">
      Made with <span className="text-red-500">❤️</span> in Suri, India
    </p>
  </div>
{/* end footer */}




{/* Bottom View Cart Bar */}
{totalItems && totalItems > 0 && (
  <AddCardItem totalItems={totalItems}   handleViewClick = {handleViewClick}/>
)}

{isViewClick && ( <ViewCardItem isViewClick={isViewClick} setIsViewClick={setIsViewClick}/>)}



{/***********************  OPENDED VIEW CARD ERROR   ****************************/}
{addItemError && (
  <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
)}

{/* Modal Container */}
<div className={`fixed left-1/2 top-1/3 w-80 max-w-[90%] bg-white rounded-3xl shadow-2xl 
 z-100 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out
  ${addItemError ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>

  {/* Header */}
  <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
    <h2 className="font-extrabold text-xl text-gray-900">Replace cart item ?</h2>
    <RxCross2 size={24} className="cursor-pointer text-gray-700"
      onClick={() => setAddItemError('')}/>
  </div>


  <div className="px-2 py-2  text-center">
    <p className="font-medium text-sm text-gray-800">
      Your cart contains dishes from 
       <span className="font-bold text-black ml-1 text-sm">{addItemError.toUpperCase()}</span>
      .Do you want to discard the selection and add dishes from
       <span className="font-bold text-black ml-1 text-sm">
      {restaurantDetails && restaurantDetails.business_name.toUpperCase()}
      </span>
    </p>
  </div>

 
  <div className="px-4 pb-3 flex py-2 gap-6">
   <button className="w-full bg-orange-200 text-orange-700 font-semibold py-2
    rounded-2xl shadow-md cursor-pointer"
    onClick={() => setAddItemError('') }>  No 
    </button>

    <button className="w-full bg-orange-700 text-white font-semibold py-2
    rounded-2xl shadow-md cursor-pointer"
      onClick={handleReplaceCard}> Replace 
    </button>

 
   
  </div>
</div>


{/***********************  ENDED VIEW CARD ERROR   ****************************/}

</div>
</div>
        </>
    )
}



export default NinetiNinePage;