angular.module('ualib.staffdir')

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
                            /*// Build new object of only subject that currently have a subject/research expert
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
                            staff.list = list;*/

                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
                }]
            }
        });
    }])

    .controller('StaffDirCtrl', ['$scope', 'StaffDir', 'StaffDirectoryService', function($scope, StaffDir, SDS, $filter){
        $scope.staffdir = StaffDir;
        $scope.facets = SDS;

    }])

    .directive('staffDirectoryListing', ['StaffDirectoryService', '$filter', function(SDS, $filter){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: function($scope){
                var prevSortBy; // used to detect if sort by has changed
                $scope.filteredList = [];
                $scope.staffdir = SDS;

                $scope.staffdir.facet.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                $scope.staffdir.sortable = $scope.sortable;

                // Not good practice, but done for brevity's sake
                // TODO: have sort functions event listeners defined in linking function and not via ng-click
                $scope.sortList = function(ev, column){
                    ev. preventDefault();

                    if (SDS.facet.sortBy === column){
                        SDS.sortReverse = !SDS.sortReverse;
                    }
                    else {
                        SDS.facet.sortBy = column;
                        SDS.sortReverse = false;
                    }
                };

                // Update listing when SDS broadcasts "facetsChange" event
                $scope.$on('facetsChange', function(ev){
                    updateList();
                });

                // Function to update staff listing
                function updateList(){
                    var list = angular.copy($scope.list);

                    list = $filter('filter')(list, $scope.staffdir.facet.search);
                    list = $filter('filter')(list, $scope.staffdir.facet.department);
                    list = $filter('filter')(list, $scope.staffdir.facet.subject, true);
                    list = $filter('filter')(list, $scope.staffdir.facet.library);
                    list = $filter('filter')(list, $scope.staffdir.facet.specialtyType);
                    list = $filter('orderBy')(list, $scope.staffdir.facet.sortBy, $scope.staffdir.sortReverse);

                    /*if (prevSortBy !== $scope.staffdir.facet.sortBy){
                        list = $filter('alphaIndex')(list, $scope.staffdir.facet.sortBy);
                        prevSortBy = angular.copy($scope.staffdir);
                    }*/

                    $scope.filteredList = angular.copy(list);
                }

                updateList();
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