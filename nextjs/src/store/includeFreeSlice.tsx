import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


type includeFreeState = {
	include: boolean;
};

const initialState = {
	include: true,
} as includeFreeState;
  

const includeFreeSlice = createSlice({
	// name used in action types
	name: "includefree",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updateIncludeFree(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, boolean>
	  ) {
		state.include = action.payload;
	  },
	},
  });
  
export const { updateIncludeFree } = includeFreeSlice.actions;
export default includeFreeSlice.reducer;

export const selectIncludeFree = (state: RootState) => state.includeFree;
