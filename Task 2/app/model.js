(function(){
	var app = angular.module("Myapp",[]);

	

	app.controller('getMenu',function($scope){
		$scope.menus = window.menus;
	});

	app.controller('gallery',function($log , $scope, getProducts){
		
	   	var promise = getProducts.getproducts();
		
		promise.then(
          function(response) { 
              $scope.products = response.data;
          },
          function(errorResponse) {
              $log.error('failure loading movie', errorResponse);
          });
	});

	app.controller('getCategorys',function($scope,getProducts){
		var promise = getProducts.getproducts();
		$scope.categorys = ['all'];

		promise.then(
          function(response) { 
              $scope.products = response.data;
            angular.forEach($scope.products,function(product){
				if($scope.categorys.indexOf(product.category) == -1){
					$scope.categorys.push(product.category);
				}
			});
          },
          function(errorResponse) {
              $log.error('failure loading movie', errorResponse);
          });

		$scope.cuurrProducts = function(){
			$scope.opCHANGE = $scope.myselect;
		}
	});

	app.factory('getProducts',function($http){
		var products = this;
		var currentProducts = this;
	   	return{
	   		getproducts: function(){
	   				return $http.get('app/data/products.php');
	   			}
	   	};
	});

})();