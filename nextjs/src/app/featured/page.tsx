"use client";
import "../globals.css";

import { Suspense, useEffect, useState } from "react";
import { Game } from "@/common/interfaces";
import {
    getAppDetails,
    getAppsDetails,
    getFeatured,
    getTop100,
} from "@/app/actions";
import ListingPage from "@/components/ListingPage";
import { parseGameDetails } from "@/common/utils";

export const dynamic = "force-dynamic";

const getGames = async () => {
    const featured = await getFeatured();

    return featured;
};

const Featured = () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const getFeatured = async () => {
            let featured = await getGames();

            let gameIds: number[] = [];

            Object.keys(featured)
                .forEach((category: string) => {
                    let isnum = /^\d+$/.test(category);
                    if (!isnum) {
                        if (featured[category].hasOwnProperty("items")) {
                            featured[category].items.forEach((game: any) => {
                                gameIds.push(game.id);
                            });
                        }
                    }
                });

            let rank = 0;

            for (let i = 0; i < gameIds.length; i++) {
                const setOfFive = gameIds.slice(i, i + 5);

                try {
                    const detailsOfFive = await getAppsDetails(
                        setOfFive.map((i) => i.toString())
                    );

                    let newGames: Game[] = [];

                    detailsOfFive.forEach((g, index) => {
                        let newGame: Game = {
                            name: "",
                            id: g.steam_appid,
                            rank: rank,
                            viewRank: rank,
                            currentPlayers: 0,
                            peakPlayers: 0,
                            priceFormatted: "0",
                            priceCents: 0,
                            discount: 0,
                            visible: false,
                            platforms: [],
                            description: "",
                            genres: [],
                            releaseDate: 0,
                        };
                        rank++;

                        try {
                            newGame = parseGameDetails(newGame, g);
                            if (!games.some((g) => g.id == newGame.id)) {
                                newGames.push(newGame);
                            }
                        } catch (e) {}
                    });
                    setGames((old) =>
                        [...old, ...newGames].filter(
                            (item, index, self) =>
                                index ===
                                self.findIndex((t) => t.id === item.id)
                        ).sort((a, b) => b.discount - a.discount)
                    );
                } catch (e) {
                    continue;
                }
            }
        };
        getFeatured();
    }, []);

    return (
        <div className="">
            <Suspense fallback={null}>
                <ListingPage games={games} enablePlayerCountFilter={false} />
            </Suspense>
        </div>
    );
};

export default Featured;

/*

*/
