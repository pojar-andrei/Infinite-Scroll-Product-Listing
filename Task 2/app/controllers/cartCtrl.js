(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('cartCtrl', cartCtrl)

	    function cartCtrl ( $scope , $http , cartProducts ) {
			$scope.addCartProducts = cartProducts.getAddCart();
			$scope.totalPrice = cartProducts.getTotalPrice();

			$scope.$on("addProduct", function (event, args) {
				cartProducts.setAddCart( args );
				$scope.totalPrice = cartProducts.getTotalPrice();
			});

			$scope.deleteProduct = function ( data ){
				cartProducts.deleteCartItem( data );
				$scope.addCartProducts = cartProducts.getAddCart();
				$scope.totalPrice = cartProducts.getTotalPrice();
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


				 angular.forEach($scope.addCartProducts, function(product, key) {
				 	$scope.productsNameElem = {
				 		'name' 	: $scope.productsName,
				 		'type'	: $scope.addCartProducts[key].title,
				 		'amount': $scope.addCartProducts[key].amount,
				 	};
				 	$scope.productsNameArray.push($scope.productsNameElem);
				 });

	            $scope.productsNameString = angular.toJson($scope.productsNameArray);
	            debugger

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
	            $scope.addCartProducts = cartProducts.getAddCart();
	            $scope.totalPrice = cartProducts.getTotalPrice();
			};
		};
})();