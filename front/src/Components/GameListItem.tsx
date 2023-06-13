

import React, { useEffect, useState } from 'react';

//const STOREURL = "http://localhost:3001/store/"
const STOREURL = process.env.REACT_APP_API_URL + "/store/"


interface GameListItemProps {
  id: number;
  rank: number;
  currentPlayers: number;
  peakPlayers: number;
  maxPrice: number
}

function GameListItem(props: GameListItemProps){

  const [name, setName] = useState<string>("");
  const [free, setFree] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [priceCents, setPriceCents] = useState<number>(0);
  const [discount, setDiscount] = useState<string>("");
  const [platforms, setPlatforms] = useState<Array<string>>([]);
  const [visible, setVisible] = useState(true);


  useEffect(()=>{

    
    const fetchData = async () => {
      try {
        const response = await fetch(STOREURL + "api/appdetails?appids="+props.id);
        const jsonData = await response.json();

        var [gameObj]:any  = Object.values(jsonData);
        gameObj = gameObj.data;

        setName(gameObj.name)

        const gamePlatforms = Object.keys(gameObj.platforms).filter(key => gameObj.platforms[key] === true);
        setPlatforms(gamePlatforms)

        if (!gameObj.is_free) {
          setPrice(gameObj.price_overview.final_formatted)
          setPriceCents(gameObj.price_overview.final)
          setDiscount(gameObj.price_overview.discount_percent)

        }
        else {
          setFree(true)
          setPrice("Free")
        }

      } catch (error) {
        //console.log(STOREURL + "api/appdetails?appids="+props.id)
        //console.log(gameObj.name)
        setPrice("?")
        //console.error('Error:', error, );
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    // This will run whenever `myProp` value changes
    console.log('myProp value changed:', props.maxPrice);
    if (priceCents <= props.maxPrice || props.maxPrice === 0) {
      setVisible(true)
    }
    else {
      setVisible(false)
    }
    
  }, [props.maxPrice]);


  return (
    <div>     
      {visible? 
          <div>
          
          <img src={"https://cdn.cloudflare.steamstatic.com/steam/apps/"+props.id+"/capsule_231x87.jpg"} alt={"game: "+props.id+" thumbnail"} />
          <br/>
          
          {props.rank}: {name}
          <br/>
          Current: 
          {props.currentPlayers}
          <br/>
          Price: {price}
          {discount != "" ?
          <span>, Discount: {discount} %</span>
          :
          null
          }
            {platforms.length > 0 && (
              <span>Platforms: {platforms.join(', ')}</span>
            )}
            <br/>
            Max price: {props.maxPrice}
            </div>
      : null
          }

     </div>

  )
}

export default GameListItem;
