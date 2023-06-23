import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from "next-redux-wrapper";

import maxPriceReducer from "./maxPriceSlice";
import discountReducer from "./discountSlice";
import gameInfoReducer from "./gameInfoSlice";

// use 'configreStrore'  function to create the store
export const store = configureStore({
    reducer: {
      maxPrice: maxPriceReducer,
      discount: discountReducer,
      gameInfo: gameInfoReducer,

    }
  });
  
// defining the 'rootstate' as the return type
export type RootState = ReturnType<typeof store.getState>;

/*
const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
*/