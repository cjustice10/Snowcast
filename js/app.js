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
	//List of names of supported ski resorts for dropdown select element id="skiResortName"
	$scope.skiResortNames = ['Crystal Mountain', 'Mt Baker', 'Stevens Pass'];

	//When a supported resort is selected, save the user's resort preference to firebase 
	$scope.favResortName;
	var updateFavResort = function(favResortName) {
		firebaseService.storeFavResort(favResortName);
	}

	//Variables to access forecast and current weather data using Yahoo proxy for JSONP request
	$scope.snowfall;
	$scope.snowfallUrl = "http://feeds.snocountry.net/conditions.php?apiKey=SnoCountry.example&ids=206002,206003,206004&output=json";
	$scope.yql_url = 'https://query.yahooapis.com/v1/public/yql';

	//jQuery AJAX get request using Yahoo Proxy for forecast and current weather data
	$.ajax({
	  'url': $scope.yql_url,
	  'data': {
	    'q': 'SELECT * FROM json WHERE url="'+$scope.snowfallUrl+'"',
	    'format': 'json',
	    'jsonCompat': 'new',
	  },
	  'dataType': 'jsonp',
	  'success': function(response) {
	    //console.log(response);
	    //console.log(response.query.results.json.items);
	    $scope.$apply(function() {
	    	$scope.snowfall=response.query.results.json.items;
	    	//Rename ski resorts for uniformity of data
	    	$scope.snowfall[0].resortName = "Crystal Mountain";
	    	$scope.snowfall[1].resortName = "Mt Baker";
	    	$scope.snowfall[2].resortName = "Stevens Pass";
	    })
	  },
	});

	//Variables to store and access data for road conditions from WSDOT
	$scope.roadData;
	$scope.roadConditions;
	$scope.roadQueryURL = "http://wsdot.com/Traffic/api/MountainPassConditions/MountainPassConditionsREST.svc/GetMountainPassConditionsAsJson?AccessCode=e7801fc3-06e0-485f-ac8a-da32b368e6d5&callback=JSON_CALLBACK";

	//AngualarJS JSONP GET request for road conditions from WSDOT
	$http.jsonp($scope.roadQueryURL)
	.then(function successCallback(response) {
    	$scope.roadData = response.data;
    	//console.log($scope.roadData);
    	$scope.roadConditions = [$scope.roadData[3], $scope.roadData[7], $scope.roadData[11]];
    	//Rename pass names to ski resort names for uniformity of data
    	$scope.roadConditions[0].MountainPassName = "Crystal Mountain";
    	$scope.roadConditions[1].MountainPassName = "Mt Baker";
    	$scope.roadConditions[2].MountainPassName = "Stevens Pass";
  	}, function errorCallback(response) {
    	console.log("Error!");
       	console.log(response.data);
  	});

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

		$scope.loggedIn = false;

		$scope.signUp = function() {
			var firstName = $scope.newUser.firstName;
			var lastName = $scope.newUser.lastName;
			var email = $scope.newUser.email;
			var password = $scope.newUser.password;
			firebaseService.signUp(firstName, lastName, email, password);
			$scope.loggedIn = firebaseService.loggedIn;


		};


		// LogIn function
		$scope.signIn = function() {
			var email = $scope.newUser.email;
			var password = $scope.newUser.password;
			firebaseService.returningAccount(password, email);
			$scope.loggedIn = firebaseService.loggedIn;


		};
		// LogOut function
		$scope.logOut = function() {
			firebaseService.logOut();
			$scope.loggedIn = firebaseService.loggedIn;
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
	var loggedIn;

	//creates new user
	service.users = $firebaseObject(usersRef);
	service.newUser = {};
	//adding authentication
	var Auth = $firebaseAuth(ref);

	service.resortName = $firebaseArray(resortNameRef);
	service.resortDesc = $firebaseArray(resortDescRef);

	//Stores a review, the resort the review is for and a timestamp
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
			service.loggedIn = true;
			service.userId = authData.uid;
		}
		else {
			service.loggedIn = false;
			service.userId = undefined;
			console.log("not logged in")
		}
	});

	var authData = Auth.$getAuth();
	if (authData) {
		service.loggedIn = true;
		service.userId = authData.uid;
	}else{
		service.loggedIn = false;
	}

	//Adds the favorite ski resort of a user based on their selection in the Snowcast page
	service.storeFavResort = function(resort) {
		/*service.favResort.$add({
			favResort: resort
		}).then(function() {
			$scope.favResort = resort;
			console.log('Favorite Resort Saved: ' + resort);
		})
	*/

		service.users[authData.uid] = { //set up new information in our users object
			favResort: resort,
		}
		service.users.$save(); //save to firebase
	}

		return service;
});


