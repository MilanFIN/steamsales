"use client"

import { useEffect, useState } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";


import {store} from '../store/store'
import { Provider } from 'react-redux';

import { selectMaxPrice } from '../store/maxPriceSlice';
import { selectDiscount } from '../store/discountSlice';
import { selectIncludeFree } from '../store/includeFreeSlice';

import { RootState } from '../store/store';
import { selectGameInfo } from '../store/gameInfoSlice';
import MaxPriceFilter from '@/components/MaxPriceFilter';
import DiscountFilter from '@/components/DiscountFilter';
import IncludeFreeCheckBox from '@/components/IncludeFreeCheckBox';

//import IncludeFreeCheckBox from '@components/IncludeFreeCheckBox'
import GameListItem from '@/components/GameListItem';


//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/"

interface GameRankObj {
  id: number;
  viewRank:number
  rank: number;
  currentPlayers: number;
  peakPlayers: number;
  price: number;
  discount: number;
  visible: boolean;
}

interface GamePriceObj {
  rank: number;
  price: number;
  discount: number;
}

export default function ListingPage() {

  const [gameRankObjs, setGameRankObjs] = useState<GameRankObj[]>([]);

  const [gamePrices, setGamePrices] = useState<GamePriceObj[]>(new Array(10).fill({rank:0, price:0, discount:0}));

  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const maxPriceState = useTypedSelector(selectMaxPrice);
  const discountState = useTypedSelector(selectDiscount);
  const gameInfoState = useTypedSelector(selectGameInfo);
  const includeFreeState = useTypedSelector(selectIncludeFree);


  useEffect(()=>{
    // do stuff here...

    
    const fetchData = async () => {
      try {
        const response = await fetch(APIURL+"?path=ISteamChartsService/GetGamesByConcurrentPlayers/v1");
        const jsonData = await response.json();

        const games = jsonData.response.ranks

        const rankObjs = Array<GameRankObj>()

        games.slice(0, 10).forEach((game:any) => {
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
    

      if (gameInfoState.rank > 0 && gameInfoState.rank-1 < gamePrices.length) {
        let updatedGamePrices = gamePrices.map(l => Object.assign({}, l));
        updatedGamePrices[gameInfoState.rank-1].price = gameInfoState.price
        updatedGamePrices[gameInfoState.rank-1].discount = gameInfoState.discount
        setGamePrices(updatedGamePrices)
        
    
      }
      
  
      
      
  }, [gameInfoState]);

  useEffect(() => {
    setVisibilities(maxPriceState.maxPrice, discountState.discount, includeFreeState.include)

    
  }, [maxPriceState.maxPrice, discountState.discount, includeFreeState.include]);


  const setVisibilities = (maxPrice:number, discount:number, includeFree:boolean) => {
    var rankedObjs = new Array<GameRankObj>();
    var rank = 1;
    console.log(gamePrices)
    gameRankObjs.forEach((obj, ind) => {

      let price = gamePrices[ind].price;
      let discount = gamePrices[ind].discount;

      //if ((obj.discount >= discount-1 || discount === 0) &&
      //  (obj.price <= maxPrice * 100 || maxPrice === 0) 
      if ((includeFree || price === 0)) {//) { //(!includeFree && obj.price === 0) || 
        obj.visible = true;
        obj.viewRank = rank;
        rank++;

      }
      else {
        obj.visible = false;
      }
      rankedObjs.push(obj);

    })

    if (rankedObjs.length != 0) {
      setGameRankObjs(rankedObjs)
    }
    
  }


  return (

	<div>
        Under (euros)
        <MaxPriceFilter />
        Discount over (%)
        <DiscountFilter/>
        Include free games
        <IncludeFreeCheckBox/>
        <ul>
        {gameRankObjs.map((item) => (
          
          <div>
           <GameListItem key={item.id} id={item.id} rank={item.rank} viewRank={item.viewRank} currentPlayers={item.currentPlayers} 
                        peakPlayers={item.peakPlayers} maxPrice={maxPriceState.maxPrice} minDiscount={discountState.discount}
                        visible={item.visible}/>


          </div>
          ))}
        </ul>

    </div>
  )
}

