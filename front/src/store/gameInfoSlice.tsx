import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "react-redux-typescript";
import { RootState } from "./store";


export type gameInfoState = {
	price: number, //cents
	discount: number,
	rank: number,
};

const initialState = {
	price: 0, //cents
	discount: 0,
	rank: 0,
} as gameInfoState;
  

const gameInfoSlice = createSlice({
	// name used in action types
	name: "gameInfo",
	// initial state
	initialState,
	// an object of "case reducers"
	// key names are used to generate actions
	reducers: {
	  //  arguments of action are same first one is state
	  //& second one is action
	  updateGameInfo(
		state, //type is infered from the initial state
		// `PayloadAction` is a generic-type
		// that allows you to specify an action
		// with a typped payload.
		action: PayloadAction<string, gameInfoState>
	  ) {
		state.price = action.payload.price;
		state.discount = action.payload.discount;
		state.rank = action.payload.rank;
	
	  },
	},
  });
  
export const { updateGameInfo } = gameInfoSlice.actions;
export default gameInfoSlice.reducer;

export const selectGameInfo = (state: RootState) => state.gameInfo;
