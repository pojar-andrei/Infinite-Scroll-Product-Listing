(function() {
    'use strict';
	
	angular
	    .module('Myapp')
	    .filter('filterPrice', filterPrice)

	    function filterPrice () {
	    	var filterPrice = this;
			return function ( items , minPrice , maxPrice ){
				filterPrice.items = [];
				if(angular.isNumber(minPrice) && angular.isNumber(maxPrice) ){
					angular.forEach(items,function(product){
						if(minPrice <= product.price && product.price <= maxPrice) {
							filterPrice.items.push(product);
						}
					});
					return filterPrice.items;
				}
			}
	   	};
})();