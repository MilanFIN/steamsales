"use client"

import { useEffect, useState } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";


import {store} from '../store/store'
import { Provider } from 'react-redux';

import { selectMaxPrice } from '../store/maxPriceSlice';
import { selectDiscount } from '../store/discountSlice';

import { RootState } from '../store/store';
import { selectGameInfo } from '../store/gameInfoSlice';
import MaxPriceFilter from '@/components/MaxPriceFilter';
import DiscountFilter from '@/components/DiscountFilter';
import GameListItem from '@/components/GameListItem';


//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/"

interface GameRankObj {
  id: number;
  rank: number;
  currentPlayers: number;
  peakPlayers: number;
  price: number;
  discount: number;
  visible: boolean;
}


export default function ListingPage() {

  const [gameRankObjs, setGameRankObjs] = useState<GameRankObj[]>([]);

  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const maxPriceState = useTypedSelector(selectMaxPrice);
  const discountState = useTypedSelector(selectDiscount);
  const gameInfoState = useTypedSelector(selectGameInfo);


  useEffect(()=>{
    // do stuff here...

    
    const fetchData = async () => {
      try {
        const response = await fetch(APIURL+"?path=ISteamChartsService/GetGamesByConcurrentPlayers/v1");
        const jsonData = await response.json();

        const games = jsonData.response.ranks

        const rankObjs = Array<GameRankObj>()

        games.forEach((game:any) => {
          const newGame: GameRankObj = {
            id: game.appid,
            rank:game.rank,
            currentPlayers: game.concurrent_in_game,
            peakPlayers: game.peak_in_game,
            price:0,
            discount:0,
            visible:true
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



  useEffect(() => {
    if (gameInfoState.discount != 0) {
      if (gameInfoState.rank-1 < gameRankObjs.length) {
        console.log(gameInfoState.price)
        gameRankObjs.at(gameInfoState.rank-1)!.price = gameInfoState.price
        gameRankObjs.at(gameInfoState.rank-1)!.discount = gameInfoState.discount
        setGameRankObjs(gameRankObjs)
    
      }
      }
  }, [gameInfoState]);

  useEffect(() => {
    setVisibilities(maxPriceState.maxPrice, discountState.discount)

    
  }, [maxPriceState, discountState]);


  const setVisibilities = (maxPrice:number, discount:number) => {
    var rankedObjs = gameRankObjs;
    var rank = 1;
    rankedObjs.forEach((obj, ind) => {
      /*
      if ((obj.price <= maxPriceState.maxPrice*100 || maxPriceState.maxPrice === 0)
             &&  (obj.discount >= discountState.discount || discountState.discount === 0)) {        
      */
      if ((obj.discount >= discount-1 || discount === 0) &&
        (obj.price <= maxPrice * 100 || maxPrice === 0)) {
        obj.visible = true;
        obj.rank = rank;
        rank++;
      }
      else {
        obj.visible = false;
      }
      rankedObjs[ind] = obj;
      //console.log(obj.price, obj.visible, maxPriceState.maxPrice)

    })
    setGameRankObjs(rankedObjs)
    //return rankedObjs
  }


  return (

	<div>
        Under (euros)
        <MaxPriceFilter />
        Discount over (%)
        <DiscountFilter/>
        <ul>
        {gameRankObjs.map((item) => (
          
          <div>
           <GameListItem key={item.id} id={item.id} rank={item.rank} currentPlayers={item.currentPlayers} 
                        peakPlayers={item.peakPlayers} maxPrice={maxPriceState.maxPrice} minDiscount={discountState.discount}
                        visible={item.visible}/>


          </div>
          ))}
        </ul>

    </div>
  )
}

