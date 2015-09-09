(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('getMenu', getMenu)

	    function getMenu ( $scope ) {
			$scope.menus = window.menus;
		};
})();