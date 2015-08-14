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

    .directive('staffCard', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'EA',
            scope: {
                person: '@',
                size: '@'
            },
            templateUrl: function(tElem, tAttrs){
                var tpl = 'staff-card/';

                switch (tAttrs.size){
                    case 'sm':
                        tpl += 'staff-card-sm.tpl.html';
                        break;
                    default:
                        tpl += 'staff-card-md.tpl.html';
                }

                return tpl;
            },
            link: function(scope, elm){
                console.log(scope.person);
                if (angular.isDefined(scope.person)){
                    scope.info = {};


                    if (angular.isNumber(scope.person)){
                        StaffFactory.byId().get({id: scope.person})
                            .$promise.then(function(data){
                                scope.staffPerson = data.list[0];
                            }, function(){
                                console.log('Staffdir Error -- Come on, put in proper error handling already');
                            });
                    }
                    else {
                        var p = scope.person.split(/\s/);

                        if (p.length > 1){
                            console.log({firstname: p[0], lastname: p[1]});
                            StaffFactory.byName().get({firstname: p[0], lastname: p[1]})
                                .$promise.then(function(data){
                                    scope.staffPerson = data.list[0];
                                }, function(){
                                    console.log('Staffdir Error -- Come on, put in proper error handling already');
                                });
                        }
                        else {
                            StaffFactory.byEmail().get({email: p[0]})
                                .$promise.then(function(data){
                                    scope.staffPerson = data.list[0];
                                }, function(){
                                    console.log('Staffdir Error -- Come on, put in proper error handling already');
                                });
                        }
                    }

                }
            }
        };
    }]);

