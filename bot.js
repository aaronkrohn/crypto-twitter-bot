const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_APPKEY,
    appSecret: process.env.TWITTER_APPSECRET,
    accessToken: process.env.TWITTER_ACCESSTOKEN,
    accessSecret: process.env.TWITTER_ACCESSSECRET,
});

async function getCryptoPrices() {
    try {
        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano&vs_currencies=usd&include_24hr_change=true';
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        return null;
    }
}

async function postToTwitter(prices) {
    const btc = prices.bitcoin;
    const eth = prices.ethereum;
    const bnb = prices.binancecoin;
    const ada = prices.cardano;

    const tweet = `
  🪙 Crypto Prices Update:
  🚀 Bitcoin (BTC): $${btc.usd} (${btc.usd_24h_change.toFixed(2)}% 24h)
  🌐 Ethereum (ETH): $${eth.usd} (${eth.usd_24h_change.toFixed(2)}% 24h)
  🏦 Binance Coin (BNB): $${bnb.usd} (${bnb.usd_24h_change.toFixed(2)}% 24h)
  🔷 Cardano (ADA): $${ada.usd} (${ada.usd_24h_change.toFixed(2)}% 24h)
  `;

    try {
        await client.v2.tweet(tweet);
        console.log('Tweeted:', tweet);
    } catch (error) {
        console.error('Error tweeting:', error);
    }
}

const test = async () => {
    const prices = await getCryptoPrices();
    console.log(prices);

    if (prices) {
        await postToTwitter(prices);
    }
}
test()

// cron.schedule('0 9,17 * * *', async () => {
//     console.log('Fetching and tweeting crypto prices...');
//     const prices = await getCryptoPrices();
//     console.log(prices);
//     // if (prices) {
//     //     await postToTwitter(prices);
//     // }
// });
