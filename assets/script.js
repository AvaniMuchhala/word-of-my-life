// Selected elements
var wordSearch = document.querySelector(".input");
var button = document.querySelector(".button");
var wordEl = document.querySelector("#word");
var synonymEl = document.querySelector("#synonym");
var posEl = document.querySelector("#part-of-speech");
var definitionEl = document.querySelector("#definition");
var mediaSection = document.querySelector("#media-section");
var media = document.querySelector("#movies"); // target movie section
var books = document.querySelector("#books"); // target book section
var games = document.querySelector("#games"); // target game section

// API Key variables
var wordnikKey = "3873f7o2of4s3fj3bugv8zc0cdx8qufrpau3754t2dpvlrjz5";
var defineMRKey = "0d506d29-33ec-4e0b-ac9a-e584f336c692";
var synonymMRKey = "d051d5ac-5f7c-4338-8a27-3f68c90156c6";
var movieAPIKey = "63d7ebc58121dff8f561b458dad5480f";
var gameAPIKey = "c7ee19bccbec4b3587e1e8e9aff70902";

var wordOfDay = "";
var today = dayjs().format("YYYY-M-D");
var hasDictionaryDef;

function getGameData() {
    games.textContent = "";
    mediaSection.classList.remove("hide");

    var gameRequestURL = "https://api.rawg.io/api/games?key=" + gameAPIKey + "&search=" + wordOfDay + "&search_exact=true";
    fetch(gameRequestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Game results: ");
            console.log(data);

            // Game error in case no elements in "data.results"
            var gameError = document.createElement("h2");
            gameError.textContent = "No game content related to this word.";
            gameError.classList.add("is-size-5");
            if (data.results.length === 0) {
                games.append(gameError);
            } else {
                // Decide on num of results to display (maximum of first 5 results)
                if (data.results.length <= 5) {
                    var numResults = data.results.length;
                } else {
                    var numResults = 5;
                }

                for (var i = 0; i < numResults; i++) {
                    // Except for 1st result, display hor line break before displaying result
                    if (i >= 1) {
                        var lineBreak = document.createElement("hr");
                        games.append(lineBreak);
                    }

                    // Game name
                    var name = document.createElement("h2");
                    name.textContent = data.results[i].name;
                    name.classList.add("is-size-3","is-italic", "mt-3");

                    // Game poster image
                    var poster = document.createElement("img");
                    if (data.results[i].background_image) {
                        poster.setAttribute("src", data.results[i].background_image);
                    } else {
                        poster.setAttribute("src", "https://via.placeholder.com/150");
                    }

                    // Release date
                    var releaseDate = document.createElement("p");
                    if (releaseDate) {
                        releaseDate.innerHTML = "<b class='has-text-black'>Release Date:</b> " + data.results[i].released;
                    } else {
                        releaseDate.innerHTML = "<b class='has-text-black'>Release Date:</b> none";
                    }
                    releaseDate.classList.add("is-size-5");

                    games.append(name, poster, releaseDate);
                }
            }
        });    
}

function getBookData() {
    books.textContent = "";
    mediaSection.classList.remove("hide");

    var bookRequestURL = "https://openlibrary.org/search.json?title=" + wordOfDay;
    fetch(bookRequestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Book results: ");
            console.log(data);

            // Book error in case no elements in "data.docs"
            var bookError = document.createElement("h2");
            bookError.textContent = "No book content related to this word.";
            bookError.classList.add("is-size-5");
            if (data.docs.length === 0) {
                books.append(bookError);
            } else {

                // Decide on num of results to display (maximum of first 5 results)
                if (data.docs.length <= 5) {
                    var numResults = data.docs.length;
                } else {
                    var numResults = 5;
                }

                for (var i = 0; i < numResults; i++) {
                    // Except for 1st result, display hor line break before displaying result
                    if (i >= 1) {
                        var lineBreak = document.createElement("hr");
                        books.append(lineBreak);
                    }

                    // Book title
                    var title = document.createElement("h2");
                    title.textContent = data.docs[i].title;
                    title.classList.add("is-size-3", "has-text-white-ter", "is-italic", "mt-3");
                    books.appendChild(title);

                    // Book cover
                    var cover = document.createElement("img");
                    if (data.docs[i].cover_i) {
                        cover.setAttribute("src", "https://covers.openlibrary.org/b/id/" + data.docs[i].cover_i + "-M.jpg");
                        cover.setAttribute("alt", "book cover image");
                    } else {
                        cover.setAttribute("src", "https://via.placeholder.com/180x250");
                        cover.setAttribute("alt", "placeholder image for book cover");
                    }
                    books.appendChild(cover);

                    // Author name(s)
                    var authors = document.createElement("p");
                    if (data.docs[i].author_name === []) {
                        authors.innerHTML = "<b class='has-text-black'>Author(s):</b> none";
                    } else {
                        authors.innerHTML = "<b class='has-text-black'>Author(s):</b> " + data.docs[i].author_name.join(", ");
                    }
                    authors.classList.add("is-size-5");
                    books.appendChild(authors);

                    // Book subject(s)
                    var subjects = document.createElement("p");
                    if (data.docs[i].subject) {
                        // Show maximum of 10 subjects
                        var subjectsList;
                        if (data.docs[i].subject.length > 10) {
                            subjectsList = [];
                            for (var s = 0; s < 10; s++) {
                                subjectsList.push(data.docs[i].subject[s]);
                            }
                            subjectsList = subjectsList.join(", ");
                        } else {
                            subjectsList = data.docs[i].subject.join(", ")
                        }
                        subjects.innerHTML = "<b class='has-text-black'>Subject(s):</b> " + subjectsList;
                    } else {
                        subjects.innerHTML = "<b class='has-text-black'>Subject(s):</b> none";
                    }
                    subjects.classList.add("is-size-5");
                    books.appendChild(subjects);

                    // Read More link
                    var linkEl = document.createElement("a");
                    linkEl.innerHTML = "<b><u>Read More</u></b>";
                    linkEl.setAttribute("href", "https://openlibrary.org" + data.docs[i].key);
                    linkEl.setAttribute("target", "_blank");
                    linkEl.classList.add("is-size-5");
                    books.appendChild(linkEl);
                }
            }
        });
}

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
        getBookData();
        getGameData();
    } else if (window.localStorage.getItem(today)) {
        wordOfDay = window.localStorage.getItem(today);
        underline.textContent = wordOfDay;
        wordEl.appendChild(underline);

        getMRDefinition();
        getMovieData();
        getBookData();
        getGameData();
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
                getBookData();
                getGameData();
            });
    }
}

getWord();
button.addEventListener("click", getWord);