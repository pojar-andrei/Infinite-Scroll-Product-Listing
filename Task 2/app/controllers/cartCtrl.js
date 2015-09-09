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
	            cartProducts.flushAddCart();
	            $scope.addCartProducts = cartProducts.getAddCart();
	            $scope.totalPrice = cartProducts.getTotalPrice();
			};
		};
})();