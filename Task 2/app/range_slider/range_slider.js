(function() {
    'use strict';
	
	angular
		.module('Myapp')
		.directive('range',range)
		
		function range (){
	    	return{
	        	restrict: 'E',
	        };
	    };
	
	angular
		.module('Myapp')
		.directive('rangeMainBar',rangeMainBar)
		
		function rangeMainBar ($document){
	    	return{
	        	restrict: 'E',
	        	require: ['rangeMainBar',],
	        	controller: function ($scope){
	        		var vm = $scope.vm ;
	        		$scope.limit = 0;

	        		this.rightCircleMove = function(px){
	        			if ( px < 0 ){ 
	        				$scope.limit = vm.elasticBarMargin + 20;
	        			}else{
	        				$scope.limit = vm.mainBarWidth ;
	        			}
	        			
	        			if( (px=this.chekIfOverflow (px , $scope.limit , (vm.elasticBarMargin + vm.elasticBarPadd) ) ) ){
	        				
	        				vm.elasticBarPadd += px;
		        			vm.upperValue = (vm.elasticBarMargin + vm.elasticBarPadd) / vm.valueForPx;
		        			$scope.$apply();
		        			vm.elasticBarElem.css({	
		        				padding_right : vm.elasticBarPadd+'px',	
		        			});
		        		}
	        		};

	        		this.leftCircleMove = function(px){
	    				if ( px < 0 ){ 
	        				$scope.limit = 1 ;
	        			}else{
	        				$scope.limit = ((vm.elasticBarMargin + vm.elasticBarPadd) - 20);
	        			}

	        			if( (px=this.chekIfOverflow (px , $scope.limit , vm.elasticBarMargin ) ) ){
		        			
		        			vm.elasticBarPadd -= px ;
		        			vm.elasticBarMargin += px;

		        			vm.lowerValue = vm.elasticBarMargin / vm.valueForPx;
		        			vm.upperValue = (vm.elasticBarMargin + vm.elasticBarPadd) / vm.valueForPx;
		        			
		        			$scope.$apply();
		        			vm.elasticBarElem.css({	
		        				margin_left		: vm.elasticBarMargin+'px',
		        				padding_right 	: vm.elasticBarPadd+'px',	
		        			});

	        			}
	        		};

	        		this.setElasticBar = function( val ){
	        			vm = val;
	        			
	        			vm.valueForPx = vm.mainBarWidth / ( vm.celling - vm.floor );
        			
	        			vm.elasticBarPadd = ((vm.upperValue - vm.lowerValue) * vm.valueForPx);
	        			vm.elasticBarMargin =((vm.lowerValue - vm.floor) * vm.valueForPx);

	        			vm.lowerValue = vm.elasticBarMargin/vm.valueForPx;
	        			vm.upperValue = (vm.elasticBarMargin + vm.elasticBarPadd)/vm.valueForPx;
	        			
	        			vm.elasticBarElem.css({
	        				padding_right 	: vm.elasticBarPadd+'px',
	        				margin_left 	: vm.elasticBarMargin+'px',
	        			});
	        			
	        		}

	        		this.chekIfOverflow = function ( nrOfSteps , limit , currentPoz){
        				var answer = false;
        				if(nrOfSteps != 0){
	        				if( nrOfSteps < 0 ){
		        				if( (currentPoz + nrOfSteps) > limit + 1){
		        					answer = nrOfSteps ;
		        				}else{
		        					answer = -Math.abs(currentPoz - limit + 1);
		        				}
		        			}else{
		        				if( (currentPoz + nrOfSteps) <  limit -1 ){
		        					answer = nrOfSteps;
		        				}else{
		        					answer = Math.abs(limit - currentPoz - 1);
		        				}
		        			}
		        		}
	        			return answer;
	        		}

	        	},

	        	link: function(scope, element, attrs , mainBarCtrl ){
	        		var vm = scope.vm
	        		
        			vm.mainBarWidth = element[0].clientWidth;
        			vm.floor = parseInt(attrs.floor,10);
        			vm.celling = parseInt(attrs.celling,10);

        			$document.bind('mousemove',function(ev){
        				
	        				if(vm.isClickedMaxCircle == true){
	        					if( ( ( vm.upperValue < vm.celling -1) || ( ev.movementX < 0 ) ) && ( ( vm.lowerValue + 150 < vm.upperValue ) ||  ( ev.movementX > 0 ) ) ) {
	        						
	        						mainBarCtrl[0].rightCircleMove(ev.movementX);
	        					}
	        				}
	        				if(vm.isClickedMinCircle == true){
	        					if( ( ( vm.lowerValue > vm.floor+1) || (  ev.movementX > 0) ) && ( ( vm.lowerValue < vm.upperValue - 150 ) || ( ev.movementX < 0 ) ) ){
	        						mainBarCtrl[0].leftCircleMove(ev.movementX);
	        					}
	        				}

        			});

        			$document.bind('mouseup',function(ev){
        				vm.isClickedMaxCircle = false;
        				vm.isClickedMinCircle = false;
        				scope.$apply();
        			});

        			mainBarCtrl[0].setElasticBar(vm);
        		},
	        };
	    };
	
	angular
		.module('Myapp')
		.directive('rangeElasticBar',rangeElasticBar)
		
		function rangeElasticBar (){
			
	    	return{
	        	restrict: 'E',
	        	require: ['^rangeMainBar',],
	        	link: function(scope, element, attrs , mainBarCtrl ){
	        		var vm = scope.vm 
	        		vm.lowerValue = parseInt(attrs.ngModelLow,10);
	        		vm.upperValue = parseInt(attrs.ngModelHigh,10);

	        		scope.$watch('lowerValue', function( newValue ) {
						vm.lowerValue 		= parseInt(newValue,10);
						mainBarCtrl[0].setElasticBar(vm);
	        		}.bind(vm));

	        		scope.$watch('upperValue', function( newValue ) {
						vm.upperValue 		= parseInt(newValue,10);
						mainBarCtrl[0].setElasticBar(vm);
	        		});
	        		
 					vm.elasticBarElem = element;
 				},
	        };
	    };
	
	angular
		.module('Myapp')
		.directive('rangeMinCircle',rangeMinCircle)
		
		function rangeMinCircle (){
	    	return{
	        	restrict: 'E',
	        	link: function(scope, element, attrs){
	        		var vm = scope.vm = {};

	        		vm.isClickedMinCircle = false;
	        		
	        		element.bind('mousedown',function(ev){
        				vm.isClickedMinCircle = true;
        				scope.$apply();
        			});
        		},
	        };
	    };

	
	angular
		.module('Myapp')
		.directive('rangeMaxCircle',rangeMaxCircle)

		function rangeMaxCircle (){
			
	    	return{
	        	restrict: 'E',
	        	link: function(scope, element, attrs ){
	        		var vm = scope.vm;

	        		vm.isClickedMaxCircle = false;
	        		
        			element.bind('mousedown',function(ev){

        				vm.isClickedMaxCircle = true;
        				scope.$apply();
        			});
        		},
	        };
	    };
})();