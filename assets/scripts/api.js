
const MOVIE_DB_API = 'dc8aba4647cddc4a95994e5b2b372138'
const MOVIE_DB_FIRSTPART = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_LASTPART = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/150';
const WTW_URL = "https://watch-here.p.rapidapi.com/wheretowatch";
const RAPID_KEY = "0105f13aa9msh4ce35e271a592d6p1f8582jsn7e0ff44b7258";
const RAPID_HOST = "watch-here.p.rapidapi.com";

//requests movies from the moviedb    
function requestMovies(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete) 
        .catch(onError);
}

//generates the url based on the movie path
function generateMovieDBUrl(path) {
    const url = `${MOVIE_DB_FIRSTPART}/3${path}?api_key=${MOVIE_DB_API}`;
    return url;
}

//gets a list of top rated movies
function getTopRatedMovies() {
    const url = generateMovieDBUrl(`/movie/top_rated`);
    const render = renderMovies.bind({ title: 'Top Rated Movies' })
    requestMovies(url, render, handleGeneralError);
}

//gets a list of now playing movies
function getNowPlayingMovies() {
    const url = generateMovieDBUrl('/movie/now_playing');
    const render = renderMovies.bind({ title: 'Now Playing Movies' })
    requestMovies(url, render, handleGeneralError);
}

//gets a list of upcoming movies
function searchUpcomingMovies() {
    const url = generateMovieDBUrl('/movie/upcoming');
    const render = renderMovies.bind({ title: 'Upcoming Movies',})
    requestMovies(url, render, handleGeneralError);
}

//gets a list of popular movies
function searchPopularMovie() {
    const url = generateMovieDBUrl('/movie/popular');
    const render = renderMovies.bind({ title: 'Popular Movies' });
    requestMovies(url, render, handleGeneralError);
}

//searches movie based on the value passed in
function searchMovie(value) {
    const url = generateMovieDBUrl('/search/movie') + '&query=' + value;
    //const url = generateMovieDBUrl(`/keyword/${value}`);
    const renderSearch = renderSearchMovies.bind({ title: value});
    requestMovies(url, renderSearch, handleGeneralError);
}

//returns the movie name from the database
async function getMovieNameFromId(movieId){
    const url = generateMovieDBUrl(`/movie/${movieId}`);      
    const res = await fetch(url);
    if(!res.ok) handleGeneralError;
    const data = await res.json();
    return await data.original_title;        
}

//using jquery's ajax function to call the where to watch api
function getWhereToWatch(title, type, imgUrl){      
    
    //params passed in with the post request
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": WTW_URL,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-rapidapi-key": RAPID_KEY,
            "x-rapidapi-host": RAPID_HOST
        },
        "processData": false,
        "data": `{\r\n    \"mediaType\": \"${type}\",\r\n \"platform\":true,\r\n    \"title\": \"${title}\"\r\n}`
    };
    //the actual request, calls the display where to watch function in scripts
    $.ajax(settings).done(function (response) {
       displayWhereToWatch(JSON.parse(response), imgUrl);      
    });
 }
 
