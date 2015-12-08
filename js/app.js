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

.controller('LoginCtrl', ['$scope', '$http', 'firebaseService', function($scope, $http, firebaseService  ) {


		$scope.signUp = function() {
			var firstName = $scope.newUser.firstName;
			var lastName = $scope.newUser.lastName;
			var email = $scope.newUser.email;
			var password = $scope.newUser.password;
			firebaseService.signUp(firstName, lastName, email, password);
		};

		// LogIn function
		$scope.signIn = function() {
			var email = $scope.newUser.email;
			var password = $scope.newUser.password;
			firebaseService.returningAccount(password, email);


		};
		// LogOut function
		$scope.logOut = function() {
			firebaseService.logOut();

		};

	}])



// WORKS STARTING HERE
.factory('firebaseService', function($firebaseArray, $firebaseObject, $firebaseAuth) {
	var service = {};

	service.userInfo = {};

	var ref = new Firebase("https://snowcast343d.firebaseio.com");
	var reviewsRef = ref.child("allUserReviews");
	var resortNameRef = reviewsRef.child("resortName");
	var resortDescRef = reviewsRef.child("resortDesc");
	//user reference firebase
	var usersRef = ref.child('users');

	//creates new user
	service.users = $firebaseObject(usersRef);
	service.newUser = {};
	//adding authentication
	var Auth = $firebaseAuth(ref);

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

	service.signUp = function(firstName, lastName, email, password) {
		// Create user

		Auth.$createUser({

			'email': email,
			'password': password
		})
			// Once the user is created, call the logIn function
			.then(service.signIn(password, email))

			// Once logged in, set and save the user data
			.then(function(authData) {
				console.log("logged in");
				service.userId = authData.uid; //save userId

				service.users[authData.uid] = { //set up new information in our users object
					firstName:firstName,
					lastName:lastName
				}
				service.users.$save(); //save to firebase
			})
			// Catch any errors
			.catch(function(error) {
				console.error("Error: ", error);
			});
	};

	service.signIn = function(password, email) {
		console.log('log in');
		console.log(password);
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
			email: email,
			password: password
		})
	};

	service.returningAccount = function(password, email){
		ref.authWithPassword({
			email: email,
			password: password
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);

			}
		});
	};

	// LogOut function
	service.logOut = function() {
		Auth.$unauth();
	};

	// any time auth status updates, set the userId so we know
	Auth.$onAuth(function(authData) {
		if(authData) {
			console.log("login sucessful");
			service.userId = authData.uid;
		}
		else {
			service.userId = undefined;
			console.log("not logged in")
		}
	});

	// Test if already logged in (first time)
	var authData = Auth.$getAuth();
	if (authData) {
		service.userId = authData.uid;
	}

	return service;

});


