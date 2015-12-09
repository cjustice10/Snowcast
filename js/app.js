'use strict';

angular.module('SnowcastApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'ngCsvImport'])
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

	$scope.skiResortNames = ['Crystal Mountain', 'Mt Baker', 'Stevens Pass'];

	$scope.snowfall;
	$scope.snowfallUrl = "http://feeds.snocountry.net/conditions.php?apiKey=SnoCountry.example&ids=206002,206003,206004&output=json";
	$scope.yql_url = 'https://query.yahooapis.com/v1/public/yql';

	$.ajax({
	  'url': $scope.yql_url,
	  'data': {
	    'q': 'SELECT * FROM json WHERE url="'+$scope.snowfallUrl+'"',
	    'format': 'json',
	    'jsonCompat': 'new',
	  },
	  'dataType': 'jsonp',
	  'success': function(response) {
	    console.log(response);
	    console.log(response.query.results.json.items);
	    $scope.$apply(function() {
	    	$scope.snowfall=response.query.results.json.items;
	    	$scope.snowfall[0].resortName = "Crystal Mountain";
	    	$scope.snowfall[1].resortName = "Mt Baker";
	    	$scope.snowfall[2].resortName = "Stevens Pass";
	    })
	  },
	});

	$scope.roadData;
	$scope.roadConditions;

	$scope.roadQueryURL = "http://wsdot.com/Traffic/api/MountainPassConditions/MountainPassConditionsREST.svc/GetMountainPassConditionsAsJson?AccessCode=e7801fc3-06e0-485f-ac8a-da32b368e6d5&callback=JSON_CALLBACK";
	$http.jsonp($scope.roadQueryURL)
	.then(function successCallback(response) {
    	// this callback will be called asynchronously
    	// when the response is available
    	//console.log(response.data);
    	$scope.roadData = response.data;
    	console.log($scope.roadData);
    	$scope.roadConditions = [$scope.roadData[3], $scope.roadData[7], $scope.roadData[11]];
    	$scope.roadConditions[0].MountainPassName = "Crystal Mountain";
    	$scope.roadConditions[1].MountainPassName = "Mt Baker";
    	$scope.roadConditions[2].MountainPassName = "Stevens Pass";
  		console.log("Snoqualmie Pass");
  		console.log($scope.roadConditions);

  	}, function errorCallback(response) {
    	// called asynchronously if an error occurs
    	// or server returns response with an error status.
    	console.log("Error!");
       	console.log(response.data);
  	});


}])

.controller('SnowportsCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('SnowviewsCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {

}])