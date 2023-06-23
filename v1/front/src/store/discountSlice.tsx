import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


type discountState = {
	discount: number;
};

const initialState = {
	discount: 0,
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
	  updateDiscount(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, number>
	  ) {
		state.discount = action.payload;
	  },
	},
  });
  
export const { updateDiscount } = discountSlice.actions;
export default discountSlice.reducer;

export const selectDiscount = (state: RootState) => state.discount;
