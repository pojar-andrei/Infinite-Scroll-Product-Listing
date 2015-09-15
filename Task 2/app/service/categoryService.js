(function() {
    'use strict';
	
	angular
	    .module('Myapp')
	    .service('categoryService', categoryService)

	    function categoryService ( $http ) {
	    	var categoryService = this;
			categoryService.categoryCurrent = '';

			categoryService.getCurrentCategory = function(){

	           return categoryService.categoryCurrent;
			}

			categoryService.setCurrentCategory = function( data ){
				categoryService.categoryCurrent = data;
			}
	    };
})();