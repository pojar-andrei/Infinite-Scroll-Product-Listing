(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('categoryCtrl', categoryCtrl)

	    function categoryCtrl ( $scope , products , galleryCategory ) {
			var vm = $scope.vm = {};
			vm.categorys = ['all'];

			$scope.$on("setCategorys", function (event,args) {
				vm.getCategorys();
			});

			vm.getCategorys = function(){
				vm.products = products.getproducts();
	            angular.forEach(vm.products,function(product){
					if(vm.categorys.indexOf(product.category) == -1){
						vm.categorys.push(product.category);
					}
				});
			}

			$scope.$watch('categorySelected', function( newValue , oldValue ) {
					galleryCategory.setCurrentCategory(newValue);
	        });
		};
})();