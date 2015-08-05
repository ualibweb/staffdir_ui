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

    // Capture any existing URL facet parameters.
    .run(['StaffDirectoryService', '$location', '$rootScope', function(SDS, $location, $rootScope){
        $rootScope.$on('$routeChangeStart', function(ev, next, last){
            if (next.originalPath === '/staffdir'){
                var params = $location.search();
                for (var param in params){
                    //TODO: This must be temporary. Any URI param will cause the facet bar to display on load!!
                    if (!SDS.showFacetBar) {
                        SDS.showFacetBar = true;
                    }
                    SDS.facet[param] = params[param];
                }
            }
        });
    }])

    .service('StaffDirectoryService', ['$location', function($location){
        var self = this; //ensures proper contest in closure statements
        this.sortBy = ''; // Default sort column, can be overridden via 'sortBy' attribute for staffDirectory directive
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).

        //TODO: handle this variable through a central route/event instead of on a function-by-function basis
        this.showFacetBar = false;

        // Accepts string or array arguments of facets to clear
        this.clearFacets = function(){
            var args = arguments.length ? arguments : Object.keys(self.facet);
            var omitKeys = Array.prototype.concat.apply(Array.prototype, args);
            var copy = {};

            Object.keys(self.facet).map(function(key){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = self.facet[key];
                }
                else{
                    $location.search(key, null);
                }
            });
            console.log(isEmptyObj(copy));
            self.showFacetBar = !isEmptyObj(copy);
            self.facet = angular.copy(copy);
        };
        
        this.changeFacet = function(facet){
            var val = (self.facet.hasOwnProperty(facet) && self.facet[facet] !== '' && self.facet[facet] !== false) ? self.facet[facet] : null;
            $location.search(facet, val);
            self.showFacetBar = !isEmptyObj(self.facet);
        };

        this.specialtyType = function(staff){
            var type = (self.facet.selector | self.facet.instructor);
            if (type){
                return staff.subjects.filter(function(subj){
                        var isType = (subj.type & type) === type;
                        return self.facet.subject ? (self.facet.subject === subj.subject) && isType : isType;
                    }).length > 0;
            }
            return true;
        };

        function isEmptyObj(obj){
            var name;
            for (name in obj){
                if (obj[name]){
                    return false;
                }
            }
            return true;
        }

    }]);;angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', function($resource){
        return {
            directory: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people', {}, {cache: true});
            },
            byEmail: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/email/:email', {}, {cache: true});
            },
            byName: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/firstname/:firstname/lastname/:lastname', {}, {cache: true});
            },
            byId: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/id/:id', {}, {cache: true});
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
                    case 'xs':
                        tpl += 'staff-card-xs.tpl.html';
                        break;
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

;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            reloadOnSearch: false,
            controller: 'StaffDirCtrl',
            templateUrl: 'staff-directory/staff-directory.tpl.html',
            resolve: {
                StaffDir: ['StaffFactory', '$filter', function(StaffFactory, $filter){
                    var staff = {
                        list: [], // Array for directory listing
                        facets: {} //Object for available facets
                    };

                    return StaffFactory.directory().get()
                        .$promise.then(function(data){
                            // Build new object of only subject that currently have a subject/research expert
                            var subj = [];
                            var list = [];
                            angular.forEach(data.list, function(val){
                                delete val.division;
                                if (angular.isUndefined(val.image)){
                                    //TODO: temporary work around because CMS file handling is dumb. Fix and make sustainable!!!
                                    val.image = '/wp-content/themes/roots-ualib/assets/img/user-profile.png';
                                }
                                list.push(val);
                                if (angular.isDefined(val.subjects) && val.subjects.length > 0){
                                    angular.forEach(val.subjects, function(subject){
                                        subj.push(subject);
                                    });
                                }
                            });
                            subj = $filter('unique')(subj, 'subject');
                            subj = $filter('orderBy')(subj, 'subject');
                            staff.facets.subjects = subj.map(function(s){
                                return s.subject;
                            });
                            // get libraries
                            staff.facets.libraries = data.libraries.map(function(lib){
                                return lib.name;
                            });

                            // get libraries
                            staff.facets.departments = data.departments.map(function(dept){
                                return dept.name;
                            });

                            // get list of people
                            staff.list = list;

                            return staff;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
                }]
            }
        });
    }])

    .controller('StaffDirCtrl', ['$scope', 'StaffDir', 'StaffDirectoryService', function($scope, StaffDir, SDS){
        $scope.filteredItems = [];
        $scope.staffdir = StaffDir;
        $scope.facets = SDS;
    }])

    .directive('staffDirectoryListing', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: function($scope){
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

    .directive('staffDirectoryFacets', ['StaffDirectoryService', '$location', '$q', function(SDS, $location, $q){
        return {
            restrict: 'AC',
            scope: {
                facets: '='
            },
            templateUrl: 'staff-directory/staff-directory-facets.tpl.html',
            controller: function($scope){
                $scope.staffdir = SDS;
            }
        };
    }])

    .filter('alphaIndex', function(){
        return function(items, indexProp){
            var alphaIndexed = items.map(function(item){
                item.alphaIndex = item[indexProp].charAt(0).toUpperCase();
                return item;
            });
            return alphaIndexed;
        };
    });