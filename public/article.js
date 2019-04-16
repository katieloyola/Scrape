console.log("yo");

$(document).on("click", ".save-article", function(e){
  e.preventDefault()
  console.log($(this).attr('data-id'));
  //send to route on server to find an article with that id
  //say that the article was saved
})