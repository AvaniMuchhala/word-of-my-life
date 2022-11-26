var movieAPIKey = "63d7ebc58121dff8f561b458dad5480f";
var wordOfDay = "matrix";
wordEl = document.getElementById("word");
wordEl.textContent = wordOfDay;
var movieSection = document.querySelector("#movie-data");
var movieRequestURL = "https://api.themoviedb.org/3/search/multi?query=" + wordOfDay + "&api_key=" + movieAPIKey;

fetch(movieRequestURL)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log(data.results);

        // Decide on num of results to display (maximum of first 5 results)
        if (data.results.length <= 5) {
            var numResults = data.results.length;
        } else {
            var numResults = 5;
        }

        // Loop through results and display media info for 5 results (movie or tv)
        var resultsDisplayed = 1;
        var i = 0; // index of data.results array
        while (resultsDisplayed <= numResults) {
            // If index is out of bounds, break out of while-loop
            if (i >= data.results.length) {
                break;
            }

            // Confirm that result's media type is not a person
            if (data.results[i].media_type !== "person") {

                // Check whether media is movie or TV to get title and release date
                var title = document.createElement("h2");
                var releaseDate = document.createElement("li");
                var genre = document.createElement("li");
                if (data.results[i].media_type === "movie") {
                    title.textContent = data.results[i].title;
                    if (data.results[i].release_date === "") {
                        releaseDate.textContent = "Release Date: none";
                    } else {
                        releaseDate.textContent = "Release Date: " + data.results[i].release_date;
                    }
                } else if (data.results[i].media_type === "tv") {
                    title.textContent = data.results[i].name;
                    if (data.results[i].first_air_date === "") {
                        releaseDate.textContent = "First Air Date: none";
                    } else {
                        releaseDate.textContent = "First Air Date: " + data.results[i].first_air_date;
                    }
                }

                // Movie/TV title
                movieSection.appendChild(title);

                // Media poster image
                if (data.results[i].poster_path !== null) {
                    var poster = document.createElement("img");
                    poster.setAttribute("src", "http://image.tmdb.org/t/p/w200//" + data.results[i].poster_path);
                    movieSection.appendChild(poster);
                }

                // Media type (movie or tv)
                var mediaType = document.createElement("li");
                mediaType.textContent = "Media Type: " + data.results[i].media_type;
                movieSection.appendChild(mediaType);

                // Release date
                movieSection.appendChild(releaseDate);

                // Summary/overview
                var summary = document.createElement("li");
                if (data.results[i].overview === "") {
                    summary.textContent = "Summary: none";    
                } else {
                    summary.textContent = "Summary: " + data.results[i].overview;
                }
                movieSection.appendChild(summary);
                
                resultsDisplayed++;
            }
            i++;
        }
    });