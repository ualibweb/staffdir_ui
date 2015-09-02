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
                    if (!SDS.showFacetBar && !SDS.facetExceptions.hasOwnProperty(param)) {
                        SDS.showFacetBar = true;
                    }
                    SDS.facet[param] = params[param];
                    console.log(SDS.facet);
                }
            }
        });
    }])

    .service('StaffDirectoryService', ['$location', '$rootScope', function($location, $rootScope){
        var self = this; //ensures proper contest in closure statements
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).
        this.facetExceptions = {sortBy: 'lastname', search: ''};

        //TODO: handle this variable through a central route/event instead of on a function-by-function basis
        this.showFacetBar = false;

        // Accepts string or array arguments of facets to clear
        this.clearFacets = function(){
            var args = arguments.length ? arguments : Object.keys(self.facet);
            var omitKeys = Array.prototype.concat.apply(Array.prototype, args);
            var test ={}, copy = {};

            Object.keys(self.facet).map(function(key){
                if (self.facetExceptions.hasOwnProperty(key)){
                    copy[key] = self.facetExceptions[key];
                    $location.search(key, null);
                }
                else if (omitKeys.indexOf(key) === -1) {
                    copy[key] = self.facet[key];
                    test[key] = self.facet[key];
                }
                else{
                    $location.search(key, null);
                }

            });

            self.showFacetBar = !isEmptyObj(test);
            self.facet = angular.copy(copy);

            $rootScope.$broadcast('facetsChange');
        };
        
        this.changeFacet = function(facet){
            var val = (self.facet.hasOwnProperty(facet) && self.facet[facet] !== '' && self.facet[facet] !== false) ? self.facet[facet] : null;
            $location.search(facet, val);
            $location.replace();
            self.showFacetBar = !isEmptyObj(self.facet);
            $rootScope.$broadcast('facetsChange');
        };

        this.specialtyType = function(staff){
            var type = (self.facet.selector | self.facet.instructor);
            if (type){
                return staff.subjects.filter(function(subj){
                        var isType = (subj.type & type) === type;
                        if (type === 3){
                            return self.facet.subject ? (self.facet.subject === subj.subject) && subj.type > 0 : subj.type > 0;
                        }
                        return self.facet.subject ? (self.facet.subject === subj.subject) && isType : isType;
                    }).length > 0;
            }
            return true;
        };

        function isEmptyObj(obj){
            var name;
            for (name in obj){
                if (obj[name] && !self.facetExceptions.hasOwnProperty(name)){
                    return false;
                }
            }
            return true;
        }

    }]);;angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', '$filter', '$http', function($resource, $filter, $http){
        //TODO: centralize this function so it can be used with all apps
        // Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - //docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];

            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return {
            directory: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people', {}, {
                    cache: true,
                    get: {
                        method: 'GET',
                        transformResponse: appendTransform($http.defaults.transformResponse, function(d){
                            var data = angular.fromJson(d);
                            var staff = {
                                list: [], // Array for directory listing
                                facets: {} //Object for available facets
                            };

                            // Build new object of only subject that currently have a subject/research expert
                            var subj = [];
                            var list = [];
                            angular.forEach(data.list, function(val){
                                delete val.division;
                                if (val.photo == null){
                                    //TODO: temporary work around because CMS file handling is dumb. Need to fix and make sustainable
                                    val.photo = '/wp-content/themes/roots-ualib/assets/img/user-profile.png';
                                }


                                var rx = /^([\w-]+(?:\.[\w-]+)*)/;
                                var prefix = val.email.match(rx);
                                //added in order to prevent crashes from empty email address
                                if (prefix !== null) {
                                    val.emailPrefix = prefix[0];
                                } else {
                                    console.log(val.email);
                                }

                                for (var i = 1; i < 4; i++) {
                                    val["snClass" + i] = "fa fa-user fa-li";
                                    val["snTitle" + i] = "Social Network";
                                    if (val["social" + i].toLowerCase().indexOf("facebook.com") > 0) {
                                        val["snClass" + i] = "fa fa-facebook fa-li";
                                        val["snTitle" + i] = "Facebook";
                                    }
                                    if (val["social" + i].toLowerCase().indexOf("twitter.com") > 0) {
                                        val["snClass" + i] = "fa fa-twitter fa-li";
                                        val["snTitle" + i] = "Twitter";
                                    }
                                    if (val["social" + i].toLowerCase().indexOf("linkedin.com") > 0) {
                                        val["snClass" + i] = "fa fa-linkedin fa-li";
                                        val["snTitle" + i] = "LinkedIn";
                                    }
                                    if (val["social" + i].toLowerCase().indexOf("vk.com") > 0) {
                                        val["snClass" + i] = "fa fa-vk fa-li";
                                        val["snTitle" + i] = "VK";
                                    }
                                    if (val["social" + i].toLowerCase().indexOf("plus.google.com") > 0) {
                                        val["snClass" + i] = "fa fa-google-plus fa-li";
                                        val["snTitle" + i] = "Google Plus";
                                    }
                                    if (val["social" + i].toLowerCase().indexOf("instagram.com") > 0) {
                                        val["snClass" + i] = "fa fa-instagram fa-li";
                                        val["snTitle" + i] = "Instagram";
                                    }
                                    if (val["social" + i].toLowerCase().indexOf("youtube.com") > 0) {
                                        val["snClass" + i] = "fa fa-youtube fa-li";
                                        val["snTitle" + i] = "Youtube";
                                    }
                                }

                                //preset alpha index values base on first and last name
                                val.alphaIndex = {};
                                val.alphaIndex.lastname = val.lastname.charAt(0).toUpperCase();
                                val.alphaIndex.firstname = val.firstname.charAt(0).toUpperCase();

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
                        })
                    }
                });
            },
            byEmail: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/email/:email', {}, {cache: true});
            },
            byName: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/firstname/:firstname/lastname/:lastname', {}, {cache: true});
            },
            byId: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/id/:id', {}, {cache: true});
            },
            profile: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/profile/:login', {}, {cache: true});
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
            controller: ['$scope', function($scope){
                $scope.filteredList = [];
                $scope.staffdir = SDS;

                //If sortby hasn't been defined in URI, check it default defined with directive
                if (angular.isUndefined(SDS.facet.sortBy)){
                    $scope.staffdir.facet.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                }

                // Update listing when SDS broadcasts "facetsChange" event
                var facetsListener = $scope.$on('facetsChange', function(ev){
                    updateList();
                });

                // Function to update staff listing
                function updateList(){
                    var list = angular.copy($scope.list);

                    list = $filter('filter')(list, $scope.staffdir.facet.search);
                    list = $filter('filter')(list, $scope.staffdir.facet.department);
                    list = $filter('filter')(list, $scope.staffdir.facet.subject, true);
                    list = $filter('filter')(list, $scope.staffdir.facet.library);
                    list = $filter('filter')(list, $scope.staffdir.specialtyType);
                    list = $filter('orderBy')(list, $scope.staffdir.facet.sortBy, $scope.staffdir.sortReverse);

                    $scope.filteredList = angular.copy(list);
                }

                $scope.$on('$destroy', function(){
                    facetsListener();
                });

                updateList();
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
    });;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir/profile/:email', {
            template: function(params) {
                return '<div class="staff-faculty-profile" email="' + params.email + '"></div>';
            }
        });
    }])

    .directive('staffFacultyProfile', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'AC',
            scope:{
                login: '@email'
            },
            templateUrl: 'staff-profile/staff-profile.tpl.html',
            controller: function($scope){
                $scope.userProfile = {};

                console.log("Login: " + $scope.login);

                StaffFactory.profile().get({login: $scope.login})
                    .$promise.then(function(data){
                        $scope.userProfile = data;
                        console.dir(data);
                    }, function(data){
                        console.log('Error: cold not get profile! ' + data);
                    });
            }
        };
    }]);

