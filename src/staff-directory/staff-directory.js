angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            reloadOnSearch: false,
            controller: 'StaffDirCtrl',
            templateUrl: 'staff-directory/staff-directory.tpl.html',
            resolve: {
                StaffDir: ['StaffFactory', '$filter', function(StaffFactory, $filter){

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
                    var facets = angular.copy($scope.staffdir.facet);

                    list = $filter('filter')(list, $scope.staffdir.facet.search);
                    list = $filter('filter')(list, $scope.staffdir.facet.department);
                    list = $filter('filter')(list, $scope.staffdir.facet.subject, true);
                    list = $filter('filter')(list, $scope.staffdir.facet.library);
                    list = $filter('filter')(list, $scope.staffdir.facet.specialtyType);
                    list = $filter('orderBy')(list, $scope.staffdir.facet.sortBy, $scope.staffdir.sortReverse);

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