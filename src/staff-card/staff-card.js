angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir/cardlist', {
            template: '<div class="staff-card-list"></div>'
        });
    }])

    .directive('staffCardList', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'AC',
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: function($scope){
                $scope.staffdir = {};

                StaffFactory.directory().get()
                    .$promise.then(function(data){
                        // get list of people
                        $scope.staffdir = data.list;

                    }, function(){
                        console.log('Staffdir Error -- Come on, put in proper error handling already');
                    });
            }
        };
    }])

    .directive('staffCard', [function(){
        return {
            restrict: 'AC',
            scope: {
                staffPerson: '='
            },
            templateUrl: 'staff-card/staff-card.tpl.html'
        };
    }]);

