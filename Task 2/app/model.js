(function(){
	var app = angular.module("Myapp",['angularRangeSlider'], function ($rootScopeProvider) {
    $rootScopeProvider.digestTtl(1000);
});
	app.controller('getMenu',function($scope){
		$scope.menus = window.menus;
	});

	app.controller('gallery',function($log , $scope, $rootScope, products , galleryCategory){
		
		var vm = $scope.vm = {};
	   	vm.promise = products.firstRun();
	   	

	   	debugger
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
		debugger
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
			debugger
			vm.gallery.priceMin = newValue;
		});

		$scope.$watch(function(){
		    return products.userPriceMax;
		}, function (newValue) {
			debugger
			vm.gallery.priceMax = newValue;
		});

	});

	app.controller('getCategorys',function( $scope , products , galleryCategory){
		var vm = $scope.vm = {};
		vm.promise = products.firstRun();
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
	});

	app.controller('rangeCtrl',function( $scope , products){  	
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

	});

	app.controller('AddCart',function($scope,$http,addCart){

		$scope.addCartProducts = addCart.getAddCart();
		$scope.totalPrice = addCart.getTotalPrice();

		$scope.$on("addProduct", function (event, args) {
			addCart.setAddCart( args );
			$scope.totalPrice = addCart.getTotalPrice();
		});

		$scope.deleteProduct = function ( data ){
			addCart.deleteCartItem( data );
			$scope.addCartProducts = addCart.getAddCart();
			$scope.totalPrice = addCart.getTotalPrice();
		};

		$scope.buyProducts = function(){
            $scope.errors = [];
            $scope.msgs = [];
            $scope.productsName = "";
            $scope.errors.splice(0, $scope.errors.length);
            $scope.msgs.splice(0, $scope.msgs.length);

            angular.forEach($scope.addCartProducts, function(product, key) {
				$scope.productsName = $scope.productsName+" "+$scope.addCartProducts[key].title+"->"+$scope.addCartProducts[key].amount+" ;";
			});
            
            $http.post('app/data/addProductsBought.php',{'ProductsName': $scope.productsName, 'TotalPrice': $scope.totalPrice}
            ).success(function(data, status, headers, config) {
                if (data.msg != '')
                {
                    $scope.msgs.push(data.msg);
                }
                else
                {
                    $scope.errors.push(data.error);
                }
            }).error(function(data, status) { 
                $scope.errors.push(status);
            });
		};

	});

	app.service('products',function($http){
		var products = this;
		products.totalProducts = [];
		products.currentProducts = [];
		products.priceMinMax = {
			min: 0,
			max: 1000,
		};
		products.userPriceMin = 0;
		products.userPriceMax = 9999999;

		products.getproducts = function(){

           return products.currentProducts;
		}

		products.setproducts = function( data ){
			products.currentProducts = data;
			products.setPriceMinMax(products.currentProducts);
		}

		products.firstRun = function(){
			return $http.get('app/data/getproducts.php');
		}

		products.getPriceMinMax = function(){
			return products.priceMinMax;
		}

		products.setPriceMinMax = function( data ){
			products.price = {
				min: 9999999999999,
				max: -1,
			};
			if(data != null){
				angular.forEach(data,function(product){

					if(product.price > products.price.max)
						products.price.max = product.price;

					if(product.price < products.price.min)
						products.price.min = product.price;
				});
			}
			else{
				products.price.max = 0;
				products.price.min = 0;
			}
			debugger
			products.priceMinMax = products.price;
			products.setUserPriceMin(products.priceMinMax.min);
			products.setUserPriceMax(products.priceMinMax.max);
		}

		products.setUserPriceMin = function( data ){
			debugger
			return products.userPriceMin = data;
		}

		products.setUserPriceMax = function( data ){
			debugger
			return products.userPriceMax = data;
		}

	});

	app.service('addCart',function($http){

		var addCart = this;
		addCart.products = [];

		addCart.setAddCart = function( data ){
			var added = 0;
			angular.forEach(addCart.products, function(product, key) {
				if(addCart.products[key].title == data.title){
					addCart.products[key].amount = addCart.products[key].amount + 1;
					added = 1;
				}
			 
			});
			if(added == 0)
			  {
			  	data['amount'] = 1;
			  	addCart.products.push(data);
			  }
		}

		addCart.getAddCart = function(){
			return addCart.products;
		}

		addCart.deleteCartItem = function (data){
			addCart.products.splice(data, 1);
		}		

		addCart.getTotalPrice = function(){
			var totalPrice = 0;
			angular.forEach(addCart.products, function(product, key) {
				totalPrice = totalPrice +(addCart.products[key].amount * addCart.products[key].price);
			});
			return totalPrice;
		}
	});

	app.service('galleryCategory',function($http){
		var galleryCategory = this;
		galleryCategory.currentCategory = '';

		galleryCategory.getCurrentCategory = function(){

           return galleryCategory.currentCategory;
		}

		galleryCategory.setCurrentCategory = function( data ){
			galleryCategory.currentCategory = data;
		}
	});

	app.filter('filterPrice',function(){
		var filterPrice = this;
		return function ( items , minPrice , maxPrice ){
			filterPrice.items = [];
			debugger
			if(angular.isNumber(minPrice) && angular.isNumber(maxPrice) ){
				angular.forEach(items,function(product){
					debugger
					if(minPrice <= product.price && product.price <= maxPrice) {
						filterPrice.items.push(product);
					}
				});

				return filterPrice.items;
			}
		}
	});

})();

