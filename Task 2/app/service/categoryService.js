(function() {
    'use strict';
	
	angular
	    .module('Myapp')
	    .service('categoryService', categoryService)

	    function categoryService ( $http ) {
	    	var categoryService = this;
			categoryService.currentCategory = '';

			categoryService.getCurrentCategory = function(){

	           return categoryService.currentCategory;
			}

			categoryService.setCurrentCategory = function( data ){
				categoryService.currentCategory = data;
			}
	    };
})();