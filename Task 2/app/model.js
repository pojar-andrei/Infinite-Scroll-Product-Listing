(function(){
	var app = angular.module("Myapp",[]);
	
	app.controller('getMenu',function($scope){
		$scope.menus = window.menus;
	});

	app.controller('gallery',function($log , $scope, $rootScope , products){
		
	   	var promise = products.firstRun();
		
		promise.then(
          function(response) { 
              $scope.products = response.data;
          },
          function(errorResponse) {
              $log.error('failure loading product', errorResponse);
          });

		$scope.productAdd = function (product){
			$rootScope.$broadcast("addProduct",product);
		}
	});

	app.controller('getCategorys',function($scope,products){
		var promise = products.firstRun();
		 $scope.categorys = ['all'];
		 $scope.categorySelect = 'nimic';

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
		$scope.onChange = function(category){
				$scope.categorySelect = category;
				console.log(category+" and  "+$scope.categorySelect);
			}
	});

	app.controller('AddCart',function($scope,$http,addCart){
		$scope.addCartProducts = addCart.getAddCart();
		$scope.totalPrice = addCart.getTotalPrice();
		$scope.$on("addProduct", function (event, args) {
			addCart.setAddCart( args );
			$scope.totalPrice = addCart.getTotalPrice();
		});

		$scope.buyProducts = function(){
            $scope.errors = [];
            $scope.msgs = [];
            $scope.productsName = "";
            $scope.errors.splice(0, $scope.errors.length);
            $scope.msgs.splice(0, $scope.msgs.length);

            angular.forEach($scope.addCartProducts, function(product, key) {
				$scope.productsName = $scope.productsName+" "+$scope.addCartProducts[key].title+"->"+$scope.addCartProducts[key].amount+" ;";
			});
            
            $http.post('app/data/addProductsBought.php',{'ProductsName': $scope.productsName, 'TotalPrice': $scope.totalPrice}
            ).success(function(data, status, headers, config) {
                if (data.msg != '')
                {
                    $scope.msgs.push(data.msg);
                }
                else
                {
                    $scope.errors.push(data.error);
                }
            }).error(function(data, status) { 
                $scope.errors.push(status);
            });
		};
	});

	app.service('products',function($http){
		var products = this;
		products.totalProducts = [];
		products.currentProducts = [];

		products.getproducts = function(){

			$http.get('app/data/getproducts.php')
            	.success(function(response) {
                	products.currentProducts = response.data;
            });
            products.totalProducts = products.currentProducts;
           return products.currentProducts;
		}

		products.setproducts = function( data ){
			products.currentProducts = data;
		}

	   	return{
	   		firstRun : function(){
	   			return $http.get('app/data/getproducts.php');
	   	}
	   }
	});

	app.service('addCart',function($http){

		var addCart = this;
		addCart.products = [];

		addCart.setAddCart = function( data ){
			var added = 0;
			angular.forEach(addCart.products, function(product, key) {
				if(addCart.products[key].title == data.title){
					addCart.products[key].amount = addCart.products[key].amount + 1;
					added = 1;
				}
			 
			});
			if(added == 0)
			  {
			  	data['amount'] = 1;
			  	addCart.products.push(data);
			  }
		}

		addCart.getAddCart = function(){
			return addCart.products;
		}

		addCart.getTotalPrice = function(){
			var totalPrice = 0;
			angular.forEach(addCart.products, function(product, key) {
				totalPrice = totalPrice +(addCart.products[key].amount * addCart.products[key].price);
			});
			return totalPrice;
		}
	});
})();

