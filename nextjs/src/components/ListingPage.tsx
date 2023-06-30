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
const STOREURL = "/api/steamstore/"



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

        //TODO: temporary restriction to prevent flooding spamming servers accidentally
        const gameList = jsonData.response.ranks.slice(0, 10)

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
            const gameSpecResponse = await fetch(STOREURL + "?path=api/appdetails?appids="+game.appid);
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
    setVisibilities(maxPriceState.maxPrice, discountState.discount, includeFreeState.include)    
  }, [maxPriceState.maxPrice, discountState.discount, includeFreeState.include]);


  const setVisibilities = (maxPrice:number, discount:number, includeFree:boolean) => {
    var rankedObjs = new Array<Game>();
    var rank = 1;
    //console.log(gamePrices)
    games.forEach((obj, ind) => {


      if ((obj.discount >= discount-1 || discount === 0) &&
        (obj.priceCents <= maxPrice * 100 || maxPrice === 0) 
      && ((includeFree || obj.priceCents !== 0))) {//) { //(!includeFree && obj.price === 0) || 
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


  return (

	<div>
        Under (euros)
        <MaxPriceFilter />
        Discount over (%)
        <DiscountFilter/>
        Include free games
        <IncludeFreeCheckBox/>
        <ul>
        {games.sort((a, b) => a.viewRank - b.viewRank).map((item) => (
          
          <div>
           <GameListItem key={item.id} id={item.id} rank={item.rank} viewRank={item.viewRank} currentPlayers={item.currentPlayers}
            peakPlayers={item.peakPlayers} maxPrice={maxPriceState.maxPrice} minDiscount={discountState.discount}
            visible={item.visible} name={item.name} price={item.priceFormatted.toString()} discount={item.discount}
            platforms={item.platforms}/>


          </div>
          ))}
        </ul>

    </div>
  )
}

