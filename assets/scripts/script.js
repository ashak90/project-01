const log = console.log;

const searchButton = document.querySelector('#search');
const searchInput = document.querySelector('#search-input');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

// const searchButton = $("#search");
// const searchInput = $("#search-input");
// const moviesContainer = $("#movies-container");
// const moviesSearchable = $("#movies-searchable");

const whereToWatchContainer = $("#whereToWatch");

function createImageContainer(imageUrl, id) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}

function resetInput() {
    searchInput.value = '';
}

function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;

    return header;
}

function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}

function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader("Searched for: " + this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesSearchable.appendChild(moviesBlock);
}

function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, id } = movies[i];

        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
    
            const imageContainer = createImageContainer(imageUrl, id);
            section.appendChild(imageContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}

function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            <p id="content-close"></p>
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

function displayWhereToWatch(data, imgUrl){       
    whereToWatchContainer.show();
    createCard(data, imgUrl);        
}

function createCard(data, imgUrl){
    console.log(data);
    let newCard = $("<div>");
    newCard.addClass("card text-center bg-secondary");

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

    for(let i = 0; i < data.length; i++){
        let listItem = $("<li>");
        listItem.addClass("list-group-item bg-secondary");
        list.append(listItem);          
  
        let cardText = $("<p>");
        cardText.addClass("card-text");
        cardText.text(data[i].Watch);
        listItem.append(cardText);

        let button = $("<a>");
        button.addClass("btn btn-outline-light");
        button.text("Click here to stream!");
        button.attr("href", data[i].WatchUrl);
        listItem.append(button);        
    }
    whereToWatchContainer.append(newCard);
}

searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

   if (value) {    
    searchMovie(value);
    $(moviesContainer).hide();        
   }
    resetInput();
}

document.onclick = async function (event) {
    
    const { tagName, id } = event.target;       
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;        
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        const imgUrl = $(event.target).attr  ("src");         
        content.classList.add('content-display');
        const movieTitle = await getMovieNameFromId(movieId);                           
        getWhereToWatch(movieTitle, "movie", imgUrl);       
    }

    if (id === 'content-close') {
        const content = event.target.parentElement;
        content.classList.remove('content-display');
    }
}

whereToWatchContainer.hide();
searchUpcomingMovies();
getTopRatedMovies();
searchPopularMovie();
getTrendingMovies();
