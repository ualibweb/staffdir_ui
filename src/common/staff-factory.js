angular.module('ualib.staffdir')

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
                                } else {
                                    console.log(val.email);
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