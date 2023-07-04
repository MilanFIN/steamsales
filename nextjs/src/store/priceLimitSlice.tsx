import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


type priceState = {
	maxPrice: number;
	minPrice: number;
};

const initialState = {
	maxPrice: 0,
	minPrice: 100
} as priceState;
  

const priceLimitSlice = createSlice({
	// name used in action types
	name: "priceLimits",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updatePriceLimits(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, priceState>
	  ) {
		state.maxPrice = action.payload.maxPrice;
		state.minPrice = action.payload.minPrice;

	  },
	},
  });
  
export const { updatePriceLimits } = priceLimitSlice.actions;
export default priceLimitSlice.reducer;

// create and export the selector
export const selectPriceLimits = (state: RootState) => state.priceLimits;
