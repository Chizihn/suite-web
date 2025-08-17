import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Hotels from "./pages/Hotels";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import "./index.css";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import HotelDetails from "./pages/HotelDetails";
import BookSuite from "./pages/BookSuite";
import Explore from "./pages/Explore";
import { WalletContextProvider } from "./contexts/WalletContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/queryClient";
import { getFullnodeUrl } from "@mysten/sui/client";
import { SuiClientProvider } from "@mysten/dapp-kit";
import CreateHotel from "./pages/CreateHotel";

const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') }, // add as needed
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
    
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletContextProvider>
          <BrowserRouter>
          <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="hotels/:id" element={<HotelDetails />} />
            <Route path="hotels/:id/book" element={<BookSuite />} />
            <Route path="create-hotel" element={<CreateHotel />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
          </BrowserRouter>
        </WalletContextProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
