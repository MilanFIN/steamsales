export interface Game {
    id: number;
    viewRank: number;
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
