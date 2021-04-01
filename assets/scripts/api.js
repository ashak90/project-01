
const MOVIE_DB_API = 'dc8aba4647cddc4a95994e5b2b372138'
const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/150';
const WTW_URL = "https://watch-here.p.rapidapi.com/wheretowatch";
const RAPID_KEY = "0105f13aa9msh4ce35e271a592d6p1f8582jsn7e0ff44b7258";
const RAPID_HOST = "watch-here.p.rapidapi.com";

    
function requestMovies(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete) 
        .catch(onError);
}

function generateMovieDBUrl(path) {
    const url = `${MOVIE_DB_ENDPOINT}/3${path}?api_key=${MOVIE_DB_API}`;
    return url;
}

function getTopRatedMovies() {
    const url = generateMovieDBUrl(`/movie/top_rated`);
    const render = renderMovies.bind({ title: 'Top Rated Movies' })
    requestMovies(url, render, handleGeneralError);
}

function getTrendingMovies() {
    const url = generateMovieDBUrl('/trending/movie/day');
    const render = renderMovies.bind({ title: 'Trending Movies' })
    requestMovies(url, render, handleGeneralError);
}

function searchUpcomingMovies() {
    const url = generateMovieDBUrl('/movie/upcoming');
    const render = renderMovies.bind({ title: 'Upcoming Movies',})
    requestMovies(url, render, handleGeneralError);
}

function searchPopularMovie() {
    const url = generateMovieDBUrl('/movie/popular');
    const render = renderMovies.bind({ title: 'Popular Movies' });
    requestMovies(url, render, handleGeneralError);
}

function searchMovie(value) {
    const url = generateMovieDBUrl('/search/movie') + '&query=' + value;
    const renderSearch = renderSearchMovies.bind({ title: value});
    requestMovies(url, renderSearch, handleGeneralError);
}
function getVideosByMovieId(movieId, content) {
    const url = generateMovieDBUrl(`/movie/${movieId}/videos`);
    const render = getMovieFromId();
    requestMovies(url, render, handleGeneralError);
} 
async function getMovieFromId(movieId){
    const url = generateMovieDBUrl(`/movie/${movieId}`);      
    const res = await fetch(url);
    if(!res.ok) handleGeneralError;
    const data = await res.json();
    return await data;        
}

function getWhereToWatch(title, type, imgUrl){       
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
    $.ajax(settings).done(function (response) {
       displayWhereToWatch(JSON.parse(response), imgUrl);      
    });
 }
 
