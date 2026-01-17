"use client";

import { useState, useEffect } from "react";

// -------------------- HARD-CODED ORDER --------------------
const order = {
  _id: "1",
  restaurantName: "Mehfil Restaurant",
  restaurantImage: "/food-1.jpg",
  items: [
    { name: "Chicken Biryani", quantity: 1 },
    { name: "Rumali Roti", quantity: 3 },
  ],
  pricing: { total: 350 },
  paymentInfo: { status: "Paid", transactionId: "ORD-123456" },
  orderStatus: "COOKING",
};

// -------------------- TIMELINE COMPONENT --------------------
const TrackingTimeline = ({ status }) => {
  const steps = [
    { label: "Order Placed", key: "PLACED" },
    { label: "Restaurant Accepted", key: "ACCEPTED" },
    { label: "Preparing Food", key: "COOKING" },
    { label: "Picked by Rider", key: "PICKED" },
    { label: "On The Way", key: "RIDING" },
    { label: "Delivered", key: "DELIVERED" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="bg-gray-50 mt-4 p-5 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Order Tracking</h3>
      <div className="relative border-l-2 border-gray-200 ml-5">
        {steps.map((step, i) => {
          const active = i <= currentIndex;
          return (
            <div key={step.key} className="mb-6 ml-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full border-2 ${
                    active
                      ? "bg-orange-500 border-orange-600"
                      : "bg-gray-200 border-gray-300"
                  }`}
                ></span>
                <p
                  className={`text-sm font-medium ${
                    active ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {i === currentIndex && (
                <p className="text-xs text-gray-600 ml-7 mt-1 animate-pulse">
                  {step.key === "COOKING" &&
                    "Your food is being freshly prepared 🍳"}
                  {step.key === "RIDING" &&
                    "Delivery partner is on the way to you 🚴"}
                  {step.key === "PICKED" &&
                    "Delivery partner has picked up your order 📦"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------- DELIVERY PARTNER --------------------
const DeliveryPartnerCard = ({ riderLocation }) => {
  return (
    <div className="p-4 mt-4 bg-white border rounded-xl flex items-center gap-4 shadow-sm">
      <img
        src="/delivery-guy.png"
        className="w-14 h-14 rounded-full object-cover"
        alt="Delivery Partner"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">Rahul (Your Rider)</h4>
        <p className="text-xs text-gray-500">
          Arriving in ~12 mins | Lat: {riderLocation.lat.toFixed(2)}, Lng:{" "}
          {riderLocation.lng.toFixed(2)}
        </p>
      </div>
      <button className="text-orange-600 font-medium text-sm">Call</button>
    </div>
  );
};

// -------------------- MAIN PAGE --------------------
const MyOrderPage = () => {
  const [showTrack, setShowTrack] = useState(false);

  // Simulate rider moving on map
  const [riderLocation, setRiderLocation] = useState({ lat: 28.61, lng: 77.21 });

  useEffect(() => {
    let interval;
    if (showTrack) {
      interval = setInterval(() => {
        setRiderLocation((loc) => ({
          lat: loc.lat + 0.001, // move north
          lng: loc.lng + 0.001, // move east
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showTrack]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Order</h1>

      <div className="bg-white p-5 rounded-xl border shadow-sm">
        {/* Restaurant Info */}
        <div className="flex items-center gap-4">
          <img src={order.restaurantImage} className="w-16 h-16 rounded-lg" alt="" />
          <div>
            <h2 className="text-lg font-semibold">{order.restaurantName}</h2>
            <p className="text-sm text-gray-500">
              Order ID: {order.paymentInfo.transactionId}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-3 text-sm text-gray-700">
          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} × {item.quantity}
            </p>
          ))}
        </div>

        {/* Price + Status */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <p className="font-semibold text-gray-900">₹{order.pricing.total}</p>
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              order.paymentInfo.status === "Paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.paymentInfo.status}
          </span>
        </div>

        {/* Track Button */}
        <button  onClick={() => setShowTrack(!showTrack)}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 rounded-lg"
        >
          {showTrack ? "Hide Tracking" : "Track Order"}
        </button>

        {/* Timeline + Delivery Partner + Map */}
        {showTrack && (
          <>
            <TrackingTimeline status={order.orderStatus} />
            <DeliveryPartnerCard riderLocation={riderLocation} />
            <div className="mt-4 w-full h-64 bg-gray-200 rounded-xl relative">
              {/* Fake rider icon moving */}
              <div
                className="w-6 h-6 bg-orange-500 rounded-full absolute"
                style={{
                  top: `${(riderLocation.lat % 1) * 400}px`,
                  left: `${(riderLocation.lng % 1) * 400}px`,
                  transition: "top 1s linear, left 1s linear",
                }}
              ></div>
              <p className="absolute bottom-2 left-2 text-xs text-gray-600">
                Map simulation
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;
