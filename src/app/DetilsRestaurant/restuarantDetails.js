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
import { IoIosTime } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 

import AddCardItem from '../components/addCard';
import ViewCardItem from '../components/viewCard';


// 99 food items
const foodItems = [
    { id: 1, name: "apple", price: 99 },
    { id: 2, name: "guava", price: 99 },
    { id: 3, name: "banana", price: 99 },
    { id: 4, name: "lime", price: 99 },
    { id: 5, name: "orange", price: 99 },
    { id: 6, name: "sweets", price: 99 },
  ];


const RestaurantsDetails = () => {

  const searchParams = useSearchParams();
  const router = useRouter();

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isPastaOpen, setIsPastaOpen] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState('');
  const [recommended, setRecommended] = useState([]);
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
  const [foodItems, setFoodItems] = useState([]);

 // State: store all open category IDs
 const [openCategories, setOpenCategories] = useState([]);
 const categoryRefs = useRef({}); 
//  console.log('categoryRefs', categoryRefs)


const scrollToCategory = (id) => {
  const section = categoryRefs.current[id];
  if (section) {
    const offset = 180; // Adjust this value (height of fixed header or extra padding)
    const topPos = section.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: topPos,
      behavior: "smooth",
    });
  }
};


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
useEffect(() => {
  let throttleTimeout = null;

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos === 0) {
      setTimeout(() => setShowHeader(true), 100);
    } else if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
      setShowHeader(false);
    }

    setPrevScrollPos(currentScrollPos);
  };

  const throttledScroll = () => {
    if (throttleTimeout === null) {
      throttleTimeout = setTimeout(() => {
        handleScroll();
        throttleTimeout = null;
      }, 200); // <-- adjust throttle delay (200ms is good)
    }
  };

  window.addEventListener("scroll", throttledScroll);

  return () => {
    window.removeEventListener("scroll", throttledScroll);
    if (throttleTimeout) clearTimeout(throttleTimeout);
  };
}, [prevScrollPos]);





// open all food category default
useEffect(() => {
  if (foodCategory.length > 0) {
    setOpenCategories(foodCategory.map((cat) => cat._id));
  }
}, [foodCategory]);



const fetchAllCategory = async (id) => {
  try{
    const res  = await axios.get(`${apiUrl}/api/get-specific-restuarents-food/${id}`, 
                            {withCredentials:true } );
    console.log(res.data);
    setIsAcceptingOrders(res.data?.restaurantOwner?.isAcceptingOrders);
    setFoodCategory(res.data.foodCategories);
    // setAllFoodCategory(res.data.Categories);
  
    setSubFoodCategory(res.data.foodSubCategory);
    setAllSubFoodCategory(res.data.foodSubCategory);
    const NinetiNinePrice = res.data.foodSubCategory.filter((v) => {
      return 100 > v.price - (v.Discount || 0);
    })
    console.log('NinetiNinePrice', NinetiNinePrice);
    setFoodItems(NinetiNinePrice);
    
    foodItems
  }catch(err){
     console.log(err);
  }
}


 
// fetch recommandation resturants

// const fetchRecommandationRestuarants = async () => {
//   try{
//     const res =  await
//   }catch(err){
//     console.log(err);
//   }
// }


// find specific resturant 
useEffect(() => {
  const id = searchParams.get('id'); 
  const selectVegType = searchParams.get('selectVegType');
  console.log('selectVegType',selectVegType);

  if(selectVegType){
    setFoodType(selectVegType);
  }else{
    setFoodType('All');
  };

  if (!id) return;
  console.log(id);
    
  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/get-specific-restuarent/${id}`,
        {withCredentials:true}
      );
      setRestaurantDetails(res.data.restuarent);
      setRecommended(res.data.recommendedRestaurants);
      console.log(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

    fetchRestaurant();
    fetchAllCategory(id);
}, [searchParams]);



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
    else if (FoodType === '300-600') {
      filtered = allSubFoodCategory.filter((v) => v.price >= 300 && v.price <= 600);
    }
    else if (FoodType === 'less 300') {
      filtered = allSubFoodCategory.filter((v) => v.price <= 300);
    }
     
    else {
      filtered = allSubFoodCategory;
    }

    setSubFoodCategory(filtered);
    setFilterLoader(false);
  }, 1000); // 0.5 sec delay so loader works properly

}, [FoodType]);



// Toggle function
const toggleCategory = (categoryId) => {
  if (openCategories.includes(categoryId)) {
    // Close it
    setOpenCategories(openCategories.filter((id) => id !== categoryId));
  } else {
    // Open it
    setOpenCategories([...openCategories, categoryId]);
  }
};




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



// console.log(showCounter);

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

const handleSearch = (e) => {
  e.stopPropagation();
  setSearchTerm(e.target.value);
};


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



// console.log('itemsState', itemsState);
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
          <div className="flex-3 rounded-2xl">
            <Skeleton height={45} width="100%" />
          </div>
          <div className="flex-1 rounded-2xl">
            <Skeleton height={48} width="100%" />
          </div>
        </div>
      </div>

      {/* Sub header items */}
      <div className="w-full bg-gray-200  px-2 mt-2 rounded-2xl mb-1">
         <Skeleton height={45} width="100%"  />
      </div>

      {/* Deals / Offers */}
      <div className="w-full bg-gray-200 flex items-center justify-between px-2 mt-2 gap-2 pb-4">
        <div className="w-full rounded-2xl">
          <Skeleton height={82} width="100%" />
        </div>
        <div className="w-full rounded-2xl">
          <Skeleton height={82} width="100%" />
        </div>
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
    <div className="w-full md:w-1/2 mx-auto px-2 grid grid-cols-1 gap-6 mt-4">
        <Skeleton height={22} width={230} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl flex items-start gap-4 p-2">
            <div className="w-38 h-44 rounded-xl overflow-hidden flex-shrink-0">
              <Skeleton height="100%" width="100%" borderRadius="1rem" />
            </div>
            <div className="flex flex-col justify-between flex-1 gap-2 mt-4">
              <Skeleton height={20} width="90%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={18} width="80%" />
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
        
 <div
  className="h-55 rounded-b-4xl relative overflow-hidden"
  style={{
    backgroundImage:
      "url('https://img.freepik.com/premium-vector/hand-drawn-indian-food-illustration_98292-44034.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(95%)', // slightly darker for contrast
  }}
>
 
  <Link href={'/Restaurents'}>
    <div className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center
                    bg-black bg-opacity-50 rounded-full shadow-md cursor-pointer">
      <IoIosArrowRoundBack size={28} className="text-white" />
    </div>
  </Link>

  <div className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center
                  bg-black bg-opacity-50 rounded-full shadow-md cursor-pointer">
    <FaCircleUser size={28} className="text-white" />
  </div>


{/* Restaurant info card */}
<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md
                bg-black/80 backdrop-blur-md rounded-3xl p-5 shadow-2xl flex justify-between items-center">
  
  {/* Left: Restaurant details */}
  <div className="flex flex-col justify-start items-start">
    <h1 className="font-extrabold text-2xl text-white capitalize">
      {restaurantDetails?.business_name}
    </h1>
    <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
      <div className="flex items-center gap-1">
        <IoIosTime size={14} /> <span>30-50 min</span>
      </div>
      <span>•</span>
      <div className="flex items-center gap-1">
        <CiLocationOn size={14} /> <span>Suri</span>
      </div>
    </div>
  </div>

  {/* Right: Rating */}
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">
      <span className="font-semibold text-sm">{4.2}</span>
      <IoIosStar size={14} />
    </div>
    <p className="text-white/70 text-xs mt-1">30 ratings</p>
  </div>
</div>




</div>




<div className={`w-full  mx-auto z-30 bg-white transition-all duration-300
  ${showHeader ? 'sticky top-0' : 'fixed top-0 md:w-1/2 shadow-md'}`}>
       
    <div className="w-full h-full  border-b border-gray-200">
        
     <div className="p-2 relative w-full md:w-[500px] mt-3 ">
         <input type="text" placeholder="Search for 'Foods'"
         value={searchTerm} onChange={handleSearch}
          className="shadow w-full pl-10 pr-4 p-2.5 md:py-3 rounded-2xl
         bg-gray-300 outline-none placeholder:text-lg" />
         <FiSearch className="text-gray-600 absolute left-5 top-1/2 transform -translate-y-1/2" size={20} />
      </div>
   
        {/* end search bar */}


       

{/* Start FIlter */}
 <div className="flex items-center gap-3 overflow-x-auto px-2 py-2 scrollbar-hide">

 <div className={`flex items-center gap-1 px-4 py-1.5  rounded-lg  shadow-sm whitespace-nowrap 
    cursor-pointer ${FoodType === 'All' ? 'border border-orange-700 text-orange-500':
    'border border-gray-400 text-gray-800'}`}>
    <p className="text-sm font-medium"
    onClick={() => setFoodType('All')}>All</p>
  </div>



<div className="flex items-start gap-1 px-3 py-2 rounded-xl border border-gray-400 ">
  <span className="text-gray-600 text-sm font-medium">Veg</span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox"  className="sr-only peer"
      checked={FoodType === 'All restaurants' || FoodType === 'Pure veg restaurants only'}
      onChange={() => setFoodType(
          FoodType === 'All restaurants' || FoodType === 'Pure veg restaurants only'
            ? 'All' : 'All restaurants' ) }/>
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
        onChange={() => setFoodType(FoodType === 'NonVeg' ? 'All' : 'NonVeg') }/>
    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition duration-300"></div>
    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></div>
  </label>
</div>


    
 <div className={`flex items-center gap-1 px-4 py-1.5  rounded-lg  shadow-sm whitespace-nowrap 
    cursor-pointer ${FoodType === '300-600' ? 'border border-orange-700 text-orange-500':
    'border border-gray-400 text-gray-800'}`}>
    <p className="text-sm font-medium"
    onClick={() => setFoodType('300-600')}>Rs. 300 - 600</p>
  </div>


  <div className={`flex items-center gap-1 px-4 py-1.5  rounded-lg  shadow-sm whitespace-nowrap 
    cursor-pointer ${FoodType==='less 300' ? 'border border-orange-700 text-orange-500':
    'border border-gray-400 text-gray-800'}`}>
    <p className="text-sm font-medium"
      onClick={() => setFoodType('less 300')}>Less than Rs. 300</p>
  </div>


  


</div>
{/* Ended Filter */}
</div>

</div>



{/* *************************************************************************************** */}

{/* started 99 food items */}
{!loading && filterLoader ? (<>
 {/* Deals / Offers */}
      <div className="w-full bg-gray-200 flex items-center justify-between px-2 mt-2 gap-2 pb-4">
        <div className="w-full rounded-2xl">
          <Skeleton height={88} width="100%" />
        </div>
        <div className="w-full rounded-2xl">
          <Skeleton height={88} width="100%" />
        </div>
      </div>
</>):(<div className="p-3 bg-gray-50 ">
  <div className="flex justify-between items-center mb-3 py-3">
    <h1 className="text-xl font-bold text-gray-900">99 Store</h1>
     <span onClick={() => setIsFoodOpen(!isFoodOpen)}>
      {isFoodOpen ? (<FaAngleUp size={28}  className="text-gray-600 cursor-pointer" />
          ) : (
         <IoIosArrowDown size={28} className="text-gray-600 cursor-pointer" />)}
        </span>
      </div>

  {/* Food Items */}
   {isFoodOpen && (
     <div className="w-full overflow-x-auto py-1 scrollbar-hide">
        <div className="flex gap-4 w-max">
         {foodItems.map(({ _id, name, price,image, Discount }) => (
         <div  key={_id} className="w-[160px] flex-shrink-0 bg-white rounded-2xl shadow-md
           p-2 cursor-pointer" >

          <div className="w-full h-[130px] overflow-hidden rounded-xl">
            <img src={image && image}
                 alt={name} className={`w-full h-full object-cover
                 ${isAcceptingOrders ? 'brightness-100':'filter grayscale brightness-75'} `} />
          </div>

          <h1 className="mt-2 font-semibold text-gray-900 text-sm truncate px-1">{name}</h1>

         <div className="flex justify-between items-center mt-2">
           <h1 className="text-green-700 font-bold text-sm">₹{price - Discount || 0}</h1>

            {/* {showCounter[_id] ? ( */}
           { itemsState[_id]?.count > 0 ?(
              <div className="flex items-center border border-gray-300 rounded-full px-1 py-1
               bg-white shadow-sm">
               <button className="text-green-700 font-bold"
                 onClick={() => handleDecrease(_id)} >
               <TiMinus /></button>

              <input type="tel" value={itemsState[_id]?.count || 1} readOnly
               className="w-8 text-center outline-none text-green-700 font-semibold" />

                <button className="text-green-700 font-bold text-lg px-1"
                  onClick={() => handleIncrease(_id)} >
                  <GoPlus />
               </button>
             </div>
             ) : (
                isAcceptingOrders && (
              <button className="flex justify-center items-center text-green-700 border
                 border-green-600 px-5 py-1 rounded-full font-semibold  transition"
                 onClick={() => handleAddClick(_id, name, price)} >Add</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    
    </div>)}

{/* ended food items */}









{/***********************  started all food items  *******************************/}
{!loading && filterLoader ? (
  <>
   <div className="w-full md:w-1/2 mx-auto px-2 grid grid-cols-1 gap-6 mt-4">
        <Skeleton height={22} width={230} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl flex items-start gap-4 p-2">
            <div className="w-38 h-44 rounded-xl overflow-hidden flex-shrink-0">
              <Skeleton height="100%" width="100%" borderRadius="1rem" />
            </div>
            <div className="flex flex-col justify-between flex-1 gap-2 mt-4">
              <Skeleton height={20} width="90%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={18} width="80%" />
            </div>
          </div>
        ))}
    </div>

  </>
):(
  <div className="p-2 bg-gray-50 min-h-screen">
    {foodCategory && foodCategory.map((v) => (
    <div key={v._id} className="mb-6 bg-white rounded-2xl  overflow-hidden border
      border-gray-100 " ref={(el) => (categoryRefs.current[v._id] = el)}> 
            
    <div className="flex justify-between items-center px-4 py-3 cursor-pointer"
        onClick={() => toggleCategory(v._id)} >

    <h1 className="text-lg font-bold capitalize text-gray-800 tracking-tight">{v.name}</h1>

    <span className="flex items-center">
        {openCategories.includes(v._id) ? (
        <FaAngleUp size={28} className="text-gray-500" />
        ) : (
        <IoIosArrowDown size={28} className="text-gray-500" />
      )}
    </span>
</div>

 {/* Expanded Food Items */}
{openCategories.includes(v._id) && (
<div className="w-full py-3 border-t border-gray-200 bg-gray-50">
 <div className="flex flex-col gap-4 w-full">
  {subFoodCategory ?.filter((f) => f.FoodCategory === v._id).map((value) => (
   <div key={value._id} className="flex items-start justify-between bg-white rounded-2xl 
    shadow-sm p-3 border border-gray-100 " >

    {/* Food Image */}
   <div className="w-[120px] h-[110px] flex-shrink-0 overflow-hidden rounded-xl">
    <img src={value.image} alt={value.name} className={`w-full h-full object-cover
       ${isAcceptingOrders ? 'brightness-100':'filter grayscale brightness-75'} `}/>
  </div>

    {/* Right side: Details + Actions */}
    <div className="flex flex-col justify-between flex-1 ml-4 mt-1">
     <div>
      <h1 className="text-base font-bold text-gray-900 leading-snug">
        {value.name}
      </h1>
      <p className="text-sm text-gray-500 mt-1">{value.foodType} </p>
       {value.Discount > 0 && (
         <p className="text-xs text-green-700 font-semibold mt-1">
              {value.Discount}% OFF
              </p>
       )}
      </div>

      {/* Add / Counter Buttons */}
  <div className="flex justify-between items-center mt-3">
    <h1 className="text-lg font-extrabold text-gray-800">₹{value.price - value.Discount || 0}</h1>

    {itemsState[value._id]?.count > 0 ? (
      <div className="flex items-center border border-gray-300 rounded-full py-1 bg-white shadow-sm">
        <button className="text-green-700 font-bold text-lg px-2"
          onClick={() => handleDecrease(value._id)} >
          <TiMinus />
        </button>

        <input type="tel" value={itemsState[value._id]?.count} readOnly
          className="w-8 text-center outline-none text-green-700 font-semibold" />

        <button className="text-green-700 font-bold text-lg px-2 hover:text-green-800"
          onClick={() => handleIncrease(value._id)} >
          <GoPlus />
        </button>
      </div>
    ) : (
      isAcceptingOrders && (
        <button className="text-green-700 border border-green-600 px-6 py-1.5 rounded-full
        font-semibold ml-2" onClick={() => handleAddClick(value._id, value.name, value.price)} >
          Add
        </button>
      )
    )}
  </div>


     </div>
    </div>
  ))}
  </div>
  </div>
  )}
</div>
  ))}
</div>
)}


{/**************************  Ended food items  ********************************/}






{/* recommendation system */}

<div className="p-3 bg-gray-200">
  <div className="flex justify-start text-start items-center">
    <h1 className=" text-sm font-bold text-gray-800">TRY THESE FEATURED RESTAURANTS!</h1>
  </div>


 <div className="w-full overflow-x-auto  scrollbar-hide border-b border-gray-300 mt-2">
    <div className="flex gap-3 w-max">
      {recommended && recommended.map((value, i) => (
        <div key={i} className="w-[160px] flex-shrink-0">
          <div className="relative w-40 h-42 rounded-2xl overflow-hidden
              shadow-md cursor-pointer group">
             
         <img src="https://images.archanaskitchen.com/images/recipes/world-recipes/pizza-recipes/No_Yeast_Thin_Crust_Veggie_Pizza_Recipe_1_0359f3d67b.jpg"
                 alt="Restaurants"
            className="w-full h-full object-cover" />
           
       <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:shadow-md">
             <FiBookmark size={18}
              className="text-gray-700 hover:text-rose-500 transition"/>
          </button>
           
           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent
            px-1.5 py-2">
              <p className="text-white text-lg font-bold">FLAT DEAL</p>
              <p className="text-white text-lg font-bold">₹189 OFF</p>
              <span className="text-gray-200 text-xs font-bold">above ₹599</span>
              </div>
          </div>

        <div className='px-1 flex flex-col justify-start text-start '>
          <h1 className='font-bold text-[16px] uppercase'>{value.restaurant.business_name}</h1>
          <p className='font-bold text-xs'>4.2 (1.2k+) . 40-50 mins</p>
          <span className='text-gray-700 font-medium text-xs'>pasta, burgers, chiness...</span>
          {/* <p className='text-gray-700 font-medium'>{value.location}, {value.distance}</p> */}
       </div>

          </div>
        ))}
      </div>
    </div>

</div>

{/* ended recommendation system */}




{/* disclaimers */}
<div className="p-4 flex flex-col justify-start text-start ">
  <h1 className="font-semibold text-gray-700 mt-2 mb-2">Disclaimers:</h1>
  <p className="flex  gap-2 text-sm py-1"><TbPointFilled size={25}/>
  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, doloremque.</span></p>

   <p className="flex  gap-2 text-sm py-1"><TbPointFilled size={25}/>
  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, doloremque.</span></p>

   <p className="flex  gap-2 text-sm py-1"><TbPointFilled size={25}/>
  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, doloremque.</span></p>

   <p className="flex  gap-2 text-sm border-b border-gray-400 mb-3 py-1"><TbPointFilled size={25}/>
  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, doloremque.</span></p>


<div className=" border-gray-400 mb-2" >
  <p className="flex justify-between items-center">
    <p className="flex items-center gap-1"><MdOutlineReport size={20}/> <span>Report on issue with the the menu</span></p>
     <MdArrowRight size={25}/>
    </p>
</div>

</div>


{/* end disclaimers */}



{/* Bottom View Cart Bar */}
{totalItems && totalItems > 0 && (
  <AddCardItem totalItems={totalItems}   handleViewClick = {handleViewClick}/>
)}

{isViewClick && ( <ViewCardItem isViewClick={isViewClick} setIsViewClick={setIsViewClick}/>)}



{/* ********************************  Menu Button    ***************************** */}
<div className="bg-black text-white fixed w-15 h-15   bottom-22 right-4 p-3 md:p-3
   rounded-full z-50 shadow-sm">

    <div className="flex justify-center items-center px-2 flex-col cursor-pointer"
     onClick={() => { setOpenMenu(!openMenu); setAddItemError('') }}>
     <RiBookOpenLine size={18} className="text-white"/>
      <span className="text-sm font-medium">Menu</span>
    </div>
  </div>
 




{/* opended menu */}
{openMenu && (<div className="fixed inset-0 z-40 transition-opacity duration-300 cuisines"
    onClick={() => setOpenMenu(false)}  />)}

{openMenu && (
  <div className={`fixed bottom-10 right-4 w-[75%] md:w-[400px] h-[35%]
    bg-black rounded-2xl z-50 transform transition-transform duration-500 ease-in-out
    ${openMenu ? 'translate-y-0' : 'translate-y-full'}`} >
 
   <div className="p-3 flex justify-between items-center border-b border-gray-600">
    <h1 className="text-2xl font-bold text-white">Menu</h1>
    <RxCross2 size={22} className="cursor-pointer text-white"
        onClick={() => setOpenMenu(false)} />
    </div>

  
 <div className="w-full px-5 pb-4 flex flex-col justify-start overflow-y-auto custom-scroll
          h-[calc(100%-60px)]">

{foodCategory &&
  foodCategory.map((category, i) => {
   const relatedSubs = subFoodCategory?.filter((sub) => sub.FoodCategory.includes(category._id)) || [];

    return (
      <div key={i} className="mt-5">
        <div className="flex justify-between  text-gray-100 font-semibold cursor-pointer"
        onClick={() => {
          console.log(category.name);
           scrollToCategory(category._id);
           setOpenMenu(false);
          }}>
          <h1>{category.name}</h1>  
          <p>{relatedSubs.length}</p>
        </div>

      </div>
      );
    })}
</div>




  </div>
)}




{/* ****************************** Ended Menu Button **************************************** */}






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



export default RestaurantsDetails;