angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', function($resource){
        return {
            directory: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people', {}, {cache: true});
            },
            person: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/person', {}, {cache: true});
            }
        };
    }]);