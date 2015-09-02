(function(){
	var app = angular.module("Myapp",[]);

	app.controller('GetMenu',function($scope){
		$scope.menus = window.menus;
	});
})();