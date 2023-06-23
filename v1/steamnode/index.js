const express = require('express');
const axios = require('axios');
const cors = require('cors')

//require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3001;
const APIURL = "https://api.steampowered.com";
const STOREURL = "https://store.steampowered.com";

//ms, so converting from minutes
const maxAge = 60 * 60 * 1000

var cache = {} //use as {"endpoint": {"timestamp":<number>, "response":<json>}}


app.use(cors())

app.get('/api/*', async (req, res) => {
	try {
	  const endpoint  = req.params[0];

	  const fullEndpoint = "api/" + endpoint;

	  const timestamp = Date.now();

	   if (cache.hasOwnProperty(fullEndpoint)) {
		if (timestamp - cache[fullEndpoint]["timestamp"] < maxAge ) {
			return res.json(cache[fullEndpoint]["response"])
		}
	   }
	   
	  const apiUrl = `${APIURL}/${endpoint}`;
	  const response = await axios.get(apiUrl);
	  cache[fullEndpoint] = {};
	  cache[fullEndpoint]["timestamp"] = timestamp
	  cache[fullEndpoint]["response"] = response.data
	  res.json(response.data);
	} catch (error) {
	  console.error('Error:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
  
app.get('/store/*', async (req, res) => {
	try {
		var endpoint  = req.params[0];
		const queryParams = req.query;
  
		if (queryParams.length != 0) {
			endpoint += "?"

			for (const [key, value] of Object.entries(queryParams)) {
				endpoint += key + "=" + value + "&"
			}		
		}

		const fullEndpoint = "store/" + endpoint;

		const timestamp = Date.now();
  
		 if (cache.hasOwnProperty(fullEndpoint)) {
		  if (timestamp - cache[fullEndpoint]["timestamp"] < maxAge ) {
			  return res.json(cache[fullEndpoint]["response"])
		  }
		 }
		 
		const apiUrl = `${STOREURL}/${endpoint}`;

		const response = await axios.get(apiUrl);
		cache[fullEndpoint] = {};
		cache[fullEndpoint]["timestamp"] = timestamp
		cache[fullEndpoint]["response"] = response.data
		res.json(response.data);
	  } catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	  }
});


  /*
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});
*/


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});