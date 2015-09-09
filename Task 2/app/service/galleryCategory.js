(function() {
    'use strict';
	
	angular
	    .module('Myapp')
	    .service('galleryCategory', galleryCategory)

	    function galleryCategory ( $http ) {
	    	var galleryCategory = this;
			galleryCategory.currentCategory = '';

			galleryCategory.getCurrentCategory = function(){

	           return galleryCategory.currentCategory;
			}

			galleryCategory.setCurrentCategory = function( data ){
				galleryCategory.currentCategory = data;
			}
	    };
})();