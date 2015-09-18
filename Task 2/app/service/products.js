(function() {
    'use strict';

	angular
	    .module('Myapp')
	    .service('products', products)

	    function products ( $http ) {
			var products = this;
			products.currentProducts = [];
			products.currentViewProduct = {};
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

			products.setViewProduct = function (data){
				products.currentViewProduct = data;
			}

			products.getViewProduct = function (){
				return products.currentViewProduct;
			}

			products.getProductsDb = function( limit ){
				 return $http({method:'GET', url:'app/data/getproducts.php', params:{data: limit}});
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
				products.priceMinMax = products.price;
				products.setUserPriceMin(products.priceMinMax.min);
				products.setUserPriceMax(products.priceMinMax.max);
			}

			products.setUserPriceMin = function( data ){
				return products.userPriceMin = data;
			}

			products.setUserPriceMax = function( data ){
				return products.userPriceMax = data;
			}
		};
})();