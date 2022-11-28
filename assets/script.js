// API Key variables
var wordnikKey = '3873f7o2of4s3fj3bugv8zc0cdx8qufrpau3754t2dpvlrjz5';
var defineMRKey = '0d506d29-33ec-4e0b-ac9a-e584f336c692';
var synonymMRKey = 'd051d5ac-5f7c-4338-8a27-3f68c90156c6';

var wordOfDay = '';

// URL varriables
var randomUrl = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=' + wordnikKey;
var etmologyURL = 'https://api.wordnik.com/v4/word.json/' + wordOfDay + '/etymologies?useCanonical=false&api_key=' + wordnikKey;


// Gets the definition
function getWKDefinition() {
  var defineUrl = 'https://api.wordnik.com/v4/word.json/' + wordOfDay + '/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=' + wordnikKey;
  
  // Fetches Wordnik definition
  fetch(defineUrl)
    .then(function (response) {
      console.log(response);

      return response.json();
    })
    .then(function (data) {
      console.log(data);

      console.log('Part of Speech: ' + data[0].partOfSpeech);
      console.log('Definition, ' + data[0].attributionText + ': ' + data[0].text);

      fetch()
        .then(function (response) {
          console.log(response);
    
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        })
      
      getWKSynonyms();
    })
}

function getMRDefinition() {
  var redefineUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + wordOfDay + '?key=' + defineMRKey;

  // Fetches Merriam-Webster definition
  fetch(redefineUrl)
    .then(function (response) {
      console.log(response);

      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (data[0].shortdef) {
        console.log('Part of Speech: ' + data[0].fl);
        console.log('Definition, per Merriam-Webster: ' + data[0].shortdef[0]);
        console.log('Etmology:' + data[0].et[0][2]);
        getMRSynonyms();
      }
      else {
        getWKDefinition();
      }

      
    })
  
}

function getMRSynonyms() {
  var synonymMKUrl = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + wordOfDay + '?key=' + synonymMRKey;

  // Fetches synonyms via Merriam-Webster's API
  fetch(synonymMKUrl)
  .then(function (response) {
    console.log(response);

    return response.json();
  })
  .then(function (data) {
    console.log(data);

    var text = 'Synonyms: '
    
    console.log(text + data[0].syns.join(', '));
  })
}

function getWKSynonyms() {
  var synonymWKUrl = 'https://api.wordnik.com/v4/word.json/' + wordOfDay + '/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=' + wordnikKey;

  // Fetches synonyms via Merriam-Webster's API
  fetch(synonymWKUrl)
  .then(function (response) {
    console.log(response);

    return response.json();
  })
  .then(function (data) {
    console.log(data);

    var text = 'Synonyms: '
    
    console.log(text + data[0].syns.join(', '));
  })
}

// Gets word of the day
function getWord() {
  
  // Fetches a random word
  fetch(randomUrl)
    .then(function (response) {
      console.log(response);

      return response.json();
    })
    .then(function (data) {
      console.log(data);

      wordOfDay = data.word;
      console.log(wordOfDay);

      alert('The word of the day is: ' + wordOfDay + '.');
      
      if (confirm('Would you like a new word?')) {
        getWord();
      } else {
        alert('Cool. Enjoy your day!');

        getMRDefinition();
        // getSynonyms();
      }
    })
}

getWord();
