// Selected elements
var wordSearch = document.querySelector(".input");
var button = document.querySelector(".button");
var wordEl = document.querySelector("#word");
var synonymEl = document.querySelector("#synonym");
var posEl = document.querySelector("#part-of-speech");
var definitionEl = document.querySelector("#definition");
var mediaSection = document.querySelector("#media-section");
var media = document.querySelector("#media");

// API Key variables
var wordnikKey = "3873f7o2of4s3fj3bugv8zc0cdx8qufrpau3754t2dpvlrjz5";
var defineMRKey = "0d506d29-33ec-4e0b-ac9a-e584f336c692";
var synonymMRKey = "d051d5ac-5f7c-4338-8a27-3f68c90156c6";
var movieAPIKey = "63d7ebc58121dff8f561b458dad5480f";

var wordOfDay = "";
var today = dayjs().format("YYYY-M-D");
var hasDictionaryDef;

function getMovieData() {
  media.textContent = "";
  mediaSection.classList.remove("hide");

  var movieRequestURL =
    "https://api.themoviedb.org/3/search/multi?query=" +
    wordOfDay +
    "&api_key=" +
    movieAPIKey;
  fetch(movieRequestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log("Movie/TV results: ");
      //console.log(data.results);

      // Movie error in case no elements in "data.results" or all results are people
      var movieError = document.createElement("h2");
      movieError.textContent = "No movie or TV content related to this word.";
      movieError.classList.add("is-size-5");
      if (data.results.length === 0) {
        media.append(movieError);
      } else {
        // Decide on num of results to display (maximum of first 5 results)
        if (data.results.length <= 5) {
          var numResults = data.results.length;
        } else {
          var numResults = 5;
        }

        // Loop through results and display media info for 5 results (movie or tv)
        var resultsDisplayed = 0;
        var i = 0; // index of data.results array
        while (resultsDisplayed < numResults) {
          // If index is out of bounds, break out of while-loop
          if (i >= data.results.length) {
            break;
          }

          // Confirm that result's media type is not a person
          if (data.results[i].media_type !== "person") {
            // Except for 1st result, display hor line break before displaying result
            if (resultsDisplayed >= 1) {
              var lineBreak = document.createElement("hr");
              media.append(lineBreak);
            }

            // Check whether media is movie or TV to get title and release date
            var title = document.createElement("h3");
            title.classList.add(
              "is-size-3",
              "has-text-white-ter",
              "is-italic",
              "mt-3"
            );
            var releaseDate = document.createElement("p");
            releaseDate.classList.add("is-size-5");
            // var genre = document.createElement("li");
            if (data.results[i].media_type === "movie") {
              title.textContent = data.results[i].title;
              if (data.results[i].release_date === "") {
                releaseDate.innerHTML =
                  "<b class='has-text-black'>Release Date:</b> none";
              } else {
                releaseDate.innerHTML =
                  "<b class='has-text-black'>Release Date:</b> " +
                  data.results[i].release_date;
              }
            } else if (data.results[i].media_type === "tv") {
              title.textContent = data.results[i].name;
              if (!data.results[i].first_air_date) {
                releaseDate.innerHTML =
                  "<b class='has-text-black'>First Air Date:</b> none";
              } else {
                releaseDate.innerHTML =
                  "<b class='has-text-black'>First Air Date:</b> " +
                  data.results[i].first_air_date;
              }
            }

            // Media poster image
            var poster = document.createElement("img");
            if (data.results[i].poster_path === null) {
              poster.setAttribute("src", "https://via.placeholder.com/200x250");
              poster.setAttribute(
                "alt",
                "placeholder image for movie/tv poster"
              );
            } else {
              poster.setAttribute(
                "src",
                "https://image.tmdb.org/t/p/w200//" +
                  data.results[i].poster_path
              );
              poster.setAttribute("alt", "movie/tv poster image");
            }

            // Media type (movie or tv)
            var mediaType = document.createElement("p");
            mediaType.innerHTML =
              "<b class='has-text-black'>Media Type:</b> " +
              data.results[i].media_type;
            mediaType.classList.add("is-size-5");

            // Summary/overview
            var summary = document.createElement("p");
            if (data.results[i].overview === "") {
              summary.innerHTML = "<b class='has-text-black'>Summary:</b> none";
            } else {
              summary.innerHTML =
                "<b class='has-text-black'>Summary:</b> " +
                data.results[i].overview;
            }
            summary.classList.add("is-size-5");

            media.append(title, poster, mediaType, releaseDate, summary);
            resultsDisplayed++;
          }
          i++;
        }

        // If no results were displayed (aka all results were people), display movie error
        if (resultsDisplayed === 0) {
          media.append(movieError);
        }
      }
    });
}

// Gets the synonyms from Wordnik
var syns;
function getWKSynonyms() {
  var synonymWKUrl =
    "https://api.wordnik.com/v4/word.json/" +
    wordOfDay +
    "/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=5&api_key=" +
    wordnikKey;
  synonymEl.innerHTML = "";
  var bold = document.createElement("b");

  // Fetches synonyms via Merriam-Webster"s API
  var status;
  fetch(synonymWKUrl).then(function (response) {
    //console.log(response);
    status = response.status;
    if (status === 404) {
      if (hasDictionaryDef) {
        synonymEl.textContent = "No synonyms found.";
      } else {
        synonymEl.textContent = "Try another word.";
      }
      return;
    }
  });

  fetch(synonymWKUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //data = response.json();
      if (status !== 404) {
        //console.log(response.json().Promise);
        //console.log(data);
        var text = "Synonoms: ";
        syns = data[0].words;
        bold.textContent = text;

        // Checks to see the list is an array of synonym arrays
        if (Array.isArray(syns[0])) {
          synonymEl.textContent = text + syns[0].join(", ");
        } else {
          synonymEl.textContent = text + syns.join(", ");
        }

        // Limits the amount of synonyms to 5
        if (syns.length > 5) {
          syns = syns.slice(0, 5);
          synonymEl.append(bold);

          synonymEl.textContent = text + syns.join(", ");
        } else {
          synonymEl.append(bold);

          synonymEl.textContent = text + syns.join(", ");
        }
      }
    });
}

// Gets the definition from Wordnik
function getWKDefinition() {
  var defineUrl =
    "https://api.wordnik.com/v4/word.json/" +
    wordOfDay +
    "/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=" +
    wordnikKey;
  posEl.innerHTML = "";
  definitionEl.innerHTML = "";
  var italics = document.createElement("em");

  // Fetches Wordnik definition
  fetch(defineUrl)
    .then(function (response) {
      //console.log(response);
      if (response.status === 404) {
        word.textContent =
          "There does not seem to be a definition for '" + wordOfDay + "'.";
        mediaSection.classList.add("hide");
        getWKSynonyms();
      } else {
        hasDictionaryDef = true;
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      var poSpeech = data[0].partOfSpeech;
      var defArray = data[0].text;
      italics.textContent = poSpeech;

      posEl.append(italics);
      definitionEl.textContent = defArray;
      getWKSynonyms();
    });
}

// Gets the synonyms from Merriam-Webster
function getMRSynonyms() {
  var synonymMKUrl =
    "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/" +
    wordOfDay +
    "?key=" +
    synonymMRKey;
  synonymEl.innerHTML = "";
  var bold = document.createElement("b");

  // Fetches synonyms via Merriam-Webster"s API
  fetch(synonymMKUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var text = "Synonyms: ";

      // Check if array has objects or is empty
      if (data[0].meta) {
        // Checks to see the list is an array of synonym arrays
        if (Array.isArray(data[0].meta.syns[0])) {
          var syns = data[0].meta.syns[0];
        } else {
          var syns = data[0].meta.syns;
        }
        bold.textContent = text;

        // Limits the amount of synonyms to 5 words
        if (syns.length > 5) {
          syns = syns.slice(0, 5);
          synonymEl.append(bold);

          synonymEl.append(syns.join(", "));
        } else {
          synonymEl.append(bold);

          synonymEl.append(syns.join(", "));
        }
      } else {
        getWKSynonyms();
      }
    });
}

// Gets the definition from Merriam-Webster
function getMRDefinition() {
  var redefineUrl =
    "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" +
    wordOfDay +
    "?key=" +
    defineMRKey;
  posEl.innerHTML = "";
  definitionEl.innerHTML = "";
  var italics = document.createElement("em");

  // Fetches Merriam-Webster definition
  fetch(redefineUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // Defaults to Wordnik if Merriam-Webster cannot define the word
      if (data.length > 0 && data[0].shortdef) {
        hasDictionaryDef = true;
        var poSpeech = data[0].fl;
        var defArray = data[0].shortdef;
        italics.textContent = poSpeech;
        posEl.append(italics);
        for (let i = 0; i < defArray.length; i++) {
          if (defArray.length === 1 || !defArray[i].includes(":")) {
            definitionEl.textContent = defArray[i];
            break;
          }
          continue;
        }
        getMRSynonyms();
      } else {
        getWKDefinition();
      }
    });
}

// Retrieves and sets a word for display
function getWord() {
  hasDictionaryDef = false;
  var randomUrl =
    "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=" +
    wordnikKey;

  wordEl.innerHTML = "";
  var underline = document.createElement("u");

  // Checks to where to source the word of the day
  if (wordSearch.value !== "") {
    wordOfDay = wordSearch.value;
    underline.textContent = wordOfDay;
    wordEl.appendChild(underline);

    getMRDefinition();
    getMovieData();
  } else if (window.localStorage.getItem(today)) {
    wordOfDay = window.localStorage.getItem(today);
    underline.textContent = wordOfDay;
    wordEl.appendChild(underline);

    getMRDefinition();
    getMovieData();
  } else {
    // Fetches a random word
    fetch(randomUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        wordOfDay = data.word;

        window.localStorage.setItem(today, wordOfDay);
        underline.textContent = wordOfDay;
        wordEl.appendChild(underline);

        getMRDefinition();
        getMovieData();
      });
  }
}

getWord();
button.addEventListener("click", getWord);
