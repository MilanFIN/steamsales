import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from "next-redux-wrapper";

import maxPriceReducer from "./priceLimitSlice";
import discountReducer from "./discountSlice";
import gameDetailReducer from "./gameDetailSlice";
import includeFreeReducer from "./includeFreeSlice";
import sortByReducer from "./SortBySlice"

// use 'configreStrore'  function to create the store
export const store = configureStore({
    reducer: {
      priceLimits: maxPriceReducer,
      discount: discountReducer,
      gameDetail: gameDetailReducer,
      includeFree: includeFreeReducer,
      sortBy: sortByReducer,
    }
  });
  
// defining the 'rootstate' as the return type
export type RootState = ReturnType<typeof store.getState>;

/*
const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
*/