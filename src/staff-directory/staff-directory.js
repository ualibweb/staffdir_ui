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

    .directive('staffDirectoryListing', ['StaffDirectoryService', '$document', '$filter', function(SDS, $document, $filter){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: ['$scope', function($scope){
                SDS.init();
                $scope.staffdir = SDS;
                $scope.filteredList = filterList($scope.list);

                updatePager($scope.filteredList.length);
                //TODO: temporary work around because CMS file handling is dumb. Need to fix and make sustainable
                $scope.placeholder = 'https://www.lib.ua.edu/wp-content/themes/roots-ualib/assets/img/user-profile.png';


                //If sortby hasn't been defined in URI, check it default defined with directive
                if (angular.isUndefined(SDS.facet.sortBy)){
                    $scope.staffdir.facet.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                }


                // Update listing when SDS broadcasts "facetsChange" event
                var facetsListener = $scope.$on('facetsChange', function(){
                    updateList();
                });

                function updatePager(totalItems){
                    SDS.pager.totalItems = totalItems;
                    var numPages =  Math.floor(SDS.pager.totalItems / SDS.pager.maxSize);
                    if (numPages < SDS.pager.page){
                        SDS.pager.page = numPages || 1;
                    }
                    SDS.pager.firstItem = (SDS.pager.page-1)*SDS.pager.perPage+1;
                    SDS.pager.lastItem = Math.min(SDS.pager.totalItems, (SDS.pager.page * SDS.pager.perPage));
                }

                function updateList(){
                    $scope.filteredList = filterList($scope.list);
                    updatePager($scope.filteredList.length);
                    $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
                }

                function filterList(list){
                    for (var facet in SDS.facet){
                        switch (facet){
                            case 'department':
                            case 'library':
                                list = $filter('filterBy')(list, [facet], SDS.facet[facet]);
                                break;
                            case 'selector':
                            case 'instructor':
                            case 'liaison':
                                list = $filter('filter')(list, SDS.specialtyType);
                                break;
                            case 'subject':
                                list = $filter('filter')(list, SDS.facet[facet], true);
                                //console.log(facet+'s.'+facet);
                                //console.log(list);
                                break;
                            case 'sortBy':
                                list = $filter('orderBy')(list, SDS.facet[facet], SDS.sortReverse);
                                break;
                            default:
                                list = $filter('filter')(list, SDS.facet[facet]);
                        }
                    }
                    return list;
                }

                $scope.$on('$destroy', function(){
                    facetsListener();
                });

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