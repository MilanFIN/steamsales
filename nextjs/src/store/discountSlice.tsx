import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


type discountState = {
	minDiscount: number;
	maxDiscount: number
};

const initialState = {
	minDiscount: 0,
	maxDiscount: 100,
} as discountState;
  

const discountSlice = createSlice({
	// name used in action types
	name: "discount",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updateDiscountLimits(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, discountState>
	  ) {
		state.minDiscount = action.payload.minDiscount;
		state.maxDiscount = action.payload.maxDiscount;

	  },
	},
  });
  
export const { updateDiscountLimits } = discountSlice.actions;
export default discountSlice.reducer;

export const selectDiscount = (state: RootState) => state.discount;
