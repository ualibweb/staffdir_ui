angular.module('ualib.staffdir')

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
                }
            }
        });
    }])

    .service('StaffDirectoryService', ['$location', '$rootScope', function($location, $rootScope){
        var self = this; //ensures proper contest in closure statements
        this.sortBy = ''; // Default sort column, can be overridden via 'sortBy' attribute for staffDirectory directive
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
            self.showFacetBar = !isEmptyObj(self.facet) && val && !self.facetExceptions.hasOwnProperty(facet);
            $rootScope.$broadcast('facetsChange');
        };

        this.specialtyType = function(staff){
            var type = (self.facet.selector | self.facet.instructor);
            if (type){
                return staff.subjects.filter(function(subj){
                        var isType = (subj.type & type) === type;
                        return self.facet.subject ? (self.facet.subject === subj.subject) && isType : isType;
                    }).length > 0;
            }
            return true;
        };

        function isEmptyObj(obj){
            var name;
            for (name in obj){
                if (obj[name]){
                    return false;
                }
            }
            return true;
        }

    }]);