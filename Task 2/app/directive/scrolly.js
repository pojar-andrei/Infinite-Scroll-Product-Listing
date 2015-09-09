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
		            console.log('loading directive');
		            element.bind('scroll', function () {
		                console.log('in scroll');
		                console.log(raw.scrollTop + raw.offsetHeight);
		                console.log(raw.scrollHeight);
		                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
		                    console.log("I am at the bottom");
		                    scope.$apply(attrs.scrolly);
		                }
		            });
		        }
	    	};
	    };
})();