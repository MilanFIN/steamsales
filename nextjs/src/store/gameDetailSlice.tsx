import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


export type gameDetailSlice = {
	id: number,
	open: boolean,
};

const initialState = {
	id: 0,
	open: false,
} as gameDetailSlice;
  

const gameDetailSlice = createSlice({
	// name used in action types
	name: "gameDetail",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updateGameDetail(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, gameDetailSlice>
	  ) {
		if (state.id == action.payload.id && state.open) {
			state.open = false;
		}
		else {
			state.open = true;
			state.id = action.payload.id;
		}
	
	  },
	},
  });
  
export const { updateGameDetail } = gameDetailSlice.actions;
export default gameDetailSlice.reducer;

export const selectGameDetail = (state: RootState) => state.gameDetail;
