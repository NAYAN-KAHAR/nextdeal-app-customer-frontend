'use client';
import { FiSearch } from 'react-icons/fi';
import { FaCircleUser } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa6";
import { CiFilter } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { TiMinus } from "react-icons/ti";

import { IoIosArrowDown, IoIosArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiBookmark } from "react-icons/fi"; // or any other icon you prefer
import { AiFillStar } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 
import AddCardItem from '../components/addCard';
import ViewCardItem from '../components/viewCard';
import Loader from '../components/loader';


const foodCategories = [
  {
    name: "Pizza",
    image: "https://b.zmtcdn.com/data/pictures/chains/3/143/ce0341e58cf96f163101b4dff77ed938.jpg"
  },
  {
    name: "Burger",
    image: "https://www.foodandwine.com/thmb/XE8ubzwObCIgMw7qJ9CsqUZocNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg"
  },
  {
    name: "Biryani",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTajz7dRbTo3giRInUr6Xvw9BaDAtK3MK6GA&s"
  },
  {
    name: "Salad",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmglESoehFJXMDr2mNvtBQVVu4W5RkEs3XuA&s"
  },
  {
    name: "Desserts",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpR7Ebfhvn1Bdu6TlQd_hrgExg2lbDDSYlQ&s"
  },
  {
    name: "Ice Cream",
    image: "https://www.nestleprofessional.in/sites/default/files/2024-10/Coconut-Ice-cream-756x471_5_11zon.jpg"
  },
  {
    name: "N Indian",
    image: "https://www.nestleprofessional.in/sites/default/files/2024-10/Coconut-Ice-cream-756x471_5_11zon.jpg"
  },
  {
    name: "S Indian",
    image: "https://www.nestleprofessional.in/sites/default/files/2024-10/Coconut-Ice-cream-756x471_5_11zon.jpg"
  },
  {
    name: "Chinese",
    image: "https://www.nestleprofessional.in/sites/default/files/2024-10/Coconut-Ice-cream-756x471_5_11zon.jpg"
  }
   
];

const cuisines = [
  "Indian",
  "North Indian",
  "South Indian",
  "Punjabi",
  "Bengali",

  "Biryani",
  "Chinese",
  "Fast Food",
  "Street Food",
  "Snacks",
  "Desserts",

  "Breakfast",
  "Lunch",
  "Dinner",

  "Beverages",
  "Ice Cream",
  "Cakes & Pastries"
];


const RestaurantsPage = () => {
    const [auth,setAuth] = useState(false);
    const [loading,setLoading] = useState(true);
    const [foodLoading, setFoodLoading] = useState(false);

    const [isFilter,setIsFilter] = useState(false);
    

    const [active, setActive] = useState('Sort');
    const [checkValue, setCheckValue] = useState('default');
    const [isCuisines, setIsCuisines] = useState(false);

    const [showHeader, setShowHeader] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [location, setLocation] = useState('');
    const [address, setAdress] = useState('');

    const [isVeg, setIsVeg] = useState(false);
    const [selectVegType, setSelectVegType] = useState('');
    const [vegOff, setVegOff] = useState(false);

    const [restaurantData, setRestaurantData] = useState([]);
    const [allRestuarentData, setAllRestuarentData] = useState([]);

    const [foodCategory, setFoodCategory] = useState([]);
    const [subFoodCategory, setSubFoodCategory] = useState([]);
    const [allFoodCategory, setAllFoodCategory] = useState([]);
    const [allSubFoodCategory, setAllSubFoodCategory] = useState([]);

    const [subHeader, setSubHeader] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [inputPopUp, setInputPopUp] = useState(false);
    const [isClickedSuggestion, setIsClickedSuggestion] = useState(false);

    const [totalItems, setTotalItems] = useState();
    const [cartItemsData, setCartItemsData] = useState();
    const [isViewClick, setIsViewClick] = useState(false);

    const [searchRestuarants, setSearchRestuarants] = useState([]);
    const [searchFoods, setSearchFoods] = useState([]);
    const [isDishes, setIsDishes] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [isAddClicked, setIsAddClicked] = useState(false);

    const [itemsState, setItemsState] = useState({});
    const [addItemError, setAddItemError] = useState('');
    const [showCounter, setShowCounter] = useState({});
    const [whichFilter, setWhichFilter] = useState('All');
    const [searchWhichFilter, setSearchWhichFilter] = useState('All');

    const [searchRestualtLoader, setSearchRestualtLoader] = useState(false);
    const [allFoods,setAllFoods] = useState([]);
    const router =  useRouter();


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


// fetch location Get user location
  // useEffect(() => {
  //   if (!navigator.geolocation) return;

  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => setLocation({
  //       lat: pos.coords.latitude,
  //       lng: pos.coords.longitude
  //     }),
  //     (err) => console.error("Geolocation error:", err)
  //   );
  // }, []);

  // // 2️⃣ Reverse geocode when location changes
  // useEffect(() => {
  //   if (!location) return;
  //   const { lat, lng } = location;

  //   fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("Full place details:", data);
  //       console.log("Address:", data.address);
  //     })
  //     .catch(err => console.error(err));
  // }, [location]);



// fetch location Get user location
// useEffect(() => {
//   if (!navigator.geolocation) return;

//   navigator.geolocation.getCurrentPosition(
//     (pos) => setLocation({
//       lat: pos.coords.latitude,
//       lng: pos.coords.longitude
//     }),
//     (err) => {
//       console.error("Geolocation error:", err);
//       if (err.code === 1) {
//         // Permission denied
//         setAdress(''); // Clear current address
//         alert('Location access denied. Please enter your address manually.');
//       }
//     }
//   );
// }, []);

// // Reverse geocode when location changes
// useEffect(() => {
//   if (!location) return;
//   const { lat, lng } = location;

//   fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
//     .then(res => res.json())
//     .then(data => {
//       if (data && data.display_name) {
//         setAdress(data.display_name);
//       } else {
//         setAdress('');
//       }
//     })
//     .catch(err => console.error(err));
// }, [location]);


// {!location && !address && (
//   <div className="manual-address">
//     <p>Enter your address:</p>
//     <input
//       type="text"
//       value={address}
//       onChange={(e) => setAdress(e.target.value)}
//       placeholder="Enter your location"
//     />
//   </div>
// )}

  
// lat:23.9057271,log:87.4961469,
// scroll stick bar logic here
useEffect(() => {
  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    // console.log(currentScrollPos);

    if (currentScrollPos === 0) {
      // At the very top of the page
      setTimeout(() =>setShowHeader(true), 200);
    } else if (currentScrollPos > prevScrollPos && currentScrollPos > 200) {
      // Scrolling down past threshold
      setShowHeader(false);
    }

    setPrevScrollPos(currentScrollPos);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [prevScrollPos]);



//  fetch all nearest restaurents
const fetchAllRestuarents = async () => {
  try {
    const lat = 23.9057271;
    const lng = 87.4961469; // use 'lng' to match backend
    const res = await axios.get(`${apiUrl}/api/get-all-nearest-restuarents?lat=${lat}&lng=${lng}`);
    // console.log('fetchAllRestuarents', res.data);
    setRestaurantData(res.data.restaurants);
    setAllRestuarentData(res.data.restaurants);
    setFoodCategory(res.data.Categories);
    setAllFoodCategory(res.data.Categories);

    setSubFoodCategory(res.data.SubCategories);
    setAllSubFoodCategory(res.data.SubCategories);

  } catch (err) {
    console.log(err);
  }
};




// // get all categories 
// const fetchAllCategory = async () => {
//   try{
//     const res  = await axios.get(`${apiUrl}/api/get-all-food-categories`, 
//                           {withCredentials:true } );
//     console.log('fetchAllCategory', res.data);

//     setFoodCategory(res.data.Categories);
//     setAllFoodCategory(res.data.Categories);

//     setSubFoodCategory(res.data.SubCategories);
//     setAllSubFoodCategory(res.data.SubCategories);

//   }catch(err){
//     console.log(err);
//   }
// }
 


useEffect(() => {
  fetchAllRestuarents();
  // fetchAllCategory();
},[]);

const handleAllButReset = () => {
  setFoodLoading(true); 
  // fetchAllCategory();
  fetchAllRestuarents();
  setWhichFilter('All');
  setSubHeader('')
  setTimeout(() =>  setFoodLoading(false), 500);
}

// Toggle Veg button
const handleVeg = async () => {
   setFoodLoading(true); 
  if (vegOff) {
    // If already ON, turn OFF and reset restaurants
    setVegOff(false);
    await new Promise((resolve) => setTimeout(resolve, 400)); 
    setRestaurantData(allRestuarentData);
    setFoodLoading(false);
  } else {
    // Turn ON, show modal
    setVegOff(true);
    setIsVeg(true);
    setFoodLoading(false);
  }
};

useEffect(() => {
  console.log('isVeg updated:', isVeg);
}, [isVeg]);




// handle filter Apply
const handleApplyFilter = () => {
    console.log('applyed');
    console.log(active, checkValue,);
    setTimeout(() => setIsFilter(!isFilter), 300);
}



// fetched restuarans based on veg and non veg
const selcetVegLogic = async (e) => {
  console.log('selectVegType', selectVegType);
  if(!selectVegType) return alert('please select one!')


  setTimeout(() => setIsVeg(false),100);
  setFoodLoading(true); 

  try{
 
    const res = await axios.get(`${apiUrl}/api/get-veg-nonveg-restuarents/
                 ${selectVegType}`, {withCredentials:true});
    console.log('veg/non restuarants',res.data);

    if(!res.data){
      setRestaurantData(allRestuarentData);
      setFoodLoading(false); 
      return;
    }
    console.log('allRestuarentData', allRestuarentData);
    
    const restaurantIds = [...new Set(res.data.restaurants.map((r) => r.restaurant?._id))];
    const filteredRestaurants = allRestuarentData.filter((r) =>
                              r?._id && restaurantIds.includes(r._id));

    await new Promise((resolve) => setTimeout(resolve, 400)); 

    console.log('filteredRestaurants', filteredRestaurants);
    setSubHeader('');
    setRestaurantData(filteredRestaurants);
    setFoodLoading(false);
    window.scroll(200,200);
  }catch(err){
    console.log(err);
  }
 
}

//  non -veg filter works logic
useEffect(() => {
  if (!selectVegType) return;
  selcetVegLogic();
}, [selectVegType]);


const handleNonVeg = (text) => {
  if (!text) return;
  setSelectVegType(text); 
  setWhichFilter('Non-Veg') 
};





// Handle sub header click (filter restaurants by selected category)
const handleSubHeader = async (e, value, i) => {
  e.stopPropagation();
  setSubHeader(i);
  setFoodLoading(true); 
  console.log("Clicked category:", value);

  if (!value) {
    setRestaurantData(allRestuarentData);
    setFoodLoading(false); 
    return;
  }
  setWhichFilter('');
  
  const filtered = allFoodCategory.filter((v) => v.name.toLowerCase() === value.name.toLowerCase());
  const restaurantIds = [...new Set(filtered.map((v) => v.restaurant))];
  const filteredRestaurants = allRestuarentData.filter((r) =>
    r?._id && restaurantIds.includes(r._id)
  );

   await new Promise((resolve) => setTimeout(resolve, 300)); 
  // console.log('subheader', filteredRestaurants);
  setRestaurantData(filteredRestaurants);
  setFoodLoading(false); 
  window.scroll(200,200);
  // console.log("filteredRestaurants:", filteredRestaurants);
};


// handle price high to low and low to high 
const handleRangePrice = async (query) => {
  console.log('query', query);
  setFoodLoading(true); 

  if (!query) {
    setRestaurantData(allRestuarentData);
    setFoodLoading(false); 
    return;
  }

    // Make a copy before sort
  let filterData = [...allSubFoodCategory];

  if (query === "High") {
    filterData.sort((a, b) => a.price - b.price); 
    setWhichFilter('High');  
  } else {
    filterData.sort((a, b) => b.price - a.price);  
    setWhichFilter('Low');
  }
  setSubHeader('');
  const RestuarantsId = [...new Set(filterData.map((v) => v.restaurant))];
  const filteredRestaurants = allRestuarentData.filter((v) => v?._id && RestuarantsId.includes(v._id));
  await new Promise((resolve) => setTimeout(resolve, 3000 ));
  console.log('filterData', filteredRestaurants);
  
  setRestaurantData(filteredRestaurants);
  setFoodLoading(false); 
 
};


// hanlde 299-599 and less then 299 price food restuarants
const handleLimitPrice = async (priceRange) => {
  console.log('priceRange', priceRange);
  setFoodLoading(true); 

  if (!priceRange) {
    setRestaurantData(allRestuarentData);
    setFoodLoading(false); 
    return;
  };
   // Make a copy before sort
  let filterData = [...allSubFoodCategory];

  if (priceRange === "less-299") {
    filterData = filterData.filter((value) => value.price <= 299 ); 
    setWhichFilter('299');  
  } else {
    filterData = filterData.filter((v) => v.price > 299 && v.price <= 599);  
    setWhichFilter('299-599');
  }
  setSubHeader('');
  const RestuarantsId = [...new Set(filterData.map((v) => v.restaurant))];
  const filteredRestaurants = allRestuarentData.filter((v) => v?._id && RestuarantsId.includes(v._id));
  await new Promise((resolve) => setTimeout(resolve, 3000 ));
  console.log('filterData', filteredRestaurants);
  
  setRestaurantData(filteredRestaurants);
  setFoodLoading(false); 


}



// Search logic with autocomplete
const handleSearch = (e) => {
  e.stopPropagation();
  const term = e.target.value.toLowerCase();
  setSearchTerm(term);
  console.log(searchTerm);

  if (term.trim() === "") {
    setSuggestions([]);
    return;
  }

  const filtered = allSubFoodCategory.filter((item) =>
    item.name.toLowerCase().includes(term)
  );

  // Remove duplicates based on 'name'
  // const uniqueFiltered = filtered.filter(
  //   (item, index, self) => index === self.findIndex((i) => i.name === item.name));

  const seen = new Set();
  const uniqueFiltered = filtered.filter(item => {
  if (seen.has(item.name)) return false;
     seen.add(item.name);
     return true;
 });

  setSuggestions(uniqueFiltered);
};


// get values from suggestion clicked
const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion.name);
    setSearchValue(suggestion.name);
    setSuggestions([]); 
    console.log('suggestion', suggestion);
    setIsClickedSuggestion(true);
    try{
      setSearchRestualtLoader(true);
      const res = await axios.get(`${apiUrl}/api/get-all-search-foods-restuarants/${suggestion.name}`
        , { withCredentials: true} );

      console.log(res.data);
      
      const filteredRestuarant = res.data.allRestuarants.filter(
        (item,index, self) => index === self.findIndex((i) => i._id === item._id)
      );
      console.log('filteredRestuarant', filteredRestuarant);
      setSearchRestuarants(filteredRestuarant);
      setSearchFoods(res.data.allSubFoods);
      setAllFoods(res.data.allSubFoods);
      
      setSearchRestualtLoader(false);

    }catch(err){
      console.log(err);
    }
  };

// empty values when input is empty
useEffect(() => {
  if (searchTerm === "" || !inputPopUp) {
    setSearchRestuarants([]);
    setSearchFoods([]);
    setSearchValue('');
    setSearchTerm('');
  }
}, [searchTerm, inputPopUp]);



useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/get-food-item-view-cards`, { withCredentials: true });
      const cartItems = res.data.cartItem || [];
      setCartItemsData(cartItems);
      // ALWAYS compute total count from backend — not from itemsState
      const totalCount = cartItems.reduce((acc, cur) => acc + (cur.count || 0), 0);
      setTotalItems(totalCount);

    } catch (err) {
      console.log(err);
    }
  };

  fetchCartItems();
}, [isViewClick]); 


// see view card all foods 
const handleViewClick  = (response) => {
  console.log(response);
  setIsViewClick(response);
}

// added food items to cards
const handleAddClick = async (id, name, price) => {
  if (addItemError) return;

  try {
    const newItem = { [id]: { name, price, count: 1 } };

    const res = await axios.post(`${apiUrl}/api/add-food-item-view-cards`, newItem,
      { withCredentials: true } );

    // Update UI locally
    setItemsState((prev) => ({
      ...prev,
      [id]: { name, price, count: 1 }
    }));

    setShowCounter((prev) => ({ ...prev, [id]: true }));
    await fetchCartItems(); 
  } catch (err) {
    console.log(err.response);
    if (
      err.response?.data?.error ===
      "You already have items from another restaurant. Please remove them before adding new items."
    ) {
      setAddItemError(err.response.data?.restaurantName?.business_name);
    }
  }
};



const handleIncrease = async (id) => {
  if (addItemError) return;

  setItemsState(prev => ({
    ...prev,
    [id]: { ...prev[id], count: (prev[id]?.count || 0) + 1 },
  }));

  try {
    await axios.post(`${apiUrl}/api/add-food-item-view-cards`, {
      [id]: { count: (itemsState[id]?.count || 0) + 1 }
    }, { withCredentials: true });

    fetchCartItems();

  } catch (err) {
    console.log(err.response);
  }
};


// minimise card logic here
const handleDecrease = async (id) => {
  if (addItemError) return;

  const currentCount = itemsState[id]?.count || 0;
  const newCount = currentCount - 1;

  // Update UI immediately
  setItemsState(prev => {
    const updated = { ...prev };

    if (newCount <= 0) {
      delete updated[id];
    } else {
      updated[id] = { ...updated[id], count: newCount };
    }
    return updated;
  });

  try {
    await axios.post(`${apiUrl}/api/add-food-item-view-cards`, {
      [id]: { count: Math.max(newCount, 0) }
    }, { withCredentials: true });

    // NOW fetch updated cart
    fetchCartItems();

  } catch (err) {
    console.log(err.response);
  }
};




// fetch all cards foods items
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
}, [inputPopUp]);




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


// handle filters buttons from search section modal
const handleFiters = (filter) => {
  setSearchWhichFilter(filter);

  // always start from master list
  let filtered = [...allFoods];

  if (filter === "Veg") {
    filtered = allFoods.filter(item => item.foodType === "Veg");
  }
  else if (filter === "Non Veg") {
    filtered = allFoods.filter(item => item.foodType === "Non Veg");
  }
  else if (filter === "Below Rs.300") {
    filtered = allFoods.filter(item => item.price <= 299);
  }

  setSearchFoods(filtered);
};




// console.log('isSort', isSort);
if (loading || !auth ) return (
  <>
    {/* Top Navbar Skeleton */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 gap-2 pb-4">
  
      <div className="w-full flex justify-between items-center gap-2">
         <div className="flex items-start justify-start flex-col">
          <Skeleton height={32} width={100} /> {/* Logo */}
          <Skeleton height={22} width={200} /> 
        </div>

          <Skeleton circle={true} height={44} width={44} /> 
        
      </div>

      <div className="w-full flex justify-between items-center gap-4">
        <div className="flex-3 rounded-2xl">
          <Skeleton height={45} width="100%" />
        </div>
        <div className="flex-1 rounded-2xl">
          <Skeleton height={48} width="100%" />
        </div>
      </div>


</div>


{/* sub header items */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 mt-2
    gap-2  pb-4">
  
   
    <div className="h-20 bg-gray-200 flex items-center justify-around  mt-4 gap-6">
      {Array(4).fill('').map((_, i) => (
        <div className="flex justify-start items-start gap-2 flex-col">
           <Skeleton key={i} circle={true} height={60} width={60} />
              <Skeleton height={22} width={70} /> 
        </div>
      ))}
    </div>
    
</div>


{/* nextdeal on more */}
<div className="w-full bg-gray-200 flex  items-center justify-between px-2 mt-2 gap-2  pb-4">
    <div className='w-full rounded-2xl'>  <Skeleton height={82} width="100%" /></div>
     <div className='w-full rounded-2xl'> <Skeleton height={82} width="100%" /> </div>
         
 </div>


{/* filters */}
<div className="w-full bg-gray-200 flex flex-col items-start justify-start px-2 mt-2 gap-2 pb-2 ">
  
    <div className=" bg-gray-200 flex items-center justify-around  mt-4 gap-6 pb-1">
      {Array(4).fill('').map((_, i) => (
        <div className="flex justify-start items-start gap-2 flex-col">
           <Skeleton key={i} height={38} width={85} />
             
        </div>
      ))}
    </div>
    
</div>


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
<div className="w-full flex flex-col z-10 relative overflow-y-auto no-scrollbar">

  <div className="text-center w-full md:w-1/2 flex flex-col max-w-4xl mx-auto ">
   <div className='flex justify-between items-center p-2'>
      <div>
        <h1 className='flex items-center gap-2'>
            <FaLocationArrow size={27} className='text-rose-600' />
            <span className='font-bold text-lg'>Locating...</span>
         </h1>
       <p className='text-sm px-3 font-semibold text-gray-600'>Oxford United Kingdom</p>
      </div>
     <div> <FaCircleUser size={33} className='text-gray-600 cursor-pointer' /> </div>
 </div>
               

{/* input fields with filter bar */}
{inputPopUp && (
  <div className="fixed inset-0 z-[998] bg-black/60 transition-opacity duration-300"
    onClick={() => setInputPopUp(false)} />)}


{/* <div className={`fixed top-0 left-0 w-full bg-[#F1F0F5] z-[999] scrollbar-hide pb-2
    transform transition-all duration-500 ease-in-out
    ${inputPopUp ? 'translate-y-0' : '-translate-y-full'}
    // ${suggestions.length > 0 ? 'h-full' : 'h-[20%]'}
      ${searchTerm  ? 'h-screen' : 'h-[20%]'} `}> */}

<div className={`fixed top-0 left-0 w-full bg-[#F1F0F5] z-[999] scrollbar-hide pb-2
  transform transition-all duration-500 ease-in-out 
  ${inputPopUp ? 'translate-y-0' : '-translate-y-full'}
  ${inputPopUp && (searchTerm || suggestions.length > 0) ? 'h-screen' : 'h-[20%]'}
  overflow-y-auto`}>

  {/* Sticky Search Header Inside Popup */}
  <div className={`w-full mx-auto z-[1000] bg-white transition-all duration-300 
      ${inputPopUp ? 'sticky top-0' : 'fixed top-0 md:w-1/2 shadow-5xl'}  `}>

    <div className="relative flex items-center justify-center w-full text-center py-2 border-b
       border-gray-200 bg-white">
      <IoIosArrowRoundBack size={36} className="absolute left-3 cursor-pointer"
        onClick={() => setInputPopUp(false)} />
      <h1 className="font-bold text-gray-700 text-sm">
        Search for dishes & restaurants
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
              <li key={index} onClick={() => handleSuggestionClick(s)}
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


  {/* Search results and filters */}
  {isClickedSuggestion && searchTerm && (
    <>
     
      <div className='flex items-center gap-5 mb-2 pb-2 px-4 bg-white'>
        <h4  className={`font-bold cursor-pointer ${isDishes ? 'text-gray-700' : 'border-b-4 border-black text-gray-900'}`}  onClick={() => setIsDishes(false)}>
          Restaurants
        </h4>
        <h4 className={`font-bold cursor-pointer 
          ${isDishes ? 'border-b-4 border-black text-gray-900' : 'text-gray-700'}`}
          onClick={() => setIsDishes(true)} >  Dishes </h4>
      </div>

      {/* Filters */}
      {isDishes && (
        <div className='p-2 flex items-center gap-2 overflow-x-auto overflow-y-visible py-2.5 
        scrollbar-hide'>
          {["All", "Veg","Below Rs.300", "Non Veg",].map((filter, i) => (
            <div key={i} className={`flex items-center gap-1 px-3.5 py-1 border
            ${searchWhichFilter === filter ? 'border-orange-600 text-orange-500':'border-gray-400 text-black'} 
             rounded-lg shadow-sm whitespace-nowrap 
             cursor-pointer bg-white`} onClick={() => handleFiters(filter)}>
              <p>{filter}</p>
            </div>
          ))}
        </div>
      )}

      {isDishes && (
        <div className='py-2 text-start p-2 mb-2'>
          <h1 className='text-gray-700 font-extrabold'>
            Showing results for <span className='text-black ml-2'>{searchValue || "Unknown"}</span>
          </h1>
        </div>
      )}

      {/* Render All Restaurants */}
      {!isDishes && searchRestuarants?.length > 0
       && searchRestuarants.map((value, i) => (
        <div className='p-1 flex justify-between mt-3 bg-white' key={i}>
          <div className='px-2 flex justify-start gap-4 items-center p-2'>
            <Link href={`/DetilsRestaurant?id=${value._id}&selectVegType=${selectVegType}`}>
              <div className="relative w-33 h-37 rounded-2xl overflow-hidden shadow-md cursor-pointer group">
                <img src={value.image || "https://images.archanaskitchen.com/images/recipes/world-recipes/pizza-recipes/No_Yeast_Thin_Crust_Veggie_Pizza_Recipe_1_0359f3d67b.jpg"}
                  alt="Restaurant"
                  className={`w-full h-full object-cover transition duration-500
                    ${value.isAcceptingOrders ? 'brightness-100' : 'filter grayscale brightness-75'}`}
                />
                <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow">
                  <FiBookmark size={18} className="text-gray-700" />
                </button>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-1.5">
                  <p className="text-white text-lg font-bold">
                    {value.isAcceptingOrders ? "FLAT DEAL" : "Currently Not Accepting Orders"}
                  </p>
                  {value.isAcceptingOrders && (
                    <>
                      <p className="text-white text-lg font-bold">₹189 OFF</p>
                      <span className="text-gray-200 text-xs font-bold">above ₹599</span>
                    </>
                  )}
                </div>
              </div>
            </Link>

            <div className='flex flex-col text-start justify-start items-start'>
              <h1 className='font-extrabold capitalize'>{value.business_name}</h1>
              <p className='font-semibold text-sm'>{value?.rating} (1.2k+) . 20-30 Mins</p>
              <span className='text-gray-700 font-medium'>pasta, burgers, chinese...</span>
              <p className='text-gray-700 font-medium'>Suri, 1.2Km</p>
            </div>
          </div>
        </div>
      ))}


      {/* Render All Dishes */}
      {isDishes && (
        <div className="flex flex-col gap-6 overflow-y-auto pb-24 px-3 md:px-6 scrollbar-hide">
          {searchRestuarants?.length > 0 ? searchRestuarants.map((restaurant, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-start">
                  <h1 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
                    {restaurant.business_name || "Unknown"}</h1>
                  <p className="text-amber-600 text-xs font-semibold mt-0.5">Opens in 60 mins</p>
                </div>
                <IoArrowForward size={26} className="text-slate-500" />
              </div>

              <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 snap-x snap-mandatory scrollbar-hide">
                {searchFoods.filter(f => f.restaurant._id === restaurant._id).map((v, i) => {
                 return <div key={i} className="min-w-[90%] bg-white border border-slate-300 
                  rounded-2xl p-3 flex-shrink-0 snap-start">
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h2 className="text-slate-800 font-semibold text-base">{v.name}</h2>
                          <p className={`text-xs mt-0.5 font-medium ${v.foodType === "Veg" ? "text-green-600" : "text-red-500"}`}>
                            {v.foodType}
                          </p>
                        </div>
                        <div className="relative w-30 h-25 shrink-0">
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover rounded-lg shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-[1.03]" />
                          <span className={`absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded-md font-semibold text-white shadow-sm ${v.restaurant?.isAcceptingOrders ? "bg-green-500" : "bg-red-500"}`}>
                            {v.restaurant?.isAcceptingOrders ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>

            <div className="flex items-center justify-between">
               <div>
                 <p className="font-bold text-lg text-slate-900">₹{v.price}</p>
                   {v.Discount > 0 && (
                     <span className="text-xs bg-gradient-to-r from-orange-100 to-amber-50 text-orange-600 font-semibold px-2 py-1 rounded-md shadow-inner">
                       {v.Discount}% OFF
                       </span>
                   )}
                 </div>

              {itemsState[v._id]?.count > 0 ? (
               <div className="flex items-center border border-gray-300 rounded-2xl overflow-hidden px-2 py-0.5">
                 <button className="text-green-700 font-bold text-lg px-2 rounded-full"
                  onClick={() => handleDecrease(v._id)}><TiMinus /></button>

                <input type="tel" value={itemsState[v._id]?.count} 
                readOnly className="w-8 text-center outline-none text-green-700 font-semibold bg-transparent" />
                <button className="text-green-700 font-bold text-lg px-2
                 hover:bg-gray-100 rounded-full" 
                 onClick={() => handleIncrease(v._id)}><GoPlus />
                 </button>
                </div>
               ) : (
                <div className="flex w-30 justify-center items-center rounded-2xl overflow-hidden px-2 py-0.5 bg-green-700">
                   <button className="cursor-pointer text-white font-bold text-lg px-6"
                    onClick={() => handleAddClick(v._id, v.name, v.price)}>Add</button>
                  </div>
               )}
              </div>
            </div>
            </div>
} )}
              </div>
            </div>
          )) : <p className="text-gray-500 text-center w-full italic py-8">No foods found.</p>}
        </div>
      )}
    </>
  )}
</div>

{/* === Fixed components outside popup scroll === */}

{/* Add Card Item (Bottom) */}
{totalItems > 0 && (
  <div className="fixed bottom-2.5 left-0 w-full z-[1000] px-4">
    <AddCardItem totalItems={totalItems} handleViewClick={handleViewClick} />
  </div>
)}

{/* Error Modal (Center) */}
{addItemError && (
  <>
    <div className="fixed inset-0 z-[1050] bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
    <div className={`fixed top-1/2 left-1/2 w-80 max-w-[90%] bg-white rounded-3xl shadow-2xl 
      z-[1100] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out
      ${addItemError ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <h2 className="font-extrabold text-xl text-gray-900">Replace cart item?</h2>
        <RxCross2 size={24} className="cursor-pointer text-gray-700" onClick={() => setAddItemError('')} />
      </div>
      <div className="px-4 py-3 text-center text-gray-800 text-sm font-medium">
        Your cart contains dishes from{' '}
        <span className="font-bold text-black">{addItemError.toUpperCase()}</span>. Do you want to discard the selection and add dishes from <span className="font-bold text-black">Unknown</span>?
      </div>
      <div className="px-4 pb-4 flex gap-4">
        <button className="w-full bg-orange-200 text-orange-700 font-semibold py-2 rounded-2xl shadow-md" onClick={() => setAddItemError('')}>No</button>
        <button className="w-full bg-orange-700 text-white font-semibold py-2 rounded-2xl shadow-md" onClick={handleReplaceCard}>Replace</button>
      </div>
    </div>
  </>
)}







{/************************   ENDED SEARCH FOOD ITEM OF HOMEPAGE **************************/}


{/* Veg Restuarans modals */}
<div className={`w-full mx-auto z-30 bg-white transition-all duration-300
      ${showHeader ? 'sticky top-0' : 'fixed top-0 md:w-1/2 shadow-md'}`}>

 <div className="sticky top-0 z-40 bg-white p-2">
    <div className="max-w-4xl mx-auto flex md:justify-between items-center gap-2">
                            
    <div className="relative w-full md:w-[500px]">
      <input type="text" placeholder="Search for 'High Proteins'" readOnly
       onFocus={() =>setInputPopUp(true)}
       className="w-full pl-10 pr-4 p-3.5 md:py-3 rounded-2xl bg-gray-200 outline-none
        placeholder:text-lg"/>
      <FiSearch className="text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
   </div>

     {/* Veg Toggle */}
    <div className="flex items-center gap-1 px-2 py-1.5 bg-white border border-gray-300 rounded-xl shadow-sm flex-col">
      <span className="text-gray-600 text-sm font-bold">Veg</span>
       <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer"
          checked={vegOff} onChange={handleVeg} />
          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500
                      transition duration-300"> </div>
        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full
                transition peer-checked:translate-x-5">
        </div>
        </label>
  </div>
</div>




 </div>

{/*  Subheader / Categories what's you mind */}
<p className='text-start px-4 mt-4  text-sm font-extrabold text-gray-700'>
  What’s on your mind?
</p>

<div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-hide bg-white">
   {foodCategory &&  foodCategory.filter((v, i, arr) => arr.findIndex(
          (x) => x.name.toLowerCase() === v.name.toLowerCase()) === i )
    .map((value, i) => (
      <div key={value._id || i} className={`flex flex-col items-center gap-2 min-w-[80px]
         cursor-pointer`} onClick={(e) => handleSubHeader(e, value, i)} >
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



</div>





                
<h1 className="font-bold mt-6 px-4 text-lg text-start text-gray-700">More on NextDeal</h1>

  <div className="flex justify-between overflow-auto px-4 py-3 scrollbar-hide">
    <Link href={'/99Page'}  className="min-w-[140px] p-1 rounded-xl border border-gray-200 flex flex-col items-center cursor-pointer hover:shadow-md transition duration-200">
       <h2 className="text-xs text-gray-700 font-semibold text-center">99 STORE</h2>
       <p className="text-xs text-red-500 font-semibold text-center">MEAL AT 99</p>
       <img src="https://images.cnbctv18.com/uploads/2025/07/swiggy-99-store-2025-07-f7718ff6921cf737ca8e736ea3e4bd30.jpg?impolicy=website&width=400&height=225"
               className="w-full h-16 object-cover rounded-xl"
                     alt="99 store meal" />
</Link>

   {/* Combo Offer */}
   <div className="min-w-[140px] p-1 rounded-xl border border-gray-200 flex flex-col items-center  cursor-pointer hover:shadow-md transition duration-200">
     <h2 className="text-sm text-gray-700 font-semibold text-center">COMBO OFFER</h2>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKnO5GtRAAhkzlLuHNE_dZ4Sm-A6o1cjUROg&s" className="w-full h-16 object-cover rounded-xl" alt="Combo Offer" />
    </div>
 </div>
            


<div className={`flex items-center gap-3 overflow-x-auto overflow-y-visible px-3 py-2 scrollbar-hide`}>

   <div className={`flex items-center gap-1 px-6 py-1.5 border
   ${whichFilter === 'All' ? 'border-orange-600 text-orange-600':'border-gray-400 text-black'} 
   rounded-lg   shadow-sm whitespace-nowrap cursor-pointer`} 
     onClick={(e) => handleAllButReset() }>
        <p>All</p>
        
 </div>




<div className={`flex items-center gap-1 px-4 py-1.5 border
   ${whichFilter === 'Low' ? 'border-orange-600 text-orange-600':'border-gray-400 text-black'} 
   rounded-lg   shadow-sm whitespace-nowrap cursor-pointer`} 
    onClick={() => handleRangePrice('Low')}>
 <p>Low to High</p>
  </div>

 <div className={`flex items-center gap-1 px-4 py-1.5 border
   ${whichFilter === '299-599' ? 'border-orange-600 text-orange-600':'border-gray-400 text-black'} 
   rounded-lg   shadow-sm whitespace-nowrap cursor-pointer`}
      onClick={() => handleLimitPrice('299-599')}>
 <p>Rs. 299-599</p>
  </div>

 <div className={`flex items-center gap-1 px-4 py-1.5 border
   ${whichFilter === 'High' ? 'border-orange-600 text-orange-600':'border-gray-400 text-black'} 
   rounded-lg   shadow-sm whitespace-nowrap cursor-pointer`} 
    onClick={() => handleRangePrice('High')}>
   <p>High to Low</p>
</div>


<div className={`flex items-center gap-1 px-4 py-1.5 border
   ${whichFilter === 'less-299' ? 'border-orange-600 text-orange-600':'border-gray-400 text-black'} 
   rounded-lg   shadow-sm whitespace-nowrap cursor-pointer`}
    onClick={() => handleLimitPrice('less-299')}>
    <p>Less than Rs. 299</p>
</div>

<div className={`flex items-center gap-1 px-4 py-1.5 border
   ${whichFilter === 'Non-Veg' ? 'border-orange-600 text-orange-600':'border-gray-400 text-black'} 
   rounded-lg   shadow-sm whitespace-nowrap cursor-pointer`} 
     onClick={() => handleNonVeg('Non-Veg') }>
 <p>Non Veg</p>
  </div>

   <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-400 rounded-lg 
   shadow-sm whitespace-nowrap cursor-pointer"
      onClick={(e) => {
         e.stopPropagation();
          setIsFilter(true);
          setIsCuisines(false);
         setIsVeg(false);
         console.log('cicked filter')
         }} >
        <p>Filter</p>
        <CiFilter size={18} />
 </div>




 <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-400 rounded-lg 
          shadow-sm whitespace-nowrap cursor-pointer" onClick={() => setIsCuisines(!isCuisines)}>
       <p>Cuisines</p>
    <IoIosArrowDown size={18} />
 </div>
 </div>
               

 </div>
            


{/*  all restuarents */}

{foodLoading ? (
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
  <div className='w-full md:w-1/2 mx-auto pb-2 '>  
<h1 className="font-bold mt-3 px-4 text-lg text-start text-gray-800">Restaurants to explore</h1>

{restaurantData && restaurantData.sort((a, b) => {
      if (!a) return 1;      // null goes to bottom
      if (!b) return -1;

      const orderA = a.isAcceptingOrders ?? false;
      const orderB = b.isAcceptingOrders ?? false;

      return orderB - orderA;
     }).map((v, i) => {
       if (!v) return null;
  return (
    <div className='p-1 flex justify-between' key={v._id}>
      <div className='px-2 flex justify-start gap-4 mt-1 items-center'>
        <Link href={`/DetilsRestaurant?id=${v._id}&selectVegType=${selectVegType}`}>
          <div className="relative w-40 h-45 rounded-2xl overflow-hidden shadow-md cursor-pointer group">
            <img
              src="https://images.archanaskitchen.com/images/recipes/world-recipes/pizza-recipes/No_Yeast_Thin_Crust_Veggie_Pizza_Recipe_1_0359f3d67b.jpg"
              alt="Restaurant"
              className={`w-full h-full object-cover transition duration-500 
                ${v.isAcceptingOrders ? 'brightness-100':'filter grayscale brightness-75'}`}
            />
            <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow">
              <FiBookmark size={18} className="text-gray-700"/>
            </button>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-1.5">
              {v.isAcceptingOrders ? (
                <>
                  <p className="text-white text-lg font-bold">FLAT DEAL</p>
                  <p className="text-white text-lg font-bold">₹189 OFF</p>
                  <span className="text-gray-200 text-xs font-bold">above ₹599</span>
                </>
              ) : (
                <p className="text-white text-lg font-bold">Currently Not Accepting Orders</p>
              )}
            </div>
          </div>
        </Link>
        <div className='flex flex-col'>
          <h1 className='font-extrabold'>{v.business_name?.toUpperCase()}</h1>
          <p className='font-semibold text-sm'>{v.rating} (1.2k+) . 20-30 Mins</p>
          <span className='text-gray-700 font-medium'>pasta, burgers, chinese...</span>
          <p className='text-gray-700 font-medium'>{v.city}, 1.2Km</p>
        </div>
      </div>
    </div>
  );
})}





</div>
)

}






{/* ended all restuarents */}







{/* open filer stared */}
{isFilter && (<div className="fixed inset-0 z-30 transition-opacity duration-300  bg-black/40"
    onClick={() => setIsCuisines(false)}  />)}


<div className={` fixed bottom-0 left-0 w-full h-[70%] bg-white rounded-t-2xl  z-[999]
    transform transition-transform duration-500 ease-in-out
    ${isFilter ? 'translate-y-0' : 'translate-y-full'} `}>
  <div className='p-3 flex justify-between items-center'>
    <h1 className='text-2xl font-bold'>Filter</h1>
    <RxCross2 size={22} className='cursor-pointer' onClick={() => setIsFilter(false)} />
  </div>


<div className='w-full border-t border-gray-400 flex justify-between items-cennter'>
   <div className="w-[40%] p-4 flex flex-col gap-6 font-medium text-gray-700 border-r border-gray-300">

    {['Sort', '99 Store','Combo Offer', 'Veg' ,'Non Veg' ].map((item, i) => (
      <p key={i} className={`cursor-pointer transition-colors duration-200 ${
          active === item? 'text-rose-500 font-semibold' : 'hover:text-rose-500'  }`}
          onClick={() => setActive(item)}> {item} </p> ))}
  </div>

{active === 'Sort' && (
   <div className='w-[60%] p-4 border-l border-gray-400 h-screen'>
     <div>
        <p className='font-bold text-sm text-gray-700'>SORT BY</p>

        <div className='flex items-center gap-2 mt-3'>
        <input type="radio"  id="default"  name="sort"  value="default"
          checked={checkValue === 'default'}
          onChange={() => setCheckValue('default')}
          className="accent-rose-500"  />
         <label htmlFor="default" className='cursor-pointer'>Relevance (Default)</label>
       </div>

      <div className='flex items-center gap-2 mt-2'>
        <input type="radio" id="low" name="sort" value="low"
         checked={checkValue === 'low'}
         onChange={() => setCheckValue('low')}
          className="accent-rose-500" />
        <label htmlFor="low" className='cursor-pointer'>Cost: Low to High</label>
      </div>

      <div className='flex items-center gap-2 mt-2'>
        <input type="radio" id="high" name="sort" value="high"
        checked={checkValue === 'high'}
        onChange={() => setCheckValue('high')}
        className="accent-rose-500" />
       <label htmlFor="high" className='cursor-pointer'>Cost: High to Low</label>
     </div>

  </div>
</div>
 )}
</div>


{/* end part */}
  <div className='p-3 z-10  border-gray-100  bg-gray-200 fixed bottom-0 left-0 flex justify-between items-center w-full '>
    <button className='rounded-2xl px-6 
    font-bold py-2.5 text-lg text-gray-600 cursor-pointer'>Clear Filter</button>

    <button className='bg-gray-100 rounded-2xl px-10 
    font-bold py-2.5 text-lg text-gray-800 cursor-pointer
     hover:bg-rose-400 hover:text-white  transition duration-300 '
     onClick={handleApplyFilter}>Apply</button>
  </div>

</div>

{/* *****************************  end open filter   ****************************** */}





 {/* Modal Backdrop: Lowered Z-index to z-30 */}
{isVeg && (<div className="fixed inset-0 z-30 transition-opacity duration-300 bg-black/40"/>)}

{/* Modal Container: High Z-index z-[999] */}
 <div className={`fixed left-1/2 top-1/3 w-80 h-auto bg-white rounded-2xl shadow-lg
      z-[999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out
      ${isVeg  ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0 pointer-events-none'}`} >

    <div className="p-3 flex justify-between items-center pb-2 border-b border-gray-300">
         <h2 className="font-extrabold text-lg">I want to see veg choices from </h2>
           <RxCross2 size={22} className="cursor-pointer"
            onClick={() =>{ setIsVeg(false); setVegOff(false) }} />
   </div>

  <div className="p-6 flex flex-col gap-4">
     <div className="flex justify-between items-center">
         <label htmlFor='vegall' className="text-lg font-semibold
         cursor-pointer">All restaurants</label>
        <input type="radio" className="accent-green-600" name='veg' id="vegall"
         value='All restaurants' onChange={(e) => setSelectVegType(e.target.value)} />
     </div>

   <div className="flex justify-between items-center">
      <label htmlFor="vegonly" className="text-lg font-semibold
       cursor-pointer">Pure veg restaurants only</label>
      <input type="radio" className="accent-green-600" name='veg' id="vegonly"
        value='Pure veg restaurants only' onChange={(e) => setSelectVegType(e.target.value)} />
  </div>

  </div>

  <div className="p-3 w-full flex flex-col gap-2 mt-4">
    <button className="w-full bg-green-600 rounded-2xl font-bold py-2.5 text-lg text-white
     hover:bg-green-500 transition duration-300 cursor-pointer"
      onClick={selcetVegLogic}>
     Show restaurants
   </button>
  </div>


  </div>

{/* ********************************  Ended Veg Modal **************************************** */}






{/* opened cuisiness */}

{isCuisines && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 
  transition-opacity duration-300" onClick={() => setIsCuisines(false)}/>)}

<div className={`fixed bottom-0 left-0 w-full max-h-[80%] bg-white rounded-t-3xl shadow-2xl
   z-[999]  transform transition-transform duration-500 ease-in-out
    ${isCuisines ? 'translate-y-0' : 'translate-y-full'}`}>


  <div className="p-4 flex justify-between items-center border-b border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900">Cuisines</h1>
    <RxCross2 size={24} className="cursor-pointer text-gray-600 hover:text-gray-800
      transition" onClick={() => setIsCuisines(false)} />
  </div>



  <div className="px-4 py-3">
    <div className="relative w-full md:w-[500px] mx-auto">
      <input type="text" placeholder="Search for cuisines..."
        className="w-full p-3 pl-10 rounded-2xl border border-gray-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-300 outline-none placeholder:text-gray-400 transition"
      />
      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  </div>


  {/* Cuisines List */}
  <div className="px-4 py-2 pb-40 max-h-[50vh] overflow-y-auto grid grid-cols-2 
  md:grid-cols-3 gap-3 mb-3">
    {cuisines?.length > 0 && cuisines.map((item, index) => (
      <label key={index} className="cursor-pointer select-none flex items-center gap-2
       text-gray-700 hover:text-rose-600 transition"  >
        <input type="checkbox" className="accent-rose-500 w-5 h-5" />
        <span className="bg-gray-100 hover:bg-rose-100 px-3 py-1 rounded-full 
        text-sm font-medium transition">
          {item}
        </span>
      </label>
    ))}
  </div>

  {/* Apply / Clear Buttons */}
  <div className="p-4 bg-white border-t border-gray-200 fixed bottom-0 left-0 w-full flex flex-col gap-3">
    <button  className="w-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-2xl
     font-bold py-3 text-lg text-white shadow-md cursor-pointer"
      onClick={handleApplyFilter} >  Apply
    </button>

    <button className="w-full rounded-2xl font-bold py-3 text-lg text-gray-600"
      onClick={() => console.log("Clear filter clicked")} >  Clear Filter
    </button>
  </div>
  </div>

{/* ended cusiness */}



{/* Bottom View Cart Bar */}
{totalItems && totalItems > 0 ? (
  <AddCardItem totalItems={totalItems}  handleViewClick = {handleViewClick} /> ):''}


{isViewClick && ( <ViewCardItem isViewClick={isViewClick} setIsViewClick={setIsViewClick}/>)}



  </div>
 </>
  )
}


export default RestaurantsPage;