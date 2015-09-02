angular.module('ualib.staffdir')

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
    }]);