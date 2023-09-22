"use client"

import { useEffect, useState } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";


import {store} from '../store/store'
import { Provider } from 'react-redux';

import { selectPriceLimits } from '../store/priceLimitSlice';
import { selectDiscount } from '../store/discountSlice';
import { selectIncludeFree } from '../store/includeFreeSlice';

import { RootState } from '../store/store';
import { selectGameDetail } from '../store/gameDetailSlice';
import PriceFilter from '@/components/PriceFilter';
import DiscountFilter from '@/components/DiscountFilter';
import IncludeFreeCheckBox from '@/components/IncludeFreeCheckBox';

//import IncludeFreeCheckBox from '@components/IncludeFreeCheckBox'
import GameListItem from '@/components/GameListItem';
import DualSlider from './DualSlider';
import SortBy from './SortBy';
import { selectSortBy } from '@/store/SortBySlice';


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
  priceFormatted: string;
  priceCents: number;
  discount: number;
  visible: boolean;
  platforms: Array<string>;
  description: string;
  genres: Array<[number, string]>;
  releaseDate: number;
}

export default function ListingPage() {

  const [games, setGames] = useState<Game[]>([]);


  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const priceLimitState = useTypedSelector(selectPriceLimits);
  const discountState = useTypedSelector(selectDiscount);
  const gameDetailState = useTypedSelector(selectGameDetail);
  const includeFreeState = useTypedSelector(selectIncludeFree);
  const includeSortByState = useTypedSelector(selectSortBy);


  useEffect(()=>{
    // do stuff here...

    const fetchData = async () => {
      try {
        const response = await fetch(APIURL+"?subdomain=api&lang=english&currency=1&path=ISteamChartsService/GetGamesByConcurrentPlayers/v1/");
        const jsonData = await response.json();

        const gameList = jsonData.response.ranks;

        //TODO: temporary restriction to prevent flooding spamming servers accidentally
        //const gameList = jsonData.response.ranks.slice(0, 50)

        gameList.forEach(async (game:any) => { //

          let newGame:Game = {
            name: "",
            id: game.appid,
            rank:game.rank,
            viewRank: game.rank,
            currentPlayers: game.concurrent_in_game,
            peakPlayers: game.peak_in_game,
            priceFormatted:"0",
            priceCents:0,
            discount:0,
            visible:false,
            platforms:[],
            description: "",
            genres:[],
            releaseDate: 0,
          };


          try {
            const url = STOREURL + "?subdomain=store&lang=english&currency=1&path=api/appdetails?appids="+game.appid;
            const gameSpecResponse = await fetch(url);
            const gameJson = await gameSpecResponse.json();
    
            var [gameObj]:any  = Object.values(gameJson);
            gameObj = gameObj.data;
            newGame.name = gameObj.name
            newGame.description = gameObj.detailed_description; //about_the_game //short_description

             gameObj.genres .forEach((genreList: any) => {
              let genre: [number, string];
              genre = [parseInt(genreList.id), genreList.description];
              newGame.genres.push(genre)
            })

            const rawPlatforms = Object.keys(gameObj.platforms).filter(key => gameObj.platforms[key] === true);
            var gamePlatforms = Array<string>();
            rawPlatforms.forEach(platform => {
              if (platform === "windows") {
                platform = "win"
              }
              gamePlatforms.push(platform)
            });
    
            newGame.platforms = gamePlatforms;

            newGame.releaseDate = Date.parse(gameObj.release_date.date);
    
    

            if (!gameObj.is_free) {

              if (gameObj.price_overview == null) {
                newGame.priceFormatted = "Price data missing";
              }
              else {
                newGame.priceFormatted = gameObj.price_overview.final_formatted
                newGame.priceCents =gameObj.price_overview.final
                newGame.discount = gameObj.price_overview.discount_percent;
              }

            }
          }
          catch (err) { }
          newGame.visible=true;
          setGames(games => [...games,newGame])
  
        })



      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);




  useEffect(() => {
    setVisibilities(priceLimitState.minPrice, priceLimitState.maxPrice,
                     discountState.minDiscount, discountState.maxDiscount,
                     includeFreeState.include, includeSortByState.property)    
  }, [priceLimitState.maxPrice, priceLimitState.minPrice, 
      discountState.minDiscount, discountState.maxDiscount, 
      includeFreeState.include,
      includeSortByState.property]);

      /*
  useEffect(() => {
    setVisibilities(priceLimitState.minPrice, priceLimitState.maxPrice,
      discountState.minDiscount, discountState.maxDiscount,
      includeFreeState.include, includeSortByState.property);
  }, [games])
  */

  const sortHelper = (a:Game, b:Game, sortProperty:string) => {
    if (sortProperty == "priceAsc") {
      return a.priceCents - b.priceCents;
    }
    else if (sortProperty == "priceDesc") {
      return b.priceCents - a.priceCents;
    }
    else if (sortProperty == "name") {
      return a.name.localeCompare(b.name)
    }
    else if (sortProperty == "date") {
      return b.releaseDate - a.releaseDate;
    }
    else if (sortProperty == "discount") {
      return b.discount - a.discount;
    }
    else {
      return b.currentPlayers - a.currentPlayers;
    }
  }

  const setVisibilities = (minPrice:number, maxPrice:number, minDiscount:number,
                           maxDiscount:number, includeFree:boolean, sortProperty:string) => {
    var rankedObjs = new Array<Game>();
    var rank = 1;
    games.slice().sort((a, b) => sortHelper(a, b, sortProperty)).forEach((obj, ind) => {


      if ((obj.discount >= minDiscount-1 || minDiscount === 0)
         && ((obj.discount <= maxDiscount +1 || maxDiscount === 0))
         && (obj.priceCents <= maxPrice * 100 || maxPrice === 0 || maxPrice === 80)
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

  const hasGamesToDisplay = () => {
    return games.some((game) => game.visible);
  }

  return (

	<div className="w-full bg-gradient-to-b from-gray-800 to-gray-900">



        <div className="pt-8 lg:flex justify-center flex-row-reverse flex-column">

        <div className={`top-24 right-32   
                        w-[350px]
                        ml-auto mr-auto
                        lg:mx-2
                        lg:mr-2
                        lg:w-[356px]
                        text-gray-100
                        bg-transparent
                        border-4
                        border-gray-600
                        mt-8
                        h-96
                        
                          `}>
              <h2 className="text-center bg-gray-600 mb-4">Filters</h2>
              <div className="">
                <span className="ml-2">
                  Price Between
                </span>
                <PriceFilter />
                <span className="ml-2">
                Discount between (%)
                </span>
                <DiscountFilter/>
                <IncludeFreeCheckBox/>
                Include free games
                <SortBy/>
              </div>

            </div>

            <div className={`lg:w-4/6
                             w-full
                             bg-gray-700`}>
              {games.length != 0 ? 
                        <div className="w-full h-full">
                          { hasGamesToDisplay() ? 

                            <ul>
                            {games.sort((a, b) => a.viewRank - b.viewRank).map((item) => (
                              
                              item.visible && item.name.length != 0 ? 
                              <GameListItem key={item.id} id={item.id} rank={item.rank} viewRank={item.viewRank} currentPlayers={item.currentPlayers}
                                peakPlayers={item.peakPlayers} 
                                visible={item.visible} name={item.name} price={item.priceFormatted.toString()} discount={item.discount}
                                platforms={item.platforms} description={item.description} genres={item.genres}
                                releaseDate={item.releaseDate}
                                active={gameDetailState.open && gameDetailState.id == item.id ? true: false}
                                />
                              
                              : null 
                              ))}
                            </ul>
                            :
                            
                            <div className="text-gray-100  flex w-full h-full justify-center items-center flex-row">
                              <p className="ml-4 ">No results</p>
                            </div>
          
                          }
                          </div>
              
              : 
                <div className="text-gray-100  flex w-full h-full justify-center items-center flex-row">
                  <p className="animate-spin origin-[55%_52%] text-4xl">{"\u21BB"}</p>
                  <p className="ml-4">Fetching games</p>

                  
                </div>}
            </div>
        </div>

    </div>
  )
}

