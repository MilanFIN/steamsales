import { Game } from "./interfaces";

const STOREURL = "/api/steamapi/"; //"/api/steamstore/"

export async function getGame(newGame:Game) {
	const url =
	STOREURL +
	"?subdomain=store&lang=english&currency=1&path=api/appdetails?appids=" +
	newGame.id;
  const gameSpecResponse = await fetch(url);
  const gameJson = await gameSpecResponse.json();

  var [gameObj]: any = Object.values(gameJson);
  gameObj = gameObj.data;
  newGame.name = gameObj.name;
  newGame.description = gameObj.detailed_description; //about_the_game //short_description

  if (gameObj.hasOwnProperty("genres")) {
	gameObj.genres.forEach((genreList: any) => {
		let genre: [number, string];
		genre = [parseInt(genreList.id), genreList.description];
		newGame.genres.push(genre);
	  });
	
  }

  const rawPlatforms = Object.keys(gameObj.platforms).filter(
	(key) => gameObj.platforms[key] === true
  );
  var gamePlatforms = Array<string>();
  rawPlatforms.forEach((platform) => {
	if (platform === "windows") {
	  platform = "win";
	}
	gamePlatforms.push(platform);
  });

  newGame.platforms = gamePlatforms;

  newGame.releaseDate = Date.parse(gameObj.release_date.date);

  if (!gameObj.is_free) {
	if (gameObj.price_overview == null) {
	  newGame.priceFormatted = "Price data missing";
	} else {
	  newGame.priceFormatted = gameObj.price_overview.final_formatted;
	  newGame.priceCents = gameObj.price_overview.final;
	  newGame.discount = gameObj.price_overview.discount_percent;
	}
  }

  return newGame;

}