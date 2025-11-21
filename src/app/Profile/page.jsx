
'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import Image from "next/image";
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";
import { FiSearch } from 'react-icons/fi';
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState();
  const [image, setImage] = useState('');
  const [auth, setAuth] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAdress] = useState('');


//Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/verify`, {withCredentials: true});

        if (res.data.authenticated) {
          setAuth(true);
        }
      } catch (err) {
        console.log('User not logged in');
        router.push('/Signup');
      }
    };

    checkAuth();
  }, [router]);


  // get profile details
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get(`${apiUrl}/api/customer-profile`, {withCredentials: true});
        setUser(res.data.user);
        // console.log(res.data.user);
        localStorage.setItem('profile_name', res.data?.user?.name);

         if(res.data.user.name){
          setName(res.data.user.name);
        }

        if(res.data.user.email){
          setEmail(res.data.user.email);
        }
        if(res.data.user.address){
          setAdress(res.data.user.address);
        }
        if(res.data.user.profileImg){
          setImage(res.data.user.profileImg);
        }
     
      }catch(err){
        console.log(err)
      }
    };

   if(auth){
    fetchUser();
   }
  },[auth]);


  const handleProfileImage = (e) => {
    console.log(e.target.files[0]);
    const tempFile = e.target.files[0];
    setProfileImg(tempFile);

    const originalFile  = URL.createObjectURL(tempFile);
    setImage(originalFile);
  };

  // handle save profile data of customer
  const handleSaveBtn = async () => {
    try{
      console.log(name,email, address);
      const userData = new FormData();
      
      userData.append('name', name);

      if(profileImg){
        userData.append('profileImg', profileImg);
      }
      if(email){
        userData.append('email', email);
      }
      if (address) {
      userData.append('address', address);
      }
            
      if(!name.trim().length > 3) return alert('Name is requre');
      setLoading(true);
      const res = await axios.put(`${apiUrl}/api/profile-update`, userData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      // console.log(res.data);
  
      setLoading(false);
      Swal.fire({
      title: 'Done!',
      text: 'Successfully Updated Profile!',
      icon: 'success',
      confirmButtonText: 'Ok'
    });

    }catch(err){
      console.log(err);
       toast.error(err?.response?.data?.error);
    }
  }


  return auth ? (
    <>
   
      <NavbarTop />
      <div className="min-h-screen w-full flex-col justify-center pt-12 pb-16
       bg-gray-100 relative">
  
         <div className="w-full p-2  bg-[#17186C] rounded-b-2xl">
                      
           
      </div>

 
    
  {/* Profile form */}
<div className="w-full flex justify-between items-center p-4 md:p-6 ">
    <div className="z-50 bg-[#FFE7D3] p-4 w-full max-w-md mx-auto rounded-2xl ">

      
      <div className="flex justify-between items-center">
          <img src={`${image ? image :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZRC_JCJG4XCFypC11H549nZXGFvUTJO8qQ&s'}`}
          alt="profile-img" className="w-20 h-20 rounded-full object-cover"/>
          <div>
            <label htmlFor="file" className="px-2 py-2 rounded-2xl bg-gray-500 text-white text-sm font-bold hover:bg-gray-400 transition cursor-pointer ">Upload Photo</label>
            <input type="file" id="file" className="hidden" accept="image/*" onChange={handleProfileImage}/>
          </div>
      </div>

    <div className="mt-6">
      <label htmlFor="fullName" className="text-sm font-medium mb-1 text-gray-700">Full Name</label>
      <input type="text" id="fullName" placeholder="Nayan Kahar" value={name}
       onChange={(e) => setName(e.target.value)}
        className="p-2.5 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2
        focus:ring-black transition" />
    </div>

 
    <div className="mt-4">
      <label htmlFor="phone" className="text-sm font-medium mb-1  text-gray-700">Phone Number</label>
      <input type="tel" id="phone"   readOnly
        placeholder="9874562879"  value={user?.mobile}
        className="p-2.5 rounded-xl text-gray-700 w-full border border-gray-300 focus:outline-none transition"/>
    </div>


    <div className="mt-4">
      <label htmlFor="email" className="text-sm font-medium mb-1  text-gray-700"> Email Address</label>
      <input type="email" id="email" placeholder="Enter email adress" value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2.5 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2
        focus:ring-black transition" />
    </div>


    <div className="mt-4">
      <label htmlFor="address" className="text-sm font-medium mb-1  text-gray-700">Address</label>
      <input type="text" id="address"  placeholder="Enter your adress" value={address}
        onChange={(e) => setAdress(e.target.value)}
        className="p-2.5 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2
        focus:ring-black transition"/>
    </div>

   <button onClick={handleSaveBtn} className="mt-4 bg-black  
   hover:bg-[#17186C] transition px-10 py-2
    rounded-2xl text-white cursor-pointer">
      {loading ? 'Saving' :'Save'}</button>
    </div>
</div>




</div>
 <NavbarBottom />
    </>
  ):null;
};

export default ProfilePage;