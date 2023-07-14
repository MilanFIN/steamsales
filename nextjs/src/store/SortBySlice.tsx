import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


type sortByState = {
	property: string;
};

const initialState = {
	property: "playercount",
} as sortByState;
  

const sortBySlice = createSlice({
	// name used in action types
	name: "sortby",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updateSortBy(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, string>
	  ) {
		state.property = action.payload;
	  },
	},
  });
  
export const { updateSortBy } = sortBySlice.actions;
export default sortBySlice.reducer;

export const selectSortBy = (state: RootState) => state.sortBy;
