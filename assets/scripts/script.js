const log = console.log;

const searchButton = document.querySelector("#search");
const searchInput = document.querySelector("#search-input");
const moviesContainer = document.querySelector("#movies-container");
const moviesSearchable = document.querySelector("#movies-searchable");
const backgroundImage = document.getElementById("bg");
const searchField = document.getElementById("search-bar");
const whereToWatchModal = document.getElementById("where-modal");

const whereToWatchContainer = $("#where-to-watch");
const recentSearchesEl = $("#recent-searches");
const searchCard = $("#search-card");
const clearBtn = $("#clear-btn");

let recentSearches = [];

//called when page first loads. gets all of the movie containers filled
function setup() {
   if (localStorage.getItem("searches") == null) {
      localStorage.setItem("searches", JSON.stringify(recentSearches));
   }
   loadSearchList();
   window.location.hash = "";
   searchCard.hide();
   whereToWatchContainer.hide();
   searchUpcomingMovies();
   getTopRatedMovies();
   searchPopularMovie();
}

//loads recently searched items from local storage
function loadSearchList() {
   let searchArray = JSON.parse(localStorage.getItem("searches"));   
   for (let search of searchArray) {
      createButton(search);
      //console.log(search);
   }
}

//creates an html container to hold movie images
function createImageContainer(imageUrl, id) {
   const tempDiv = document.createElement("div");
   tempDiv.setAttribute("class", "imageContainer");
   tempDiv.setAttribute("data-id", id);

   const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
   tempDiv.innerHTML = movieElement;

   return tempDiv;
}

//resets search input box to a blank string
function resetInput() {
   searchInput.value = "";
}

//gives a general error message
function handleGeneralError(error) {
   log("Error: ", error.message);
   alert(error.message || "Internal Server");
}

//creates and returns an html header element
function createSectionHeader(title) {
   const header = document.createElement("h2");
   header.innerHTML = title;
   return header;
}

//renders movies to the html page from movie block
function renderMovies(data) {
   const moviesBlock = generateMoviesBlock(data);
   const header = createSectionHeader(this.title);
   moviesBlock.insertBefore(header, moviesBlock.firstChild);
   moviesContainer.appendChild(moviesBlock);
}

//renders the movies the user searched for
function renderSearchMovies(data) {
   moviesSearchable.innerHTML = "";
   const moviesBlock = generateMoviesBlock(data);
   const header = createSectionHeader("Searched for: " + this.title);
   moviesBlock.insertBefore(header, moviesBlock.firstChild);
   moviesSearchable.appendChild(moviesBlock);
}

//creates the movie block that gets rendered
function generateMoviesBlock(data) {
   const movies = data.results;
   const section = document.createElement("section");
   section.setAttribute("class", "section");

   //loops through and gets the image url for each movie
   for (let i = 0; i < movies.length; i++) {
      const { poster_path, id } = movies[i];
      if (poster_path) {
         const imageUrl = MOVIE_DB_IMAGE_LASTPART + poster_path;
         const imageContainer = createImageContainer(imageUrl, id);
         section.appendChild(imageContainer);
      }
   }
   const movieSectionAndContent = createMovieContainer(section);
   return movieSectionAndContent;
}

//creates html container to hold movie elements
function createMovieContainer(section) {
   const movieElement = document.createElement("div");
   movieElement.setAttribute("class", "movie");
   const template = `
        <div class="content">
            <p id="content-close"></p>
        </div>
    `;
   movieElement.innerHTML = template;
   movieElement.insertBefore(section, movieElement.firstChild);
   return movieElement;
}

//creates where to watch card on the main page
function displayWhereToWatch(data, imgUrl) {
   whereToWatchContainer.show();
   whereToWatchContainer.empty();   
   createCard(data, imgUrl);
}

//creates all of the html elements for the where to watch list
function createCard(data, imgUrl) {
   console.log(data);
   let newCard = $("<div>");
   newCard.addClass("card text-center");
   newCard.attr("id", "custom-card");

   let newImg = $("<img>");
   newImg.attr("src", imgUrl);
   newImg.addClass("card-img-top");
   newCard.append(newImg);

   let newBody = $("<div>");
   newBody.addClass("card-body");
   newCard.append(newBody);

   let query = $("<h5>");
   query.addClass("card-title");
   query.text("Where to watch " + data[0].Query);
   newBody.append(query);

   let list = $("<ul>");
   list.addClass("list-group");
   newBody.append(list);

   //loops through and creates a list item for every place to watch
   for (let i = 0; i < data.length; i++) {
      let listItem = $("<li>");
      listItem.addClass("list-group-item");
      listItem.attr("id", "custom-card");
      list.append(listItem);

      let cardText = $("<p>");
      cardText.addClass("card-text");
      cardText.text(data[i].Watch);
      listItem.append(cardText);

      let button = $("<a>");
      button.addClass("btn btn-outline-dark");
      button.text("Click here to stream!");
      button.attr("href", data[i].WatchUrl);
      listItem.append(button);
   }
   whereToWatchContainer.append(newCard);
}

//sets recent searches from buttons and adds to localstorage
function setRecentSearch(searchName) {
   let buttonArray = recentSearchesEl.find("button");
   let invalid = false;
   let searchList = JSON.parse(localStorage.getItem("searches"));
   for (let i = 0; i < buttonArray.length; i++) {
      if (buttonArray[i].textContent == searchName) invalid = true;
      if (searchName == "" || searchName == null) invalid = true;
   }
   if (!invalid) {
      searchList.push(searchName);
      createButton(searchName);
      localStorage.setItem("searches", JSON.stringify(searchList));
   }
}
//gets data from recent search when clicked
function getRecentSearch(event) {
   let currentButton = $(event.target);
   searchInput.value = currentButton.text();
   runSearch(event);
}
function clearRecentSearch(){
    recentSearches = [];
    localStorage.setItem("searches", JSON.stringify(recentSearches));
    recentSearchesEl.empty();
}

//creates a button in the list with the correct bootstrap classes
function createButton(name) {
   let newButton = $("<button type='button'>");
   newButton.addClass("list-group-item list-group-item-action");
   newButton.text(name);
   recentSearchesEl.prepend(newButton);
}

function runSearch(event) {
   event.preventDefault();
   const value = searchInput.value;

   //only executes if there is a search value
   if (value) {
      searchCard.show();
      searchMovie(value);
      $(moviesContainer).hide();
      setRecentSearch(value);
   }
   resetInput();
}
clearBtn.on("click", clearRecentSearch);

recentSearchesEl.on("click", getRecentSearch);

//called when the search button is clicked on
searchButton.onclick = runSearch;

//called when anything is clicked on, async function because it needs to wait on the movie name call
document.onclick = async function (event) {
   const { tagName, id } = event.target;

   //only runs if the item clicked on is an image
   if (tagName.toLowerCase() === "img") {
      console.log("Clicked on an image");
      const movieId = event.target.dataset.movieId;
      const section = event.target.parentElement.parentElement;
      const content = section.nextElementSibling;
      const imgUrl = $(event.target).attr("src");
      content.classList.add("content-display");

      //waits until it gets the movie title back
      const movieTitle = await getMovieNameFromId(movieId);      
      getWhereToWatch(movieTitle, "movie", imgUrl);
      location.hash = "jump";
   }
   if (id === "content-close") {
      const content = event.target.parentElement;
      content.classList.remove("content-display");
   }
};
//basic setup when window loads
setup();
