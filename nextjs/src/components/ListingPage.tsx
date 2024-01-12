"use_client";

import { useCallback, useEffect, useState } from "react";

import PriceFilter from "@/components/PriceFilter";
import DiscountFilter from "@/components/DiscountFilter";
import IncludeFreeCheckBox from "@/components/IncludeFreeCheckBox";

//import IncludeFreeCheckBox from '@components/IncludeFreeCheckBox'
import GameListItem from "@/components/GameListItem";
import DualSlider from "./DualSlider";
import SortBy from "./SortBy";
import { Game } from "@/common/interfaces";

//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/";
const STOREURL = "/api/steamapi/"; //"/api/steamstore/"

export const useAddEventListener = () => {
    const addEventListener = useCallback(
        (
            target: HTMLElement | Window,
            eventKey: string,
            event: (e: Event) => void
        ) => {
            target.addEventListener(eventKey, event);
            return () => target.removeEventListener(eventKey, event);
        },
        []
    );
    return { addEventListener };
};

interface ListingPageProps {
    games: Game[];
    enablePlayerCountFilter: boolean;
}

export default function ListingPage(props: ListingPageProps) {
    const [games, setGames] = useState<Game[]>([]);

    const [width, setWidth] = useState(0);

    const [includeFree, setIncludeFree] = useState(true);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(999999);

    const [discountMin, setDiscountMin] = useState(0);
    const [discountMax, setDiscountMax] = useState(100);

    const [sortProperty, setSortProperty] = useState("playercount");
    const [activeItem, setActiveItem] = useState(-1);

    useEffect(() => {
        setVisibilities(
            priceMin,
            priceMax,
            discountMin,
            discountMax,
            includeFree,
            sortProperty
        );
    }, [
        props.games,
        includeFree,
        priceMin,
        priceMax,
        discountMin,
        discountMax,
        sortProperty,
        activeItem,
    ]);

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

    const hasGamesToDisplay = () => {
        return games.some((game: Game) => game.visible);
    };

    const { addEventListener } = useAddEventListener();
    useEffect(() => {
        setWidth(window.innerWidth);

        addEventListener(window, "resize", (e: any) => {
            setWidth(window.innerWidth);
        });
    });

    return (
        <div>
            <div className="pt-8 lg:flex justify-center flex-row-reverse flex-column">
                <div
                    className={`top-16 right-4   
                        ml-auto mr-auto
                        lg:mx-2
                        lg:mr-2
                        text-gray-100
                        bg-transparent
                        mt-8
                        h-auto
                        lg:h-96
                        
                        ${width >= 1024 ? "fixed w-[356px]" : "static w-4/6"}
                        `}
                >
                    <h2 className="text-center mb-4">Filters</h2>
                    <div
                        className={`${
                            width < 1024
                                ? "flex flex-wrap justify-evenly"
                                : "static"
                        }`}
                    >
                        <div
                            className={`${
                                width < 1024
                                    ? "flex flex-wrap justify-evenly"
                                    : "static"
                            }`}
                        >
                            <div className="mx-2">
                                <span className="ml-8 ">Price Between</span>
                                <PriceFilter
                                    updateMin={setPriceMin}
                                    updateMax={setPriceMax}
                                />
                            </div>
                            <div className="mx-2 mt-2">
                                <span className="ml-8">
                                    Discount between (%)
                                </span>
                                <DiscountFilter
                                    updateMin={setDiscountMin}
                                    updateMax={setDiscountMax}
                                />
                            </div>
                        </div>
                        <div>
                            <IncludeFreeCheckBox update={setIncludeFree} />
                            Include free games
                        </div>
                        <div>
                            <SortBy
                                filterByPlayerCount={
                                    props.enablePlayerCountFilter
                                }
                                updateSort={setSortProperty}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className={`lg:w-4/6
                             w-auto
                             bg-gray-700
                             ${width >= 1024 ? "mr-[400px]" : "mr-0"}
                             `}
                >
                    {props.games.length != 0 ? (
                        <div className="w-full h-full">
                            {hasGamesToDisplay() ? (
                                <ul>
                                    {games
                                        .sort((a, b) => a.viewRank - b.viewRank)
                                        .map((item) =>
                                            item.visible &&
                                            item.name.length != 0 ? (
                                                <GameListItem
                                                    key={item.id}
                                                    id={item.id}
                                                    rank={item.rank}
                                                    viewRank={item.viewRank}
                                                    currentPlayers={
                                                        item.currentPlayers
                                                    }
                                                    peakPlayers={
                                                        item.peakPlayers
                                                    }
                                                    visible={item.visible}
                                                    name={item.name}
                                                    price={item.priceFormatted.toString()}
                                                    discount={item.discount}
                                                    platforms={item.platforms}
                                                    description={
                                                        item.description
                                                    }
                                                    genres={item.genres}
                                                    releaseDate={
                                                        item.releaseDate
                                                    }
                                                    active={
                                                        activeItem == item.id
                                                    }
                                                    clicked={setActiveItem}
                                                    activeItem={activeItem}
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
