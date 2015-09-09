(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('rangeCtrl', rangeCtrl)

	    function rangeCtrl ( $scope , products) {
			$scope.sliderValue = 900;
			$scope.minValue = 10;
			$scope.maxValue = 1000;
	        $scope.lowerValue = 400;
	        $scope.upperValue = 600;

	        $scope.$watch(function(){
			    return products.priceMinMax;
			}, function (newValue) {
				$scope.lowerValue = newValue.min;
				$scope.upperValue = newValue.max;
				$scope.minValue = newValue.min;;
				$scope.maxValue = newValue.max;
			});

			$scope.$watch('lowerValue', function( newValue , oldValue ) {
					products.setUserPriceMin(newValue);
	        });

	        $scope.$watch('upperValue', function( newValue , oldValue ) {
					products.setUserPriceMax(newValue);
	        });
		};
})();