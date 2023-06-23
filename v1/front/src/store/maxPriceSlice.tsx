import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


type priceState = {
	maxPrice: number;
};

const initialState = {
	maxPrice: 0,
} as priceState;
  

const maxPriceSlice = createSlice({
	// name used in action types
	name: "maxPrice",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updateMaxPrice(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, number>
	  ) {
		state.maxPrice = action.payload;
	  },
	},
  });
  
export const { updateMaxPrice } = maxPriceSlice.actions;
export default maxPriceSlice.reducer;

// create and export the selector
export const selectMaxPrice = (state: RootState) => state.maxPrice;
