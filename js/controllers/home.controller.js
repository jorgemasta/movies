(function() {
'use strict';

    angular
        .module('pelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'MoviesFactory'];
    function HomeController($scope, MoviesFactory) {
        var home = this;
        home.movies = [];
        home.movieSelected = {
            video: undefined
        };
        home.filtering = {
            yearLower: 1900,
            yearHigher: 2017,
            voteLower: 0,
            voteHigher: 10,
            genres: []
        }

        home.search = [];
        home.search.query = "";
        home.search.totalResults = 0;
        home.search.movies = [];

        home.totalResults = 0;

        /**********************************/
        home.yearSlider = {
            minValue: home.filtering.yearLower,
            maxValue: home.filtering.yearHigher,
            options: {
                floor: home.filtering.yearLower,
                ceil: home.filtering.yearHigher,
                step: 1,
                hideLimitLabels: true,
                selectionBarGradient: {
                    from: '#2783d8',
                    to: '#3db879'
                },
                onEnd: getFromSliders,
                id: 'year',
            }
        };

        home.voteSlider = {
            minValue: home.filtering.voteLower,
            maxValue: home.filtering.voteHigher,
            options: {
                floor: home.filtering.voteLower,
                ceil: home.filtering.voteHigher,
                step: 1,
                hideLimitLabels: true,
                selectionBarGradient: {
                    from: '#2783d8',
                    to: '#3db879'
                },
                onEnd: getFromSliders,
                id: 'vote',
            }
        };
        /**********************************/

        
        ////////////////
        home.getFilteredMovies = getFilteredMovies;
        home.getPopularMovies = getPopularMovies;
        home.getUpcomingMovies = getUpcomingMovies;
        home.getSearchMovies = getSearchMovies;
        home.filterByGenres = filterByGenres;
        home.isGenreSelected = isGenreSelected;
        home.openNav = openNav;
        home.clearFilters = clearFilters;
               

        activate();

        ////////////////

        function activate() {
        }

        ////////////////
       
        function getPopularMovies() {
            MoviesFactory.getPopular().then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getUpcomingMovies() {
            MoviesFactory.getUpcoming().then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getSearchMovies() {
            if (home.search.query == "") {
                home.search.totalResults = 0;
                home.search.movies = [];
            }
            else {
                MoviesFactory.getSearch(home.search.query).then(function(data){
                    home.search.totalResults = data.total;
                    home.search.movies = data.movies;
                    console.log(home.movies);
                });
            }
        }

        function getFromSliders(sliderId, modelValue, highValue) {
            switch(sliderId) {
                case "year":
                    home.filtering.yearLower = modelValue;
                    home.filtering.yearHigher = highValue;
                    break;
                case "vote":
                    home.filtering.voteLower = modelValue;
                    home.filtering.voteHigher = highValue;  
                    break;
            }

            getFilteredMovies();
        }

        function getFilteredMovies() {
            MoviesFactory.getFiltered(home.filtering).then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);        
            });
        }

        function filterByGenres(genreId) {
            var newGenre = true;
            home.filtering.genres.forEach(function(element, position) {
                if (element == genreId) {
                    newGenre = false;
                    home.filtering.genres.splice(position, 1);
                }
            });

            if (newGenre) home.filtering.genres.push(genreId);
            getFilteredMovies();
        }

        function isGenreSelected(genreId) {
            var isSelected = false;
            home.filtering.genres.forEach(function(element, position) {
                if (element == genreId) {
                    isSelected = true;
                }
            });

            return isSelected;
        }

        /////////////

        function openNav(movie) {
            console.log(movie);
            MoviesFactory.getMovie(movie).then(function(data){
                home.movieSelected = data;
                console.log(home.movieSelected);
            });
        }

        function clearFilters() {
            home.filtering = {
                yearLower: 1900,
                yearHigher: 2017,
                voteLower: 0,
                voteHigher: 10,
                genres: []
            }  
            home.yearSlider.minValue = home.filtering.yearLower;
            home.yearSlider.maxValue = home.filtering.yearHigher;
            home.voteSlider.minValue = home.filtering.voteLower;
            home.voteSlider.maxValue = home.filtering.voteHigher;

            getFilteredMovies();
        }
    }
})();