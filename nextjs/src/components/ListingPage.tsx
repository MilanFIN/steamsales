"use client"

import { useEffect, useState } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";


import {store} from '../store/store'
import { Provider } from 'react-redux';

import { selectPriceLimits } from '../store/priceLimitSlice';
import { selectDiscount } from '../store/discountSlice';
import { selectIncludeFree } from '../store/includeFreeSlice';

import { RootState } from '../store/store';
import { selectGameInfo } from '../store/gameInfoSlice';
import PriceFilter from '@/components/PriceFilter';
import DiscountFilter from '@/components/DiscountFilter';
import IncludeFreeCheckBox from '@/components/IncludeFreeCheckBox';

//import IncludeFreeCheckBox from '@components/IncludeFreeCheckBox'
import GameListItem from '@/components/GameListItem';
import DualSlider from './DualSlider';


//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/"
const STOREURL = "/api/steamapi/"//"/api/steamstore/"



interface Game {
  id: number;
  viewRank:number;
  rank: number;
  name: string;
  currentPlayers: number;
  peakPlayers: number;
  priceFormatted: number;
  priceCents: number;
  discount: number;
  visible: boolean;
  platforms: Array<string>
}

export default function ListingPage() {

  const [games, setGames] = useState<Game[]>([]);


  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const priceLimitState = useTypedSelector(selectPriceLimits);
  const discountState = useTypedSelector(selectDiscount);
  const gameInfoState = useTypedSelector(selectGameInfo);
  const includeFreeState = useTypedSelector(selectIncludeFree);


  useEffect(()=>{
    // do stuff here...

    
    const fetchData = async () => {
      try {
        const response = await fetch(APIURL+"?subdomain=api&path=ISteamChartsService/GetGamesByConcurrentPlayers/v1");
        const jsonData = await response.json();

        //TODO: temporary restriction to prevent flooding spamming servers accidentally
        const gameList = jsonData.response.ranks.slice(0, 50)

        gameList.forEach(async (game:any) => { //

          let newGame:Game = {
            name: "",
            id: game.appid,
            rank:game.rank,
            viewRank: game.rank,
            currentPlayers: game.concurrent_in_game,
            peakPlayers: game.peak_in_game,
            priceFormatted:0,
            priceCents:0,
            discount:0,
            visible:true,
            platforms:[]
          };


          try {
            const gameSpecResponse = await fetch(STOREURL + "?subdomain=store&path=api/appdetails?appids="+game.appid);
            const gameJson = await gameSpecResponse.json();
    
            var [gameObj]:any  = Object.values(gameJson);
            gameObj = gameObj.data;
            newGame.name = gameObj.name


            const rawPlatforms = Object.keys(gameObj.platforms).filter(key => gameObj.platforms[key] === true);
            var gamePlatforms = Array<string>();
            rawPlatforms.forEach(platform => {
              if (platform === "windows") {
                platform = "win"
              }
              gamePlatforms.push(platform)
            });
    
            newGame.platforms = gamePlatforms;
    
    

            if (!gameObj.is_free) {
              newGame.priceFormatted = gameObj.price_overview.final_formatted
              newGame.priceCents =gameObj.price_overview.final
              newGame.discount = gameObj.price_overview.discount_percent;
            }
          }
          catch (err) { }


          setGames(games => [...games,newGame])

  
        })



      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);




  useEffect(() => {
    setVisibilities(priceLimitState.minPrice, priceLimitState.maxPrice, discountState.minDiscount, discountState.maxDiscount, includeFreeState.include)    
  }, [priceLimitState.maxPrice, priceLimitState.minPrice, discountState.minDiscount, discountState.maxDiscount, includeFreeState.include]);


  const setVisibilities = (minPrice:number, maxPrice:number, minDiscount:number, maxDiscount:number, includeFree:boolean) => {
    console.log(minPrice)
    var rankedObjs = new Array<Game>();
    var rank = 1;
    //console.log(gamePrices)
    games.forEach((obj, ind) => {


      if ((obj.discount >= minDiscount-1 || minDiscount === 0)
         && ((obj.discount <= maxDiscount +1 || maxDiscount === 0))
         && (obj.priceCents <= maxPrice * 100 || maxPrice === 0)
         && (obj.priceCents >= minPrice * 100 || minPrice === 0)
         && ((includeFree || obj.priceCents !== 0))) {
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
      setGames(rankedObjs)
    }
    
  }

const onchange = (min:number, max:number) => {
  console.log(min, max)
}


  return (

	<div>

        Price Between
        <PriceFilter />
        Discount between (%)
        <DiscountFilter/>
        Include free games
        <IncludeFreeCheckBox/>
        <ul>
        {games.sort((a, b) => a.viewRank - b.viewRank).map((item) => (
          
          <div>
           <GameListItem key={item.id} id={item.id} rank={item.rank} viewRank={item.viewRank} currentPlayers={item.currentPlayers}
            peakPlayers={item.peakPlayers} 
            visible={item.visible} name={item.name} price={item.priceFormatted.toString()} discount={item.discount}
            platforms={item.platforms}/>


          </div>
          ))}
        </ul>

    </div>
  )
}

