(function(){
	var app = angular.module("Myapp",[]);
	
	app.controller('getMenu',function($scope){
		$scope.menus = window.menus;
	});

	app.controller('gallery',function($log , $scope, $rootScope, products , galleryCategory){
		var vm = $scope.vm = {};
	   	vm.promise = products.firstRun();
		vm.promise.then(
	        function(response) { 
	            vm.products = response.data;
	            products.setproducts(vm.products);
	            vm.products.filteredCategory = '';
	            $rootScope.$broadcast("setCategorys",vm.products);
	        },
	        function(errorResponse) {
	            $log.error('failure loading product', errorResponse);
        });

		$scope.$watch(function(){
		    return galleryCategory.currentCategory;
		}, function (newValue) {
			if(newValue == 'all')
		    	vm.products.filteredCategory = '';
		    else
		    	vm.products.filteredCategory = newValue;
		});

		$scope.productAdd = function (product){
			$rootScope.$broadcast("addProduct",product);
		}
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

	app.controller('AddCart',function($scope,$http,addCart){
		$scope.addCartProducts = addCart.getAddCart();
		$scope.totalPrice = addCart.getTotalPrice();
		$scope.$on("addProduct", function (event, args) {
			addCart.setAddCart( args );
			$scope.totalPrice = addCart.getTotalPrice();
		});

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

		products.getproducts = function(){

           return products.currentProducts;
		}

		products.setproducts = function( data ){
			products.currentProducts = data;
		}

		products.firstRun = function(){
			return $http.get('app/data/getproducts.php');
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
		galleryCategory.currentCategory = "";

		galleryCategory.getCurrentCategory = function(){

           return galleryCategory.currentCategory;
		}

		galleryCategory.setCurrentCategory = function( data ){
			debugger
			galleryCategory.currentCategory = data;
		}
	});
})();

