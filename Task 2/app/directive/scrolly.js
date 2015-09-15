(function() {
    'use strict';
	
	angular
	    .module('Myapp')
	    .directive('scrolly', scrolly)

	    function scrolly(){
	    	return {
		        restrict: 'A',
		        link: function (scope, element, attrs) {
		            var raw = element[0];
		            element.bind('scroll', function () {
		            	
		                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
		                    scope.$apply(attrs.scrolly);
		                }
		            });
		        }
	    	};
	    };
})();