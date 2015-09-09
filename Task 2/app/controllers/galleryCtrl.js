(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('galleryCtrl', galleryCtrl)

	    function galleryCtrl ( $log , $scope, $rootScope, products , galleryCategory ) {
			var vm = $scope.vm = {};
			vm.limit = 0;
		   	vm.promise = products.getProductsDb(vm.limit);
		   	vm.dataLoading = false;

			vm.promise.then(
		        function(response) { 
		            vm.gallery = response.data;
		            products.setproducts(vm.gallery);
		            vm.gallery.filteredCategory = '';
		            $rootScope.$broadcast("setCategorys",vm.gallery);
		        },
		        function(errorResponse) {
		            $log.error('failure loading product', errorResponse);
	        });
			
			$scope.$watch(function(){
			    return galleryCategory.currentCategory;
			}, function (newValue) {
				if(newValue == 'all')
			    	vm.gallery.filteredCategory = '';
			    else
			    	vm.gallery.filteredCategory = newValue;
			});

			$scope.productAdd = function (product){
				$rootScope.$broadcast("addProduct",product);
			}

			$scope.$watch(function(){
			    return products.userPriceMin;
			}, function (newValue) {
				vm.gallery.priceMin = newValue;
			});

			$scope.$watch(function(){
			    return products.userPriceMax;
			}, function (newValue) {
				vm.gallery.priceMax = newValue;
			});

			$scope.showMore = function (){
				vm.limit += 20;
				vm.promise = products.getProductsDb(vm.limit);
				
				vm.promise.then(
			        function(response) {
			        	vm.dataLoading = false;
			        	if(response.data.length != 0){
			        		vm.dataLoading = true;      		
			        		vm.gallery.push.apply(vm.gallery,response.data);			
				           	vm.gallery.filteredCategory = '';
				            $rootScope.$broadcast("setCategorys",vm.gallery);
				        }else{
				        	vm.dataLoading = true; 
				        }
			        },
			        function(errorResponse) {
			          $log.error('failure loading product', errorResponse);

			        products.setproducts(vm.gallery);
		        });

			};
		};
})();