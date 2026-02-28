import React, { useState, createContext } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
  // ✅ Watchlist data (ARRAY)
  const [watchlist, setWatchlist] = useState([
    { uid: "TCS", name: "TCS", price: 3500 },
    { uid: "INFY", name: "INFY", price: 1500 },
  ]);

  // ✅ Buy window state
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");

  const openBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const closeBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        watchlist,          // ✅ ARRAY PROVIDED
        setWatchlist,
        openBuyWindow,
        closeBuyWindow,
      }}
    >
      {children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
