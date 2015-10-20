angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            reloadOnSearch: false,
            controller: 'StaffDirCtrl',
            templateUrl: 'staff-directory/staff-directory.tpl.html',
            resolve: {
                StaffDir: ['StaffFactory', function(StaffFactory){

                    return StaffFactory.directory().get()
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
                }]
            }
        });
    }])

    .controller('StaffDirCtrl', ['$scope', 'StaffDir', 'StaffDirectoryService', function($scope, StaffDir, SDS){
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
            controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
                $scope.filteredList = [];
                $scope.staffdir = SDS;

                //TODO: temporary work around because CMS file handling is dumb. Need to fix and make sustainable
                $scope.placeholder = 'http://www.lib.ua.edu/wp-content/themes/roots-ualib/assets/img/user-profile.png';

                //If sortby hasn't been defined in URI, check it default defined with directive
                if (angular.isUndefined(SDS.facet.sortBy)){
                    $scope.staffdir.facet.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                }

                // Update listing when SDS broadcasts "facetsChange" event
                var facetsListener = $scope.$on('facetsChange', function(ev){
                    $timeout(function(){
                        // Tell angularLazyImg module to update images (since no lazy load occurred because nothing was "scrolled" into view)
                        $rootScope.$emit('lazyImg:refresh');
                    }, 0);
                });

                // Function to update staff listing
                /*function updateList(){
                    $scope.filteredList = filterList($scope.list);
                }

                function filterList(list){
                    list = $filter('filter')(list, $scope.staffdir.facet.search);
                    list = $filter('filter')(list, $scope.staffdir.facet.department);
                    list = $filter('filter')(list, $scope.staffdir.facet.subject, true);
                    list = $filter('filter')(list, $scope.staffdir.facet.library);
                    list = $filter('filter')(list, $scope.staffdir.specialtyType);
                    list = $filter('orderBy')(list, $scope.staffdir.facet.sortBy, $scope.staffdir.sortReverse);
                    return list;
                }*/



                $scope.$on('$destroy', function(){
                    facetsListener();
                });

                //updateList();
            }]
        };
    }])

    .directive('staffDirectoryFacets', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                facets: '='
            },
            templateUrl: 'staff-directory/staff-directory-facets.tpl.html',
            controller: ['$scope', function($scope){
                $scope.staffdir = SDS;
            }]
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