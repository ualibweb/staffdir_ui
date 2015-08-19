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
                login: '=email'
            },
            templateUrl: 'staff-profile/staff-profile.tpl.html',
            controller: function($scope){
                $scope.profileData = {};

                console.log("Login: " + $scope.login);
                var rx = /^([\w-]+(?:\.[\w-]+)*)/;
                var emailPrefix = rx.exec($scope.login);

                StaffFactory.profile().get({login: emailPrefix[0]})
                    .$promise.then(function(data){
                        $scope.profileData = data;
                    }, function(data){
                        console.log('Error: cold not get profile! ' + data);
                    });
            }
        };
    }]);

