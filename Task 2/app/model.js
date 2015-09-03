(function(){
	var app = angular.module("Myapp",[]);

	app.controller('getMenu',function($scope){
		$scope.menus = window.menus;
	});

	app.controller('getProducts',function($scope, $http){
		$http.get('app/data/products.php')
	   		.success(function (response) {
	   			$scope.products = response;
	   		});

	});

})();