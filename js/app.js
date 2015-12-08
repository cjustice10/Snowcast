'use strict';

angular.module('SnowcastApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase'])
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
		.state('signup', {
			url: '/signup',
			templateUrl: 'partials/signup.html',
			controller: 'LoginCtrl'
		})
})

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('SnowcastCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.resorts = ['49 Degrees North','Bluewood','Crystal Mountain','Loup Loup','Mission Ridge','Mount Rainier','Mt Baker','Mt Spokane','Snoqualmie','Stevens Pass','Summit Central at Snoqualmie','Summit East at Snoqualmie','Summit West at Snoqualmie','White Pass'];

}])

.controller('SnowportsCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.resorts = ['49 Degrees North','Bluewood','Crystal Mountain','Loup Loup','Mission Ridge','Mount Rainier','Mt Baker','Mt Spokane','Snoqualmie','Stevens Pass','Summit Central at Snoqualmie','Summit East at Snoqualmie','Summit West at Snoqualmie','White Pass'];


}])

.controller('SnowviewsCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', 'firebaseService', function($scope, $http, $firebaseArray, $firebaseObject, firebaseService) {

	$scope.skiResortNames = ['Crystal Mountain', 'Mt. Baker', 'Stevens Pass', 'Summit Central at Snoqualmie'];
	$scope.skiResortName = '';
	// firebaseService.skiResortName = function(skiResortName) {
	// 	service.resortName.push(info);
	// }

	$scope.submitFunction = function() {
		//process the form get the data
		var storedResortName = $scope.skiResortName;
		var storedResortDesc = $scope.skiResortDesc;
		//Get name of user, store it
		firebaseService.storeReview(storedResortName, storedResortDesc);
	}

}])

.controller('LoginCtrl', ['$scope', '$http', '$firebaseAuth', '$firebaseArray', '$firebaseObject', function($scope, $http, $firebaseAuth,$firebaseArray, $firebaseObject ) {


}])


// WORKS STARTING HERE
.factory('firebaseService', function($firebaseArray) {
	var service = {};

	service.userInfo = {};

	var ref = new Firebase("https://snowcast343d.firebaseio.com");
	var reviewsRef = ref.child("allUserReviews")
	var resortNameRef = reviewsRef.child("resortName");
	var resortDescRef = reviewsRef.child("resortDesc");

	service.resortName = $firebaseArray(resortNameRef);
	service.resortDesc = $firebaseArray(resortDescRef);

	service.storeReview = function(storedResortName, storedResortDesc) {
		service.resortName.$add({
			resortName: storedResortName,
			resortDesc: storedResortDesc,
			// userId: $scope.newUser.firstName,
			time: Firebase.ServerValue.TIMESTAMP
		}).then(function(){
			$scope.skiResortName = '';
		})
	}
	return service;

});

