//api key
const apiKey ='a3DKmaWDWSIz6bd9N2rUpcflFlma6peNDZ3IUEsW';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

//Example query: https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=INSERT-API-KEY-HERE

//Format our query
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

//Searches parks based on parameters given
function getParks(query, maxResults = 10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayResults(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//Displays results
function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();
  if(responseJson.data.length <= 0) {
    $('#results-list').append('No results found. Check input and try again.');
  }
  // iterate through the data array
  for (let i = 0; i < responseJson.data.length; i++){
    //Display Park info:
    //Full name
    //Description
    //Website URL
    //Park address
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>Park Website</a>`
    );
    responseJson.data[i].addresses.forEach(element => {
      if(element.type === 'Physical') {
        $('#results-list').append(`
          <p>Address:<br>
          ${element.line1},<br>
          ${element.line2 !== '' ? element.line2 + ',<br>': ''}
          ${element.line3 !== '' ? element.line3 + ',<br>': ''}
          ${element.city}, ${element.stateCode} ${element.postalCode}</p>`
        );
      }
    });
    $('#results-list').append('</li>');
  }
  //display the results section  
  $('#results').removeClass('hidden');
};

//Event listener for submitting
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm.split(' '), maxResults);
  });
}
function initialize() {
  watchForm();
}

$(initialize);