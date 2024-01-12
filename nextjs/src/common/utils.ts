import { Game } from "./interfaces";

export const parseGameDetails = (newGame:Game, gameObj:any) => {


	newGame.name = gameObj.name;
	newGame.description = gameObj.detailed_description;

	gameObj.genres.forEach((genreList: any) => {
		let genre: [number, string];
		genre = [
			parseInt(genreList.id),
			genreList.description,
		];
		newGame.genres.push(genre);
	});

	const rawPlatforms = Object.keys(
		gameObj.platforms
	).filter((key) => gameObj.platforms[key] === true);
	var gamePlatforms = Array<string>();
	rawPlatforms.forEach((platform) => {
		if (platform === "windows") {
			platform = "win";
		}
		gamePlatforms.push(platform);
	});

	newGame.platforms = gamePlatforms;

	newGame.releaseDate = Date.parse(
		gameObj.release_date.date
	);

	if (!gameObj.is_free) {
		if (gameObj.price_overview == null) {
			newGame.priceFormatted = "Price data missing";
		} else {
			newGame.priceFormatted =
				gameObj.price_overview.final_formatted;
			newGame.priceCents =
				gameObj.price_overview.final;
			newGame.discount =
				gameObj.price_overview.discount_percent;
		}
	}

	return newGame;
}