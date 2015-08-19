angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', '$filter', '$http', function($resource, $filter, $http){
        //TODO: centralize this function so it can be used with all apps
        // Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];

            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return {
            directory: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people', {}, {
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
                                var prefix = rx.match(val.email);
                                val.emailPrefix = prefix[1];

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
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/email/:email', {}, {cache: true});
            },
            byName: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/firstname/:firstname/lastname/:lastname', {}, {cache: true});
            },
            byId: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/id/:id', {}, {cache: true});
            },
            profile: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/profile/:login', {}, {cache: true});
            }
        };
    }]);