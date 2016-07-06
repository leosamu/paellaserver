(function(){
	angular.module("unescoModule", ['pascalprecht.translate', 'unescoModuleI18N', 'ui.bootstrap'])
	
	
	

	.config(["$translateProvider", "UNESCO_CODES_I18N", function($translateProvider, UNESCO_CODES_I18N) {
		Object.keys(UNESCO_CODES_I18N).forEach(function(lang){
			$translateProvider.translations(lang, UNESCO_CODES_I18N[lang]);
		});
		
	}])





	.filter('regex', function() {
	  return function(input, regex) {
	      var patt = new RegExp("^" + regex);      
	      var out = [];
	      for (var i = 0; i < input.length; i++){
	          if(patt.test(input[i]))
	              out.push(input[i]);
	      }      
	    return out;
	  };
	})
	
	.directive('unescoCode', function ($window, $timeout) {
		return {
			require:'^ngModel',
			restrict:'A',
			link:function (scope, elm, attrs, ctrl) {
				var unescoCode = attrs.unescoCode;
				
				attrs.$observe('unescoCode', function (newValue) {
					if ((newValue>=1) && (newValue<=3)) {
						unescoCode = newValue;
					}
					else {
						unescoCode = "1";
						}
				});
				
				ctrl.$formatters.unshift(function (modelValue) {
					var retVal;
					if (modelValue && modelValue.substr) {
						if (unescoCode === "1") { retVal = modelValue.substr(0,2); }
						else if (unescoCode === "2") { retVal = modelValue.substr(0,4); }
						else if (unescoCode === "3") { retVal = modelValue.substr(0,6); }
					}
					return retVal;
				});
				
				ctrl.$parsers.unshift(function (viewValue) {
					var retVal = viewValue;
					if (viewValue == null) {
						var modelValue = scope[attrs.ngModel];						
						if (unescoCode === "1") { retVal = ""; }
						if (modelValue && modelValue.substr) {
							if (unescoCode === "2") { retVal = modelValue.substr(0,2); }
							if (unescoCode === "3") { retVal = modelValue.substr(0,4); }
						}
					}
					return retVal;
				});
			}
		};
	})
	
	.directive("unescoCodeMultiSelect", function(){
		return {
			restrict: 'E',
			require:'ngModel2',			
			scope: {
				code: "=ngModel"
			},
			controller: ['$scope', '$filter', 'UNESCO_CODES_1', 'UNESCO_CODES_2', 'UNESCO_CODES_3', function($scope, $filter, UNESCO_CODES_1, UNESCO_CODES_2, UNESCO_CODES_3) {
		
				$scope.code = $scope.code || "";
		
				function reloadCodes() {
					$scope.unesco1 = UNESCO_CODES_1;
					if ($scope.code) {
						$scope.unesco2 = $filter('regex')(UNESCO_CODES_2, $scope.code.substr(0,2));
						$scope.unesco3 = $filter('regex')(UNESCO_CODES_3, $scope.code.substr(0,4));
					}
				}

				reloadCodes();
				$scope.$watch('code', function(){
					reloadCodes();
				});				
			}],
			templateUrl: 'unesco/directives/unescoCodeMultiSelect.html'
		};
	})
	
	.directive("unescoCodeList", function(){
		return {
			restrict: 'E',
			scope: {
				codes: "=ngModel"
			},
			controller: ['$scope', function($scope) {				
				$scope.codes = $scope.codes || [];
			
				$scope.$watch('codes', function() {
					if ($scope.codes && $scope.codes.length > 0) {
						$scope.selectedCode = $scope.codes[0];
					}
				});

				$scope.$watch('code', function() {
					if (/\d{6}/.test($scope.code)) {
						$scope.addCode($scope.code);
					}
				});
							
				$scope.addCode = function(code) {
					var idx = $scope.codes.indexOf(code);
					if (idx < 0) {
						$scope.codes.push(code);
					}
					$scope.code = "";
				};
				
				$scope.removeCode = function(selectedCode) {
					var idx = $scope.codes.indexOf(selectedCode);
					if (idx > -1) {
						$scope.codes.splice(idx, 1);
						
						if ($scope.codes.length > 0) {
							$scope.selectedCode = $scope.codes[0];
						}
					}
				}
			}],
			templateUrl: 'unesco/directives/unescoCodeList.html'
		};
	});
	
	
	
})();
