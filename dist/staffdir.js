angular.module('ualib.staffdir', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ualib.staffdir.templates'
])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            templateUrl: 'staffdir.tpl.html',
            controller: 'StaffdirCtrl',
            resolve: {
                People: ['$resource', function($resource){
                    return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people');
                }]
            }
        });
    }])

    .controller('StaffdirCtrl', ['$scope', 'People', function($scope, People){
        $scope.staffdir = {};
        $scope.subjects = {};

        $scope.$on('$routeChangeSuccess', function(){
            People.get()
                .$promise.then(function(data){
                    // get list of people
                    $scope.staffdir = data.list;

                    // only populate subject object once
                    if (angular.isUndefined($scope.subjects)){
                        $scope.subjects = data.subjects;
                    }
                }, function(){
                    console.log('Staffdir Error -- Come on, put in proper error handling already');
                });
        });
    }]);

angular.module('staffdir', ['ualib.staffdir']);