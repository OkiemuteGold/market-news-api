const PORT = process.env.PORT || 441;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// https://www.cryptonewsz.com/forecast/bitcoin-price-prediction/
// https://digitalcoinprice.com/forecast/bitcoin
// https://walletinvestor.com/forecast/bitcoin-prediction


const app = express();

/* welcome message */
const welcomeHtml = `
    <div>
        <h1>Welcome to my Node.js Stock News API</h1>
        <p>
            With this API, you can get live news update from the US Stock Market. <br> 
            From upcoming earnings to merger deals, and other related news.
        </p>
    </div>
`;

app.get("/", (req, res) => {
    res.send(welcomeHtml);
});

/* news sources */
const newsSources = [
    {
        name: "yahoo-finance",
        address: "https://finance.yahoo.com/news",
        baseUrl: "https://finance.yahoo.com",
        // image: ""
    },
    {
        name: "motley-fool",
        address: "https://www.fool.com/investing/stock-market",
        baseUrl: "https://www.fool.com",
        // image: ""
    },
    {
        name: "investorplace",
        address: "https://investorplace.com/category/todays-market",
        baseUrl: "",
        // image: ""
    },
    {
        name: "investopedia",
        address: "https://www.investopedia.com/markets-news-4427704",
        baseUrl: "",
        // image: "https://www.investopedia.com/thmb/dL21p3JDR2abR-vkPojxH_SOxLE=/296x197/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/nvidia_shutterstock_410214352-42af437bf9e740359eafc7b2ad6078ff.jpg"
    },
    {
        name: "insidertrades",
        address: "https://www.insidertrades.com/insider-alerts",
        baseUrl: "https://www.insidertrades.com",
        // image: ""
    },
    {
        name: "zacks",
        address: "https://www.zacks.com/articles/index.php",
        baseUrl: "https://www.zacks.com",
        // image: ""
    },
    {
        name: "businessinsider-news",
        address: "http://markets.businessinsider.com/news",
        baseUrl: "http://markets.businessinsider.com",
        // image: ""
    },
    {
        name: "businessinsider-stock",
        address: "http://markets.businessinsider.com/stocks",
        baseUrl: "http://markets.businessinsider.com",
        // image: ""
    },
    {
        name: "yahoo",
        address: "https://uk.yahoo.com/topics/news",
        baseUrl: "https://uk.yahoo.com",
        // image: ""
    },
    {
        name: "cnn",
        address: "https://money.cnn.com/data/markets",
        baseUrl: "",
        // image: ""
    },
];

/* news array initially empty */
const newsArticles = [];

/* get all articles from all news sources */
newsSources.forEach((newsSource) => {
    axios
        .get(newsSource.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("stock")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr("href");

                newsArticles.push({
                    title,
                    url: newsSource.baseUrl + url,
                    source: newsSource.name,
                });
            });
        })
        .catch((error) => console.log(`Error: ${error}`));
});

app.get("/news", (req, res) => {
    res.json(newsArticles);
});

/* get all articles from each news source */
app.get("/news/:newsSourceId", async (req, res) => {
    console.log(req.params);
    const newsSourceId = req.params.newsSourceId;

    const singleSourceAddress = newsSources.filter(
        (newsSource) => newsSource.name == newsSourceId
    )[0].address;

    const singleSourceBaseUrl = newsSources.filter(
        (newsSource) => newsSource.name == newsSourceId
    )[0].baseUrl;

    axios
        .get(singleSourceAddress)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const singleNewsArticles = [];

            $('a:contains("stock")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr("href");

                singleNewsArticles.push({
                    title,
                    url: singleSourceBaseUrl + url,
                    name: newsSourceId,
                });
            });

            res.json(singleNewsArticles);
        })
        .catch((error) => console.log(`Error: ${error}`));
});

/* listen to port */
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
