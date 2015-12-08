'use strict';

angular.module('SnowcastApp', ['ngSanitize', 'ui.router', 'ui.bootstrap','firebase'])
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

.controller('SnowviewsCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('LoginCtrl', ['$scope', '$http', '$firebaseAuth', '$firebaseArray', '$firebaseObject', function($scope, $http, $firebaseAuth,$firebaseArray, $firebaseObject ) {
		var baseRef = new Firebase('https://snowcast343d.firebaseio.com/');
		var usersRef = baseRef.child('users');

		$scope.users = $firebaseObject(usersRef);

		$scope.newUser = {}; //for sign-in

		/* Authentication */
		var Auth = $firebaseAuth(baseRef);

		$scope.signUp = function() {
			// Create user
			Auth.$createUser({
				'email': $scope.newUser.email,
				'password': $scope.newUser.password,
			})
				// Once the user is created, call the logIn function
				.then($scope.signIn)

				// Once logged in, set and save the user data
				.then(function(authData) {
					console.log("logged in");
					$scope.userId = authData.uid; //save userId

					$scope.users[authData.uid] = { //set up new information in our users object
						firstName:$scope.newUser.firstName,
						lastName:$scope.newUser.lastName,
					}
					$scope.users.$save(); //save to firebase
				})

				// Catch any errors
				.catch(function(error) {
					console.error("Error: ", error);
				});
		};

		// LogIn function
		$scope.signIn = function() {
			console.log('log in');
			/*ref.authWithPassword({
				email: $scope.newUser.email,
				password: $scope.newUser.password
			}, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					console.log("Authenticated successfully with payload:", authData);

				}
			});*/
			return Auth.$authWithPassword({
				email: $scope.newUser.email,
				password: $scope.newUser.password
			})

		};
		// LogOut function
		$scope.logOut = function() {
			Auth.$unauth();
		};

		// any time auth status updates, set the userId so we know
		Auth.$onAuth(function(authData) {
			if(authData) {
				$scope.userId = authData.uid;
			}
			else {
				$scope.userId = undefined;
			}
		});

		// Test if already logged in (first time)
		var authData = Auth.$getAuth();
		if (authData) {
			$scope.userId = authData.uid;
		}



	}]);

