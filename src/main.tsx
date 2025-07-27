import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Hotels from "./pages/Hotels";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import "./index.css";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import HotelDetails from "./pages/HotelDetails";
import Explore from "./pages/Explore";
import { WalletContextProvider } from "./contexts/WalletContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/queryClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
   <QueryClientProvider client={queryClient}>
   <WalletContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route
              path="booking-confirmation"
              element={<BookingConfirmation />}
            />
            <Route path="hotels" element={<Hotels />} />
            <Route path="hotels/:id" element={<HotelDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletContextProvider>
   </QueryClientProvider>
  </React.StrictMode>
);
