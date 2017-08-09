angular.module('ualib.staffdir')

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

    }]);