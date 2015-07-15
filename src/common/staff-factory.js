angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', function($resource){
        return {
            directory: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people', {}, {cache: true});
            },
            byEmail: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/email/:email', {}, {cache: true});
            },
            byName: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/firstname/:firstname/lastname/:lastname', {}, {cache: true});
            },
            byId: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people/search/id/:id', {}, {cache: true});
            }
        };
    }]);