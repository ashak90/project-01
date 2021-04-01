const INITIAL_SEARCH_VALUE = 'arnold';

const log = console.log;

const searchButton = document.querySelector('#search');;
const searchInput = document.querySelector('#search-input');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');
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
    for(let i = 0; i < data.length; i++){
        let newCard = $("<div>");
        newCard.addClass("card text-center bg-secondary");

        if(i == 0){
            let newImg = $("<img>");
             newImg.attr("src", imgUrl);
             newImg.addClass("card-img-top");
             newCard.append(newImg);
        }       

        let newBody = $("<div>");
        newBody.addClass("card-body");
        newCard.append(newBody);

        if(i == 0){
            let query = $("<h5>");
            query.addClass("card-title");
            query.text("Where to watch " + data[i].Query);
            newBody.append(query);
        }        

        let cardText = $("<p>");
        cardText.addClass("card-text");
        cardText.text(data[i].Watch);
        newBody.append(cardText);

        let button = $("<a>");
        button.addClass("btn btn-outline-light");
        button.text("Click here to stream!");
        button.attr("href", data[i].WatchUrl);
        newBody.append(button);

        whereToWatchContainer.append(newCard);
    }
}

async function getMovieNameFromId(movieId){
    const data = await getMovieFromId(movieId);
    return data.original_title;   
}

searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

   if (value) {    
    searchMovie(value);          
   }
    resetInput();
}

document.onclick = async function (event) {
    //log('Event: ', event);
    const { tagName, id } = event.target;       
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;        
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        const imgUrl = $(event.target).attr  ("src");         
        content.classList.add('content-display');
        const movieTitle = await getMovieNameFromId(movieId);                           
        getWhereToWatch(movieTitle, "movie", imgUrl);              
        //getVideosByMovieId(movieId, content);
    }

    if (id === 'content-close') {
        const content = event.target.parentElement;
        content.classList.remove('content-display');
    }
}

whereToWatchContainer.hide();
searchMovie(INITIAL_SEARCH_VALUE);
searchUpcomingMovies();
getTopRatedMovies();
searchPopularMovie();
getTrendingMovies();
