var movieAPIKey = "63d7ebc58121dff8f561b458dad5480f";
var wordOfDay = "amazing";
wordEl = document.getElementById("word");
wordEl.textContent = wordOfDay;
var movieSection = document.querySelector("#movie-data");
var movieRequestURL = "https://api.themoviedb.org/3/search/multi?query=" + wordOfDay + "&api_key=" + movieAPIKey;

fetch(movieRequestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });