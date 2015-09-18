(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('cartCtrl', cartCtrl)

	    function cartCtrl ( $scope , $http , $localStorage , cartProducts ) {

	    	$scope.timeout;
	    	$localStorage.storeCartProduct = [];	
	    	if($localStorage.storeCartProduct){
				$scope.addCartProducts = $localStorage.storeCartProduct;
				cartProducts.setAddCartStorage($scope.addCartProducts);
	    	}else{
	    		$scope.addCartProducts = cartProducts.getAddCart();
	    	}
			$scope.totalPrice = cartProducts.getTotalPrice();

			$scope.$on("addProduct", function (event, args) {				
				cartProducts.setAddCart( args );
				$scope.addCartProducts = cartProducts.getAddCart();
				$scope.totalPrice = cartProducts.getTotalPrice();
				$localStorage.storeCartProduct = $scope.addCartProducts;
			});

			$scope.deleteProduct = function ( data ){
				cartProducts.deleteCartItem( data );
				$scope.addCartProducts = cartProducts.getAddCart();
				$scope.totalPrice = cartProducts.getTotalPrice();
				$localStorage.storeCartProduct = $scope.addCartProducts;
			};

			$scope.buyProducts = function(){
	            $scope.errors = [];
	            $scope.msgs = [];
	            $scope.productsName = "";
	            $scope.productsNameElem = {};
	            $scope.productsNameArray = [];
	            $scope.productsNameString = "";
	            $scope.errors.splice(0, $scope.errors.length);
	            $scope.msgs.splice(0, $scope.msgs.length);
	            if ($scope.addCartProducts.length) {
					 angular.forEach($scope.addCartProducts, function(product, key) {
					 	$scope.productsNameElem = {
					 		'title' 	: 	product.title,
					 		'category'	: 	product.category,
					 		'amount'	: 	product.amount,
					 	};
					 	$scope.productsNameArray.push($scope.productsNameElem);
					 });

		            $scope.productsNameString = angular.toJson($scope.productsNameArray);

		            $http.post('app/data/addProductsBought.php',{'ProductsName': $scope.productsNameString, 'TotalPrice': $scope.totalPrice}
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
		            cartProducts.flushAddCart();
		            $localStorage.storeCartProduct = {};
		            $scope.addCartProducts = cartProducts.getAddCart();
		            $scope.totalPrice = cartProducts.getTotalPrice();
		        };
			};

		};
})();