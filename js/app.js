'use strict';

angular.module('SnowcastApp', ['ngSanitize', 'ui.router', 'ui.bootstrap'])
.config(function($stateProvider){
	$stateProvider
		.state('home', {
			url: '',
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})
		.state('snowcast', {
			url: '/snowcast',
			templateUrl: 'partials/snowcast.html',
			controller: 'SnowcastCtrl'
		})
		.state('snowports', {
			url: '/snowports',
			templateUrl: 'partials/snowports.html',
			controller: 'SnowportsCtrl'
		})
		.state('snowviews', {
			url: '/snowviews',
			templateUrl: 'partials/snowviews.html',
			controller: 'SnowviewsCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl'
		})
})

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('SnowcastCtrl', ['$scope', '$http', function($scope, $http) {


}])

.controller('SnowportsCtrl', ['$scope', '$http', function($scope, $http) {

	var snowfallUrl = "http://feeds.snocountry.net/conditions.php?apiKey=SnoCountry.example&states=wa&resortType=Alpine&output=json";
	var yql_url = 'https://query.yahooapis.com/v1/public/yql';
	$scope.resortArray = [];

    $.ajax({
      'url': yql_url,
      'data': {
        'q': 'SELECT * FROM json WHERE url="'+snowfallUrl+'"',
        'format': 'json',
        'jsonCompat': 'new',
      },
      'dataType': 'jsonp',
      'success': function(response) {
        $scope.json = response.query.results.json.items;
      }     
    }).then(function() {
    	$scope.$apply(function() {
    		$scope.resortArray = $scope.json;
    	})
    	console.log($scope.resortArray);
    });

}])

.controller('SnowviewsCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {

}])