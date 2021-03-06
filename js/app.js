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
	$scope.runsOpen = [];
	$scope.mostRunsOpen = [];

	//Variables to access forecast and current weather data using Yahoo proxy for JSONP request
	$scope.snowfall;
	$scope.snowfallUrl = "http://feeds.snocountry.net/conditions.php?apiKey=SnoCountry.example&ids=206002,206003,206004&output=json";
	$scope.yql_url = 'https://query.yahooapis.com/v1/public/yql';

	//jQuery AJAX get request using Yahoo Proxy for forecast and current weather data to highlight the resort with the most number of runs open
	$.ajax({
	  'url': $scope.yql_url,
	  'data': {
	    'q': 'SELECT * FROM json WHERE url="'+$scope.snowfallUrl+'"',
	    'format': 'json',
	    'jsonCompat': 'new',
	  },
	  'dataType': 'jsonp',
	  'success': function(response) {
	    $scope.$apply(function() {
	    	$scope.snowfall=response.query.results.json.items;
	    	console.log($scope.snowfall);
	    	// Test to see if Mt.Baker gets displayed when it has the highest number of runs open
	    	// $scope.snowfall[1].maxOpenDownHillTrails = 1000;
	    	for($scope.i in $scope.snowfall) {
	    		$scope.runsOpen[$scope.i] = $scope.snowfall[$scope.i].maxOpenDownHillTrails;
	    		$scope.mostRunsOpen[$scope.i] = false;
	    	}
			$scope.max = $scope.runsOpen[0];
			$scope.maxIndex = 0;

			for ($scope.i in $scope.runsOpen) {
			    if ($scope.runsOpen[$scope.i] > $scope.max) {
			        $scope.maxIndex = $scope.i;
			        $scope.max = $scope.runsOpen[$scope.i];
			    }
			}

			$scope.mostRunsOpen[$scope.maxIndex] = true;
	    })
	  }
	});


}])

.controller('SnowcastCtrl', ['$scope', '$http', function($scope, $http) {
	//List of names of supported ski resorts for dropdown select element id="skiResortName"
	$scope.skiResortNames = ['Crystal Mountain', 'Mt Baker', 'Stevens Pass'];

	//When a supported resort is selected, save the user's resort preference to firebase
	$scope.favResortName = 'Crystal Mountain';
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
	  }
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

	var snowfallUrl = "http://feeds.snocountry.net/conditions.php?apiKey=SnoCountry.example&states=wa&resortType=Alpine&output=json";
	var yql_url = 'https://query.yahooapis.com/v1/public/yql';
	$scope.resortArray = [];
	$scope.sorter = '';
	$scope.sorter2 = '';

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
    	console.log(parseInt($scope.resortArray[0].avgBaseDepthMax));
    });

}])

.controller('SnowviewsCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', 'firebaseService', function($scope, $http, $firebaseArray, $firebaseObject, firebaseService) {
	//Array for rating dropdown
	$scope.ratingDrops = ['1', '2', '3', '4', '5'];
	$scope.ratingDrop = '';
	//Array for ski resort
	$scope.skiResortNames = ['Crystal Mountain', 'Mt. Baker', 'Stevens Pass'];
	$scope.skiResortName = '';



	//Submit the form
	//Calls storeReview function in .factory and passes in stored review info
	$scope.submitFunction = function() {

		//process the form get the data
		var storedRating = $scope.ratingDrop;
		var storedResortName = $scope.skiResortName;
		var storedResortDesc = $scope.skiResortDesc;
		//Get name of user, store it

		firebaseService.storeReview(storedRating, storedResortName, storedResortDesc);
		$scope.reset();


	}

	//Resets the form by clearing 
	$scope.reset = function() {
        $scope.skiResortName = '';
        $scope.ratingDrop = '';
        $scope.skiResortDesc = '';
    };

	$scope.userReviews = firebaseService.resortName;
	$scope.userList = firebaseService.users;
	console.log($scope.userList);

}])

//Prevents getting the not found page upon clicking submit button
.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $('#submitButton').click(function(event) {
            event.preventDefault();
        });
    }
})

.controller('LoginCtrl', ['$scope', '$http', 'firebaseService', '$firebaseArray', '$firebaseObject', function($scope, $http, firebaseService, $firebaseArray, $firebaseObject) {



		$scope.signUp = function() {
			var firstName = $scope.newUser.firstName;
			var lastName = $scope.newUser.lastName;
			var email = $scope.newUser.email;
			var password = $scope.newUser.password;
			firebaseService.signUp(firstName, lastName, email, password);
			$scope.userID = firebaseService.userId;

		};


		// LogIn function
		$scope.signIn = function() {
			var email = $scope.newUser.email;
			var password = $scope.newUser.password;

			firebaseService.returningAccount(password, email);
			$scope.userID = firebaseService.userId;


		};


		// LogOut function
		$scope.logOut = function() {
			firebaseService.logOut();
			$scope.userID = firebaseService.userId;
		};

	}])



.factory('firebaseService', function($firebaseArray, $firebaseObject, $firebaseAuth) {
	var service = {};

	service.userInfo = {};

	var ref = new Firebase("https://snowcast343d.firebaseio.com");
	
	var resortNameRef = ref.child("resortName");
	var resortDescRef = ref.child("resortDesc");

	//user reference firebase
	var usersRef = ref.child('users');

	//creates new user
	service.users = $firebaseObject(usersRef);
	service.newUser = {};
	//adding authentication
	var Auth = $firebaseAuth(ref);

	//firebaseArray for references
	service.resortName = $firebaseArray(resortNameRef);
	service.resortDesc = $firebaseObject(resortDescRef);

	//Actually save review
	service.storeReview = function(storedRating, storedResortName, storedResortDesc) {
		service.resortName.$add({
			rating: storedRating,
			resortName: storedResortName,
			resortDesc: storedResortDesc,
			time: Firebase.ServerValue.TIMESTAMP
		}).then(function(){
			storedResortName = '';
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
				service.userId = authData.uid;
				console.log("Authenticated successfully with payload:", authData);
			}
		});
	};

	// LogOut function
	service.logOut = function() {
		Auth.$unauth();
		service.userId = undefined;
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

		return service;

});
