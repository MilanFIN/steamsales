"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

import { store } from "../store/store";
import { Provider } from "react-redux";

import { selectPriceLimits } from "../store/priceLimitSlice";
import { selectDiscount } from "../store/discountSlice";
import { selectIncludeFree } from "../store/includeFreeSlice";

import { RootState } from "../store/store";
import { selectGameDetail } from "../store/gameDetailSlice";
import PriceFilter from "@/components/PriceFilter";
import DiscountFilter from "@/components/DiscountFilter";
import IncludeFreeCheckBox from "@/components/IncludeFreeCheckBox";

//import IncludeFreeCheckBox from '@components/IncludeFreeCheckBox'
import GameListItem from "@/components/GameListItem";
import DualSlider from "./DualSlider";
import SortBy from "./SortBy";
import { selectSortBy } from "@/store/SortBySlice";
import { Game } from "@/common/interfaces";

//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/";
const STOREURL = "/api/steamapi/"; //"/api/steamstore/"

interface ListingPageProps {
  games: Game[];
}

export default function ListingPage(props: ListingPageProps) {
  const [games, setGames] = useState<Game[]>([]);

  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const priceLimitState = useTypedSelector(selectPriceLimits);
  const discountState = useTypedSelector(selectDiscount);
  const gameDetailState = useTypedSelector(selectGameDetail);
  const includeFreeState = useTypedSelector(selectIncludeFree);
  const includeSortByState = useTypedSelector(selectSortBy);

  useEffect(() => {
    setVisibilities(
      priceLimitState.minPrice,
      priceLimitState.maxPrice,
      discountState.minDiscount,
      discountState.maxDiscount,
      includeFreeState.include,
      includeSortByState.property
    );
  }, [
    priceLimitState.maxPrice,
    priceLimitState.minPrice,
    discountState.minDiscount,
    discountState.maxDiscount,
    includeFreeState.include,
    includeSortByState.property,
  ]);

  /*
  useEffect(() => {
    setVisibilities(priceLimitState.minPrice, priceLimitState.maxPrice,
      discountState.minDiscount, discountState.maxDiscount,
      includeFreeState.include, includeSortByState.property);
  }, [games])
  */

  const sortHelper = (a: Game, b: Game, sortProperty: string) => {
    if (sortProperty == "priceAsc") {
      return a.priceCents - b.priceCents;
    } else if (sortProperty == "priceDesc") {
      return b.priceCents - a.priceCents;
    } else if (sortProperty == "name") {
      return a.name.localeCompare(b.name);
    } else if (sortProperty == "date") {
      return b.releaseDate - a.releaseDate;
    } else if (sortProperty == "discount") {
      return b.discount - a.discount;
    } else {
      return b.currentPlayers - a.currentPlayers;
    }
  };

  const setVisibilities = (
    minPrice: number,
    maxPrice: number,
    minDiscount: number,
    maxDiscount: number,
    includeFree: boolean,
    sortProperty: string
  ) => {
    var rankedObjs = new Array<Game>();
    var rank = 1;
    props.games
      .slice()
      .sort((a, b) => sortHelper(a, b, sortProperty))
      .forEach((obj, ind) => {
        if (
          (obj.discount >= minDiscount - 1 || minDiscount === 0) &&
          (obj.discount <= maxDiscount + 1 || maxDiscount === 0) &&
          (obj.priceCents <= maxPrice * 100 ||
            maxPrice === 0 ||
            maxPrice === 80) &&
          (obj.priceCents >= minPrice * 100 || minPrice === 0) &&
          (includeFree || obj.priceCents !== 0)
        ) {
          obj.visible = true;
          obj.viewRank = rank;
          rank++;
        } else {
          obj.visible = false;
        }
        rankedObjs.push(obj);
      });

    if (rankedObjs.length != 0) {
      setGames(rankedObjs);
    }
  };

  const hasGamesToDisplay = () => {
    return props.games.some((game) => game.visible);
  };

  return (
    <div>
      <div className="pt-8 lg:flex justify-center flex-row-reverse flex-column">
        <div
          className={`top-24 right-32   
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
                        
                          `}
        >
          <h2 className="text-center bg-gray-600 mb-4">Filters</h2>
          <div className="">
            <span className="ml-2">Price Between</span>
            <PriceFilter />
            <span className="ml-2">Discount between (%)</span>
            <DiscountFilter />
            <IncludeFreeCheckBox />
            Include free games
            <SortBy />
          </div>
        </div>

        <div
          className={`lg:w-4/6
                             w-full
                             bg-gray-700`}
        >
          {props.games.length != 0 ? (
            <div className="w-full h-full">
              {hasGamesToDisplay() ? (
                <ul>
                  {props.games
                    .sort((a, b) => a.viewRank - b.viewRank)
                    .map((item) =>
                      item.visible && item.name.length != 0 ? (
                        <GameListItem
                          key={item.id}
                          id={item.id}
                          rank={item.rank}
                          viewRank={item.viewRank}
                          currentPlayers={item.currentPlayers}
                          peakPlayers={item.peakPlayers}
                          visible={item.visible}
                          name={item.name}
                          price={item.priceFormatted.toString()}
                          discount={item.discount}
                          platforms={item.platforms}
                          description={item.description}
                          genres={item.genres}
                          releaseDate={item.releaseDate}
                          active={
                            gameDetailState.open &&
                            gameDetailState.id == item.id
                              ? true
                              : false
                          }
                        />
                      ) : null
                    )}
                </ul>
              ) : (
                <div className="text-gray-100  flex w-full h-full justify-center items-center flex-row">
                  <p className="ml-4 ">No results</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-100  flex w-full h-full justify-center items-center flex-row">
              <p className="animate-spin origin-[55%_52%] text-4xl">
                {"\u21BB"}
              </p>
              <p className="ml-4">Fetching games</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
