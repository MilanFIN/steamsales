import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";



import GameListItem from "./Components/GameListItem"
import MaxPriceFilter from "./Components/MaxPriceFilter"
import DiscountFilter from "./Components/DiscountFilter"

import { selectMaxPrice } from './store/maxPriceSlice';
import { selectDiscount } from './store/discountSlice';

import { RootState } from './store/store';


const APIKEY = process.env.REACT_APP_API_KEY || "0"
const APIURL = process.env.REACT_APP_API_URL + "/api/"




interface GameRankObj {
  id: number;
  rank: number;
  currentPlayers: number;
  peakPlayers: number;
}

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function App() {

  const [gameRankObjs, setGameRankObjs] = useState<GameRankObj[]>([]);
  //const [maxPrice, setMaxPrice] = useState<number>(0);

  const maxPriceState = useTypedSelector(selectMaxPrice);
  const discountState = useTypedSelector(selectDiscount);


  useEffect(()=>{
    // do stuff here...

    
    const fetchData = async () => {
      try {
        const response = await fetch(APIURL+"ISteamChartsService/GetGamesByConcurrentPlayers/v1");
        const jsonData = await response.json();

        const games = jsonData.response.ranks

        const rankObjs = Array<GameRankObj>()

        games.forEach((game:any) => {
          const newGame: GameRankObj = {
            id: game.appid,
            rank:game.rank,
            currentPlayers: game.concurrent_in_game,
            peakPlayers: game.peak_in_game,
          };
      
          rankObjs.push(newGame)
        });
        setGameRankObjs(rankObjs);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const maxPriceUpdated = (value:number) =>  {
    //setMaxPrice(value)
  }


  return (
    <div className="App">
      Under (euros)
      <MaxPriceFilter updateMaxPrice={maxPriceUpdated} />
      Discount over (%)
      <DiscountFilter/>
        <ul>
        {gameRankObjs.map((item) => (
          <li>
           <GameListItem key={item.id} id={item.id} rank={item.rank} currentPlayers={item.currentPlayers} peakPlayers={item.peakPlayers} maxPrice={maxPriceState.maxPrice} minDiscount={discountState.discount}/>
          </li>
          ))}
        </ul>

    </div>
  );
}

export default App;

/*
      <header className="App-header">

      </header>
*/