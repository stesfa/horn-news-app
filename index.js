const NEWS_API_URL = 'https://newsapi.org/v2/everything/';
let state = {
  query: "",
  page: 1,
}

const DEFAULT_IMAGES = {
  "djibouti": "https://upload.wikimedia.org/wikipedia/commons/6/69/Djibouti_-_Location_Map_%282013%29_-_DJI_-_UNOCHA.svg",
  "eritrea": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Eritrea_-_Location_Map_%282013%29_-_ERI_-_UNOCHA.svg",
  "ethiopia": "https://upload.wikimedia.org/wikipedia/commons/6/67/Ethiopia_-_Location_Map_%282013%29_-_ETH_-_UNOCHA.svg",
  "kenya": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Kenya_-_Location_Map_%282013%29_-_KEN_-_UNOCHA.svg",
  "somalia": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Somalia_-_Location_Map_%282011%29_-_SOM_-_UNOCHA.svg",
  "south-sudan": "https://upload.wikimedia.org/wikipedia/commons/5/5f/South_Sudan_-_Location_Map_%282012%29_-_SSD_-_UNOCHA.svg",
  "sudan": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sudan_-_Location_Map_%282011%29_-_SDN_-_UNOCHA.svg",
}


function getDataFromApi(searchTerm, callback) {
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const query = {
    apiKey: '8dc4120d989546a8956ad96fb349ee7d',
    q: searchTerm.replace("-", " "),
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: 12,
    from: oneWeekAgo,
    page: state.page,
  }
  $.getJSON(NEWS_API_URL, query, getDataSuccess);
}


function getDataSuccess(data){
  displayNewsAPISearchData(data);
  handleButtons(data);
}

function handleButtons(data){
  console.log("Handle Buttons");
  console.log(state.page);
  $('.previous').show();
  $('.next').show();

  if (state.page === 1) {
     $('.previous').hide();
  }; 
}

function renderResult(result) {
  let image = (result.urlToImage) ? result.urlToImage: DEFAULT_IMAGES[state.query];
  return `
    <div class="card w3-animate-opacity" aria-live>
      <a href="${result.url}" target="_blank">
        <div class="image-container container" style="background-image: url(${image})">
        </div>
      </a>
      <div class="news-title"><a href="${result.url}" target="_blank">${result.title}</a></div>
      <div class="description-container container">
        <p class="description">${result.description}</p>
      </div>
      <div class="source-container container">
        <p class="source"><b>Source:</b> ${result.source.name}</p>
      </div>
    </div>
  `;
}

function displayNewsAPISearchData(data) {
  const results = data.articles.map((article, index) => renderResult(article));
  // const clear = `<div class="clear"></div>`
  $('.result-menu').show()
  $('.result-menu').html(`Results For: "${state.query.charAt(0).toUpperCase() + state.query.slice(1)}" `)
  $('.js-search-results').html(results);
}

function watchClickStart() {
    $('body').on('click','.start', function(){
      $('.nations-container').hide();
      $('.info').hide();
      state.query = $(this).attr("id")
      getDataFromApi(state.query);
  })
}

function watchClickNext () {
  $('.next').click(function() {
    state.page = state.page + 1;
    getDataFromApi(state.query);
  });
}

function watchClickPrevious() {
  $('.previous').click(function() {
    state.page = state.page - 1;
    getDataFromApi(state.query);
  });
}

$(function() {
  watchClickStart()
  watchClickNext()
  watchClickPrevious()
});


