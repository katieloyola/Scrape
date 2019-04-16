var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");


module.exports = function(app){
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.ksl.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("div.headline").each(function (i, element) {
        // Save an empty result object
        var result = {};
        console.log(`${$(this).find('h5').text()}`);

        // Add the text and href of every link, and save them as properties of the result object
        result.title = `${$(this).find('a').text()}`
        result.link = `https://www.ksl.com${$(this).find('a').attr('href')}`
        result.summary = `${$(this).find('h5').text()}`

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
}