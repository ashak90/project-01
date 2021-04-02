
const MOVIE_DB_API = 'dc8aba4647cddc4a95994e5b2b372138'
const MOVIE_DB_FIRSTPART = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_LASTPART = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/150';
    
function requestMovies(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete) 
        .catch(onError);
}

function generateMovieDBUrl(path) {
    const url = `${MOVIE_DB_FIRSTPART}/3${path}?api_key=${MOVIE_DB_API}`;
    return url;
}

function getTopRatedMovies() {
    const url = generateMovieDBUrl(`/movie/top_rated`);
    const render = renderMovies.bind({ title: 'Top Rated Movies' })
    requestMovies(url, render, handleGeneralError);
}

function getNowPlayingMovies() {
    const url = generateMovieDBUrl('/movie/now_playing');
    const render = renderMovies.bind({ title: 'Now Playing Movies' })
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
    requestMovies(url, renderSearchMovies, handleGeneralError);
}
