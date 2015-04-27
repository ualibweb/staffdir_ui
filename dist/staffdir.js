angular.module('ualib.staffdir', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'ui.utils',
    'ualib.ui',
    'ualib.staffdir.templates'
]);

//Alias for demo purposes
angular.module('staffdir', ['ualib.staffdir']);
;angular.module('ualib.staffdir')

    .service('StaffDirectoryService', [function(){
        var self = this; //ensures proper contest in closure statements
        this.sortBy = ''; // Default sort column, can be overridden via 'sortBy' attribute for staffDirectory directive
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).

        // reset all facets
        this.resetFacets = function(){
            self.facet = {};
        };


        // Accepts string or array arguments of facets to clear
        this.clearFacets = function(){
            var copy = {};
            var omitKeys = Array.prototype.concat.apply(Array.prototype, arguments);
            console.log(omitKeys);

            Object.keys(self.facet).map(function(key){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = self.facet[key];
                }
            });
            console.log(copy);
            angular.copy(copy, self.facet);
            console.log(self.facet);
        };

        /**
         * Inspired by Angular UI Router library omit() function
         * https://github.com/angular-ui/ui-router/blob/master/src/common.js
         */
        // extracted from underscore.js
        // Return a copy of the object omitting the blacklisted properties.
        function omit(obj) {
            var copy = {};
            var omitKeys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
            console.log(omitKeys);
            Object.keys(obj).map(function(key, index){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = obj[key];
                }
            });
            return copy;
        }
    }]);;angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', function($resource){
        return {
            directory: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people', {}, {cache: true});
            },
            person: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/person', {}, {cache: true});
            }
        };
    }]);;angular.module('ualib.staffdir')

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

;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            controller: 'StaffDirCtrl',
            templateUrl: 'staff-directory/staff-directory.tpl.html',
            resolve: {
                StaffDir: ['StaffFactory', function(StaffFactory){
                    var staff = {
                        list: [], // Array for directory listing
                        facets: {} //Object for available facets
                    };
                    return StaffFactory.directory().get()
                        .$promise.then(function(data){
                            // Build new object of only subject that currently have a subject/research expert
                            var subj = [];
                            angular.forEach(data.list, function(val, key){
                                angular.extend(subj, val.subjects);
                            });
                            staff.facets.subjects = subj;
                            // get list of people
                            staff.list = data.list;

                            return staff;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
                }]
            }
        });
    }])

    .controller('StaffDirCtrl', ['$scope', 'StaffDir', function($scope, StaffDir){
        $scope.staffdir = StaffDir;
    }])

    .directive('staffDirectoryListing', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-directory/staff-directory-listing.tpl.html',
            controller: function($scope, $element){
                $scope.staffdir = SDS;

                SDS.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                SDS.sortable = $scope.sortable;

                // Not good practice, but done for brevity's sake
                // TODO: have sort functions event listeners defined in linking function and not via ng-click
                $scope.sortList = function(ev, column){
                    ev. preventDefault();

                    if (SDS.sortBy === column){
                        SDS.sortReverse = !SDS.sortReverse;
                    }
                    else {
                        SDS.sortBy = column;
                        SDS.sortReverse = false;
                    }
                };
            }
        };
    }])

    .directive('staffDirectoryFacets', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                facets: '='
            },
            templateUrl: 'staff-directory/staff-directory-facets.tpl.html',
            controller: function($scope){
                $scope.staffdir = SDS;

                $scope.clearFacet = function(){
                    var copy = {};
                    var omitKeys = Array.prototype.concat.apply(Array.prototype, arguments);

                    Object.keys(SDS.facet).map(function(key){
                        if (omitKeys.indexOf(key) === -1) {
                            copy[key] = SDS.facet[key];
                        }
                    });
                    SDS.facet = copy;

                };
            }
        };
    }]);