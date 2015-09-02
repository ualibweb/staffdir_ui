angular.module('ualib.staffdir')

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
                        console.dir(data);
                    }, function(data){
                        console.log('Error: cold not get profile! ' + data);
                    });
            }
        };
    }]);

