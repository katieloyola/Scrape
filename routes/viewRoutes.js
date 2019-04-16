var db = require("../models");
module.exports = function (app) {
  app.get('/', function(req, res){
    // TODO 20: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function (dbArticle) {
        res.render("home", {
          articles: dbArticle
        })
      })
      .catch(function (err) {
        res.json(err);
      })
  })
}