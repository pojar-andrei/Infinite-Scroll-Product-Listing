(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .controller('galleryCtrl', galleryCtrl)

	    function galleryCtrl ( $log , $scope, $rootScope, products , categoryService ) {
	    	
			var vm = $scope.vm = {};
			vm.limit = 0;
		   	vm.promise = products.getProductsDb(vm.limit);
		   	vm.dataLoading = false;
		   	if ((products.getproducts()).length == 0) {
			   	vm.gallery = [];
			   	vm.gallery.filteredCategory = '';		   	

				vm.promise.then(
			        function(response) { 
			            vm.gallery = response.data;
			            products.setproducts(vm.gallery);
			            $rootScope.$broadcast("setCategorys",vm.gallery);
			        },
			        function(errorResponse) {
			            $log.error('failure loading product', errorResponse);
		        });

		    }else{
		    	vm.gallery = products.getproducts();
		    }
			
			$scope.$watch(function(){
			    return categoryService.categoryCurrent;
			}, function (newValue) {
				if(newValue == 'all'){
			    	vm.gallery.filteredCategory = '';
				
			    }else{
			    	if (newValue) {
			    		vm.gallery.filteredCategory = newValue;
			    	}
			    	else{
			    		vm.gallery.filteredCategory = '';
			    	}
			    }

			    $scope.filteredCategory = vm.gallery.filteredCategory;
			});

			$scope.viewProduct = function (product){
				products.setViewProduct(product);
			}

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