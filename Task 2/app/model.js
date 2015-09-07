(function(){
	var app = angular.module("Myapp",[]);
	app.controller('getMenu',function($scope){
		$scope.menus = window.menus;
	});

	app.controller('gallery',function($log , $scope, Products){
		
	   	var promise = Products.firstRun();
		
		promise.then(
          function(response) { 
              $scope.products = response.data;
          },
          function(errorResponse) {
              $log.error('failure loading movie', errorResponse);
          });
	});

	app.controller('getCategorys',function($scope,Products){
		var promise = Products.firstRun();
		 $scope.categorys = ['all'];
		//
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
		debugger
		$scope.onChange = function(category){
				debugger
				firstSelect = category;
				console.log(category+" and  "+x);
			}
	});

	app.service('Products',function($http){
		var products = this;
		var currentProducts = this;

		function getproducts(){

			$http.get('nukes/nukes.json')
            	.success(function(response) {
                	currentProducts = response.data;
            });
            	debugger
            products = currentProducts;
           return currentProducts;
		}

		function setproducts( data ){
			debugger
			currentProducts = data;
		}

	   	return{
	   		firstRun : function(){
	   			return $http.get('app/data/getproduct.php');
	   	}
	   }
	});

})();