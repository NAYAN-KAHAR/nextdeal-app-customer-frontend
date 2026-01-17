This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



<!-- ***********************************
// fetch  user location lat and lng 
const handleAllowLocation = () => {
  if (!navigator.geolocation) return;
  
  // Get the user's current position
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setLocation({ lat: latitude, lng: longitude });
      setShowLocationModal(false);
      console.log(latitude, longitude);
    },
    (error) => {
      console.log("Could not get location:", error);
    }
  );
};



  
  // Reverse geocode when location changes
  useEffect(() => {
  if (!location) return;

  const fetchLocationDetails = async () => {
    const { lat, lng } = location;

    try {
      const res = await fetch(
       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json` );

      const data = await res.json();
      console.log("Full place details:", data);
      console.log("Address:", data.address);

      // store formatted address details
      const formatted = data.display_name;
      const city = data.address.city || data.address.town || data.address.village;
      const state = data.address.state;

      const payload = {
        address: formatted,
        city,
        state,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };

      // save to DB
      const updateRes = await axios.put(`${apiUrl}/api/profile-update`,
         payload,{ withCredentials: true } );
      console.log("Updated DB:", updateRes.data);
      setUser(updateRes.data.user);
      setShowLocationModal(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  fetchLocationDetails();
}, [location]);


********************************************************** -->
