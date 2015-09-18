(function(){
	var app = angular.module("Myapp",['ngStorage' ,'ui.router']);

	app.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/home");
		  
		$stateProvider
		    .state('home', {
		      url: "/home",
		      templateUrl: "app/temp/home_temp.html"
		    })
		    .state('products', {
		      url: "/products",
		      templateUrl: "app/temp/products_temp.html",
		    })
		    .state('about', {
		      url: "/about",
		      templateUrl: "app/temp/about_temp.html"
		    })
		    .state('contact', {
		      url: "/contact",
		      templateUrl: "app/temp/contact_temp.html",
		    }).state('product', {
		      url: "/product",
		      templateUrl: "app/temp/product_temp.html",
		      controller: function( $scope , products){
		      	$scope.viewProduct = products.getViewProduct();
		      },
		    });
	});

})();

