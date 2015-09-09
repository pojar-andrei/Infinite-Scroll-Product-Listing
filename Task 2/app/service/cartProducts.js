(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .service('cartProducts', cartProducts)

	    function cartProducts ( $http ) {
			var cartProducts = this;
			cartProducts.products = [];

			cartProducts.setAddCart = function( data ){
				var added = 0;
				angular.forEach(cartProducts.products, function(product, key) {
					if(cartProducts.products[key].title == data.title){
						cartProducts.products[key].amount = cartProducts.products[key].amount + 1;
						added = 1;
					}
				 
				});
				if(added == 0)
				  {
				  	data['amount'] = 1;
				  	cartProducts.products.push(data);
				  }
			}

			cartProducts.getAddCart = function(){
				return cartProducts.products;
			}

			cartProducts.deleteCartItem = function (data){
				cartProducts.products.splice(data, 1);
			}		

			cartProducts.getTotalPrice = function(){
				var totalPrice = 0;
				angular.forEach(cartProducts.products, function(product, key) {
					totalPrice = totalPrice +(cartProducts.products[key].amount * cartProducts.products[key].price);
				});
				return totalPrice;
			}

			cartProducts.flushAddCart = function(){
				return cartProducts.products = [];
			}
		};
})();