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
        SDS.pager.totalItems = StaffDir.list.length;

    }])

    .directive('staffDirectoryListing', ['StaffDirectoryService', '$document', function(SDS, $document){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
                $scope.filteredList = $scope.list;
                $scope.staffdir = SDS;


                //TODO: temporary work around because CMS file handling is dumb. Need to fix and make sustainable
                $scope.placeholder = 'https://www.lib.ua.edu/wp-content/themes/roots-ualib/assets/img/user-profile.png';


                //If sortby hasn't been defined in URI, check it default defined with directive
                if (angular.isUndefined(SDS.facet.sortBy)){
                    $scope.staffdir.facet.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                }


                // Update listing when SDS broadcasts "facetsChange" event
                var facetsListener = $scope.$on('facetsChange', function(ev, facet){
                    if (facet === 'page'){
                        updatePager();
                    }
                    $timeout(function(){
                        // Tell angularLazyImg module to update images (since no lazy load occurred because nothing was "scrolled" into view)
                        $rootScope.$emit('lazyImg:refresh');
                    }, 0);
                });                

                function updatePager(){
                    SDS.pager.totalItems = $scope.filteredList.length;
                    var numPages =  Math.floor(SDS.pager.totalItems / SDS.pager.maxSize);
                    if (numPages < SDS.pager.page){
                        SDS.pager.page = numPages || 1;
                    }
                    SDS.pager.firstItem = (SDS.pager.page-1)*SDS.pager.perPage+1;
                    SDS.pager.lastItem = Math.min(SDS.pager.totalItems, (SDS.pager.page * SDS.pager.perPage));
                    $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
                }

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