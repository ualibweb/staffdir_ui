angular.module('ualib.staffdir.templates', ['staff-card/staff-card-list.tpl.html', 'staff-card/staff-card-md.tpl.html', 'staff-directory/staff-directory-facets.tpl.html', 'staff-directory/staff-directory-listing.tpl.html', 'staff-directory/staff-directory.tpl.html', 'staff-profile/staff-profile.tpl.html']);

angular.module("staff-card/staff-card-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-list.tpl.html",
    "<div ng-repeat=\"person in filteredList | after:(staffdir.pager.page-1)*staffdir.pager.perPage | limitTo:staffdir.pager.perPage\"><div class=page-slice><div class=row><div class=\"hidden-xs col-sm-3\"><img class=\"staff-portrait thumbnail\" ng-src=\"{{person.photo}}\"></div><div class=\"col-xs-12 col-sm-7\"><div class=row><div class=\"col-xs-12 col-sm-7 name-plate\"><h3 class=name><small ng-if=person.rank>{{person.rank}}</small> <a ng-href=#/staffdir/{{person.emailPrefix}} ng-if=person.profile><span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'firstname'}\" ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span> <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'lastname'}\" ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></span></a> <span ng-if=!person.profile><span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'firstname'}\" ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span> <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'lastname'}\" ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></span></span></h3><h4 class=title><span ng-bind-html=\"person.title | highlight:staffdir.facet.search\"></span></h4><h5 class=hidden-xs><span ng-bind-html=\"person.department | highlight:staffdir.facet.search\"></span></h5></div><div class=\"col-xs-12 col-sm-5\"><ul class=fa-ul><li ng-if=person.phone><span class=\"fa fa-phone fa-li\"></span><a ng-href=tel:+1{{person.phone}}>{{person.phone}}</a></li><li class=hidden-xs ng-if=person.fax><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li><li ng-if=person.email><span class=\"fa fa-envelope fa-li\"></span><a ng-href=mailto:{{person.email}} title=\"Email {{person.firstname}} {{person.lastname}}\">{{person.email}}</a></li></ul></div><div class=\"col-sm-12 subject-specialty hidden-xs\" ng-if=person.subjects><table class=\"table table-condensed\"><thead><tr><th>Liaison</th></tr></thead><tbody><tr ng-repeat=\"subject in person.subjects | orderBy:'subject'\"><td><a ng-href={{subject.link}} title={{subject.subject}} ng-if=subject.link ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\"></a> <span ng-if=!subject.link ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\">{{subject.subject}}</span></td></tr></tbody></table></div></div></div></div></div></div><div class=\"alert alert-warning text-center\" role=alert ng-if=\"filteredList.length < 1\"><h2>No staff members found <span ng-if=staffdir.facet.library>in {{staffdir.facet.library}}</span> <span ng-if=staffdir.facet.liaison>that are liaisons</span> <span ng-if=staffdir.facet.subject><span ng-if=staffdir.facet.liaison>for</span> <span ng-if=!staffdir.facet.liaison>with a specialty in</span> {{staffdir.facet.subject}}</span></h2></div>");
}]);

angular.module("staff-card/staff-card-md.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-md.tpl.html",
    "<div class=\"staff-card-container panel panel-default\"><div class=panel-body><div class=row><div class=\"name-plate col-sm-12 text-right\"><h4 class=name><small ng-if=staffPerson.rank>{{staffPerson.rank}}</small>{{staffPerson.firstname}} {{staffPerson.lastname}}</h4><div class=title>{{staffPerson.title}}</div><div>{{staffPerson.department}}</div></div></div><div class=row><div class=col-xs-6><div class=staff-card-detail><h6>Contact</h6><ul class=fa-ul><li ng-if=staffPerson.phone><span class=\"fa fa-phone fa-li\"></span><a ng-href=tel:+1-{{staffPerson.phone}}>{{staffPerson.phone}}</a></li><li ng-if=staffPerson.fax><span class=\"fa fa-fax fa-li\"></span>{{staffPerson.fax}}</li><li ng-if=staffPerson.email><span class=\"fa fa-envelope fa-li\"></span><a href=mailto:{{staffPerson.email}}>{{staffPerson.email}}</a></li></ul></div></div><div class=col-xs-6><div class=staff-card-detail ng-if=staffPerson.subjects><h6>Subject Expertise</h6><ul class=list-unstyled><li role=presentation ng-repeat=\"subject in staffPerson.subjects | orderBy:subject.subject\" ng-class=\"{'disabled': !subject.link}\"><a ng-href={{subject.link}} title={{subject.subject}} ng-if=subject.link>{{subject.subject}}</a> <span title={{subject.subject}} ng-if=!subject.link>{{subject.subject}}</span></li></ul></div></div></div></div></div>");
}]);

angular.module("staff-directory/staff-directory-facets.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-facets.tpl.html",
    "<form class=facets-form><div class=form-group><h4>Filters</h4></div><div class=form-group><div class=facet-group><input class=form-control id=directorySearch name=directorySearch ng-model=staffdir.facet.search placeholder=\"Keyword Search...\" ng-keyup=\"staffdir.changeFacet('search')\"></div></div><div class=form-group><h5>Sort by</h5><div class=facet-group><div class=\"btn-group btn-group-justified\"><label class=\"btn btn-default\" ng-model=staffdir.facet.sortBy btn-radio=\"'lastname'\" ng-change=\"staffdir.changeFacet('sortBy')\">Last name</label><label class=\"btn btn-default\" ng-model=staffdir.facet.sortBy btn-radio=\"'firstname'\" ng-change=\"staffdir.changeFacet('sortBy')\">First name</label></div></div></div><div class=\"form-group hidden-xs hidden-sm\"><h5>Liaison area</h5><div class=facet-group><select class=form-control ng-model=staffdir.facet.subject name=subject ng-options=\"subject for subject in facets.subjects\" ng-change=\"staffdir.changeFacet('subject')\"><option value=\"\">-- Select Subject --</option></select><label class=checkbox-inline><input type=checkbox id=liaison ng-true-value=1 ng-model=staffdir.facet.liaison ng-change=\"staffdir.changeFacet('liaison')\">Limit to liaisons</label></div></div><div class=\"form-group hidden-xs hidden-sm\"><h5>Department</h5><div class=facet-group><select class=form-control ng-model=staffdir.facet.department name=department ng-options=\"department for department in facets.departments\" ng-change=\"staffdir.changeFacet('department')\"><option value=\"\">-- Select Department --</option></select></div></div><div class=\"form-group hidden-xs hidden-sm\"><h5>Library Location</h5><div class=facet-group><div class=radio><label><input type=radio ng-model=staffdir.facet.library ng-checked=!staffdir.facet.library ng-change=\"staffdir.changeFacet('library')\"> All</label></div><div class=radio ng-repeat=\"library in facets.libraries\"><label><input type=radio ng-model=staffdir.facet.library value={{library}} ng-change=\"staffdir.changeFacet('library')\"> {{library}}</label></div></div></div><div class=\"form-group hidden-xs hidden-sm\"><button class=\"btn btn-primary btn-block\" type=button ng-click=staffdir.clearFacets()><span class=\"fa fa-fw fa-refresh\"></span> Reset Filters</button></div></form>");
}]);

angular.module("staff-directory/staff-directory-listing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-listing.tpl.html",
    "<div class=table-responsive><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><a href=# ng-click=\"sortList($event, 'lastname')\" ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'lastname', 'sortable-reverse': staffdir.sortReverse && staffdir.facet.sortBy == 'lastname'}\">Name</a></th><th class=hidden-xs><a href=# ng-click=\"sortList($event, 'title')\" ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'title', 'sortable-reverse': staffdir.sortReverse && staffdir.facet.sortBy == 'title'}\">Title</a></th><th class=hidden-xs><a href=# ng-click=\"sortList($event, 'department')\" ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'department', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'department'}\">Department/Unit</a></th><th>Contact</th><th class=\"hidden-xs hidden-sm\">Specialty</th></tr></thead><tbody><tr ng-repeat=\"person in filteredList = (list | filter:staffdir.facet.search | filter:staffdir.facet.subject:true | orderBy:staffdir.sortBy:staffdir.sortReverse) track by $index\"><td class=text-nowrap><div ng-if=person.rank class=text-muted>{{person.rank}}</div><span ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span> <strong ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></strong></td><td class=hidden-xs><span ng-bind-html=\"person.title | highlight:staffdir.facet.search\"></span></td><td class=hidden-xs><span ng-bind-html=\"person.department | highlight:staffdir.facet.search\"></span></td><td><ul class=fa-ul><li ng-if=person.phone><span class=\"fa fa-phone fa-li\"></span>{{person.phone}}</li><li ng-if=person.fax><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li><li ng-if=person.email><span class=\"fa fa-envelope fa-li\"></span> <a ng-href=mailto:{{person.email}} title=\"Email {{person.firstname}} {{persone.lastname}}\">{{person.email}}</a></li></ul></td><td class=\"hidden-xs hidden-sm\"><ul class=list-unstyled ng-if=person.subjects><li ng-repeat=\"subject in person.subjects | orderBy:subject.subject\"><a ng-href={{subject.link}} title={{subject.subject}} ng-if=subject.link ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\"></a> <span ng-if=!subject.link ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\">{{subject.subject}}</span></li></ul></td></tr></tbody></table><div class=\"alert alert-warning text-center\" role=alert ng-show=\"filteredList.length === 0\"><h2>No results<span ng-if=staffdir.facet.subject><strong>for {{staffdir.facet.subject}}</strong> subject specialists</span> <span ng-if=staffdir.facet.search>matching <strong>\"{{staffdir.facet.search}}\"</strong></span></h2></div></div>");
}]);

angular.module("staff-directory/staff-directory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory.tpl.html",
    "<div class=jumbotron-header><div class=jumbotron><div class=container><div class=row><div class=col-sm-12><ol class=breadcrumb typeof=BreadcrumbList vocab=\"http://schema.org/\"><li><a title=\"Go to The University of Alabama Libraries.\" href=/#/home class=home>The University of Alabama Libraries</a></li><li><a title=\"Go to News.\" href=/#/staffdir class=\"post post-page\">Staff Directory</a></li></ol></div></div><div class=row><div class=col-md-12><h1>Staff Directory</h1></div></div></div></div></div><div class=container><div class=\"row staff-directory\"><div class=\"col-md-3 col-md-push-9\"><div class=staff-directory-facets facets=staffdir.facets></div></div><div class=\"col-md-9 col-md-pull-3\"><div ng-show=facets.showFacetBar><ol class=\"breadcrumb facetcrumb\"><li ng-if=facets.facet.department><strong>Department:</strong> <button type=button class=\"btn btn-default\" ng-click=\"facets.clearFacets('department')\">{{facets.facet.department | truncate : 20 : '...'}} <span class=text-muted aria-hidden=true>&times;</span></button></li><li ng-if=facets.facet.library><strong>Library:</strong> <button type=button class=\"btn btn-default\" ng-click=\"facets.clearFacets('library')\">{{facets.facet.library}} <span class=text-muted aria-hidden=true>&times;</span></button></li><li ng-if=facets.facet.subject><strong>Liaison area:</strong> <button type=button class=\"btn btn-default\" ng-click=\"facets.clearFacets('subject')\">{{facets.facet.subject}} <span class=text-muted aria-hidden=true>&times;</span></button></li><li ng-if=facets.facet.liaison><button type=button class=\"btn btn-default\" ng-click=\"facets.clearFacets('liaison')\">Liaison <span class=text-muted aria-hidden=true>&times;</span></button></li><li class=pull-right><button type=button class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=facets.clearFacets()><i class=\"fa fa-refresh\"></i></button></li></ol></div><div class=text-center><pagination class=pagination-sm ng-model=facets.pager.page total-items=facets.pager.totalItems max-size=facets.pager.maxSize boundary-links=true rotate=false items-per-page=facets.pager.perPage ng-change=\"facets.changeFacet('page')\" ng-if=\"facets.pager.totalItems > facets.pager.perPage\"></pagination></div><div class=staff-directory-listing id=staff-directory-listing list=staffdir.list sort-by=lastname></div><div class=text-center><pagination class=pagination-sm ng-model=facets.pager.page total-items=facets.pager.totalItems max-size=facets.pager.maxSize boundary-links=true rotate=false items-per-page=facets.pager.perPage ng-change=\"facets.changeFacet('page')\" ng-if=\"facets.pager.totalItems > facets.pager.perPage\"></pagination></div></div></div></div>");
}]);

angular.module("staff-profile/staff-profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-profile/staff-profile.tpl.html",
    "<div class=container><ol class=breadcrumb typeof=BreadcrumbList vocab=\"http://schema.org/\"><li><a title=\"Go to The University of Alabama Libraries.\" href=/#/home class=home>The University of Alabama Libraries</a></li><li><a title=\"Go to the Staff Directory.\" href=/#/staffdir class=home>Staff Directory</a></li><li><a title=\"Go to user profile.\" href=\"\" class=home>{{userProfile.person.firstname}} {{userProfile.person.lastname}}</a></li></ol><div class=page-header><h2>Faculty/Staff Profile</h2></div><div class=\"row staff-profile\"><div class=\"hidden-xs col-md-3\"><img class=\"staff-portrait thumbnail\" ng-src={{userProfile.person.photo}} ng-if=userProfile.person.photo> <img class=\"staff-portrait thumbnail\" ng-src=wp-content/themes/roots-ualib/assets/img/user-profile.png ng-if=!userProfile.person.photo></div><div class=col-md-9><div class=name-plate><h1 class=name><small ng-if=userProfile.person.rank>{{userProfile.person.rank}}</small> <span ng-bind-html=userProfile.person.firstname></span> <span ng-bind-html=userProfile.person.lastname></span></h1><h2 class=title><span ng-bind-html=userProfile.person.title></span></h2><h3 class=hidden-xs><span ng-bind-html=userProfile.person.department></span></h3></div><div class=row><div class=page-slice><div class=col-md-6><ul class=fa-ul><li ng-if=userProfile.person.phone><span class=\"fa fa-phone fa-li\"></span><a ng-href=tel:+1-{{userProfile.person.phone}}>{{userProfile.person.phone}}</a></li><li class=hidden-xs ng-if=userProfile.person.fax><span class=\"fa fa-fax fa-li\"></span>{{userProfile.person.fax}}</li><li ng-if=userProfile.person.email><span class=\"fa fa-envelope fa-li\"></span> <a href=mailto:{{userProfile.person.email}}>{{userProfile.person.email}}</a></li><li ng-if=\"userProfile.person.website.length > 11\"><span class=\"fa fa-external-link-square fa-li\"></span> <a ng-href={{userProfile.person.website}} class=external-link>Personal website</a></li></ul></div><div class=col-md-6><ul class=fa-ul><li ng-if=\"userProfile.person.resume.length > 11\"><span class=\"fa fa-file-text fa-li\"></span> <a ng-href={{userProfile.person.resume}}>Resume / CV</a></li><li ng-if=userProfile.person.social1><span class={{userProfile.person.snClass1}}></span> <a ng-href={{userProfile.person.social1}} class=external-link>{{userProfile.person.snTitle1}}</a></li><li ng-if=userProfile.person.social2><span class={{userProfile.person.snClass2}}></span> <a ng-href={{userProfile.person.social2}} class=external-link>{{userProfile.person.snTitle2}}</a></li><li ng-if=userProfile.person.social3><span class={{userProfile.person.snClass3}}></span> <a ng-href={{userProfile.person.social3}} class=external-link>{{userProfile.person.snTitle3}}</a></li></ul></div></div></div></div></div><div class=row><div class=col-md-12><span ng-bind-html=userProfile.person.profile></span></div></div></div>");
}]);
;/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # Staff Directory App
 * ## default route: [/#/staffdir](http://www.lib.ua.edu/#/staffdir)
 */
/**
 * @ngdoc overview
 * @name staffdir
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires angular-filter
 * @requires ui-bootstrap
 * @requires angularLazyImg
 * @requires ualib-ui
 *
 * @description
 * # Staff Directory App
 * ## default route: [/#/staffdir](http://www.lib.ua.edu/#/staffdir)
 */

angular.module('ualib.staffdir', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'ualib.ui',
    'ualib.staffdir.templates'
]);


//Alias for demo purposes
angular.module('staffdir', ['ualib.staffdir']);
;angular.module('ualib.staffdir')

    .service('StaffDirectoryService', ['$location', '$rootScope', function($location, $rootScope){
        var self = this; //ensures proper contest in closure statements
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).
        this.facetExceptions = {sortBy: 'lastname', search: '', page: 1};
        this.pager =  {
            page: 1,
            perPage: 20,
            maxSize: 10,
            totalItems: 0
        };

        //TODO: handle this variable through a central route/event instead of on a function-by-function basis
        this.showFacetBar = false;

        // Initialize function to capture any pre-linked filter params
        this.init = function(){
            var params = $location.search();
            for (var param in params){
                //TODO: This must be temporary. Any URI param will cause the facet bar to display on load!!
                if (!this.showFacetBar && !this.facetExceptions.hasOwnProperty(param)) {
                    this.showFacetBar = true;
                }
                this.facet[param] = params[param];
            }
        };

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
            $rootScope.$broadcast('facetsChange', facet);

        };

        this.specialtyType = function(staff){
            var type = self.facet.liaison;
            if (type){
                //Type 1 used to refer to selectors for a subject and type 2 used to be instructor, with type 3 representing both.  In the liaison program, that distinction is no longer made -- so everyone is both.
                type = 3;
                return staff.subjects.filter(function(subj){
                        var isType = (subj.type & type) === type;
                        if (type === 3){
                            console.log(self.facet.subject);
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

    /**
     * @ngdoc service
     * @name staffdir.StaffFactory
     *
     * @requires $resource
     * @requires $http
     * @requires $filter
     *
     * @description
     * Factory service to get staff directory info from the API.
     */

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
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:directory
             * @methodOf staffdir.StaffFactory
             *
             * @description
             * Gets full list of library faculty and staff
             *
             * @example
             * <pre>
             *      var list = StaffFactory.directory().get()
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            directory: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people', {}, {
                    get: {
                        cache: true,
                        method: 'GET',
                        transformResponse: appendTransform($http.defaults.transformResponse, function(d){
                            // temporary fix. Not sustainable to manually remove arbitrary fields from API for different views
                            // TODO: work out proper API output for each view
                            var toRemove = ['division', 'prefix', 'website','resume','social1','social2','social3'];

                            var data = angular.fromJson(d);
                            var staff = {
                                list: [], // Array for directory listing
                                facets: {} //Object for available facets
                            };

                            // Build new object of only subject that currently have a subject/research expert
                            var subj = [];
                            var list = [];
                            angular.forEach(data.list, function(val){
                                // Remove all properties listed in the toRemove array
                                var newVal = {};
                                for (var prop in val){
                                    if (val.hasOwnProperty(prop) && toRemove.indexOf(prop) === -1){
                                        newVal[prop] = val[prop];
                                    }
                                }
                                val = newVal;

                                val.photo = val.photo || "https://www.lib.ua.edu/wp-content/themes/roots-ualib/assets/img/user-profile.png";
                                //Overwrite "profile" text so its not searchable, set it as a boolean so the tpl knows if to link to a profile
                                if (val.profile){
                                    val.profile = true;
                                }


                                var rx = /^([\w-]+(?:\.[\w-]+)*)/;
                                var prefix = val.email.match(rx);
                                //added in order to prevent crashes from empty email address
                                if (prefix !== null) {
                                    val.emailPrefix = prefix[0];
                                }

                                //preset alpha index values base on first and last name
                                /*val.alphaIndex = {};
                                val.alphaIndex.lastname = val.lastname.charAt(0).toUpperCase();
                                val.alphaIndex.firstname = val.firstname.charAt(0).toUpperCase();*/

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
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:byEmail
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} email Email param object
             * @param {string} email.email Faculty/staff member's email address
             *
             * @description
             * Gets faculty/staff info by email
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({email: 'email@addres.com'})
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            byEmail: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/email/:email', {}, {cache: true});
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:byName
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} name Name param object
             * @param {string} name.firstname Faculty/staff member's first name
             * @param {string} name.lastname Faculty/staff member's last name
             *
             * @description
             * Gets faculty/staff info by full name.
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({firstname: 'Malcolm', lastname: 'Reynolds'})
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            byName: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/firstname/:firstname/lastname/:lastname', {}, {cache: true});
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:byId
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} id ID param object
             * @param {number} id.id Faculty/staff member's ID (in the API database)
             *
             * @description
             * Gets faculty/staff info by ID (in the API database).
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({id: 2468})
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            byId: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/id/:id', {}, {cache: true});
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:profile
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} id ID param object
             * @param {number} id.id Faculty/staff member's ID (in the API database)
             *
             * @description
             * Gets faculty/staff info by ID (in the API database).
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({id: 2468})
                    .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            profile: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/profile/:login', {}, {cache: true});
            }
        };
    }]);

;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir/cardlist', {
            template: '<div class="staff-card-list"></div>'
        });
    }])

    .directive('staffCardList', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'AC',
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: ['$scope', function($scope){
                $scope.staffdir = {};

                StaffFactory.directory().get()
                    .$promise.then(function(data){
                        // get list of people
                        $scope.staffdir = data.list;

                    }, function(){
                        console.log('Staffdir Error -- Come on, put in proper error handling already');
                    });
            }]
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
                //console.log(scope.person);
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
                            //console.log({firstname: p[0], lastname: p[1]});
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
    });;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir/:email', {
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
            controller: ['$scope', function($scope){
                $scope.userProfile = {};

                //console.log("Login: " + $scope.login);

                StaffFactory.profile().get({login: $scope.login})
                    .$promise.then(function(data){
                        for (var i = 1; i < 4; i++) {
                            if (data.person["social" + i] !== null) {
                                data.person["snClass" + i] = "fa fa-user fa-li";
                                data.person["snTitle" + i] = "Social Network";
                                if (data.person["social" + i].toLowerCase().indexOf("facebook.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-facebook fa-li";
                                    data.person["snTitle" + i] = "Facebook";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("twitter.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-twitter fa-li";
                                    data.person["snTitle" + i] = "Twitter";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("linkedin.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-linkedin fa-li";
                                    data.person["snTitle" + i] = "LinkedIn";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("vk.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-vk fa-li";
                                    data.person["snTitle" + i] = "VK";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("plus.google.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-google-plus fa-li";
                                    data.person["snTitle" + i] = "Google Plus";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("instagram.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-instagram fa-li";
                                    data.person["snTitle" + i] = "Instagram";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("youtube.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-youtube fa-li";
                                    data.person["snTitle" + i] = "Youtube";
                                }
                            }
                        }
                        $scope.userProfile = data;
                        //console.dir(data);
                    }, function(data){
                        console.log('Error: cold not get profile! ' + data);
                    });
            }]
        };
    }]);

