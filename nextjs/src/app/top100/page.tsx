"use client";
import "../globals.css";

import { Inter } from "next/font/google";

import { SetStateAction, Suspense, useEffect, useRef, useState } from "react";
import { Game } from "@/common/interfaces";
import { getAppDetails, getAppsDetails, getTop100 } from "@/app/actions";
import ListingPage from "@/components/ListingPage";
import { parseGameDetails } from "@/common/utils";

export const dynamic = "force-dynamic";

const getGames = async () => {
    const top100 = await getTop100();

    return top100;
};

const Top100 = () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const getTop100 = async () => {
            const top100 = await getGames();

            for (let i = 0; i < top100.length; i += 5) {
                const setOfFive = top100.slice(i, i + 5);
                const detailsOfFive = await getAppsDetails(
                    setOfFive.map((s: { appid: string }) => s.appid)
                );
                let newGames: Game[] = [];
                detailsOfFive.forEach((g, index) => {
                    let newGame: Game = {
                        name: "",
                        id: g.steam_appid,
                        rank: setOfFive[index].rank,
                        viewRank: setOfFive[index].rank,
                        currentPlayers: setOfFive[index].concurrent_in_game,
                        peakPlayers: setOfFive[index].peak_in_game,
                        priceFormatted: "0",
                        priceCents: 0,
                        discount: 0,
                        visible: false,
                        platforms: [],
                        description: "",
                        genres: [],
                        releaseDate: 0,
                    };
                    newGame = parseGameDetails(newGame, g);
                    if (!games.some((g) => g.id == newGame.id)) {
                        newGames.push(newGame);
                    }
                });

                setGames((old) =>
                    [...old, ...newGames].filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t.id === item.id)
                    )
                );
            }
        };

        getTop100();
    }, []);

    return (
        <div className="">
            <Suspense fallback={null}>
                <ListingPage games={games} enablePlayerCountFilter={true} />
            </Suspense>
        </div>
    );
};

export default Top100;

/*

*/
