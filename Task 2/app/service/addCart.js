(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .service('addCart', addCart)

	    function addCart ( $http ) {
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

			addCart.deleteCartItem = function (data){
				addCart.products.splice(data, 1);
			}		

			addCart.getTotalPrice = function(){
				var totalPrice = 0;
				angular.forEach(addCart.products, function(product, key) {
					totalPrice = totalPrice +(addCart.products[key].amount * addCart.products[key].price);
				});
				return totalPrice;
			}

			addCart.flushAddCart = function(){
				return addCart.products = [];
			}
		};
})();