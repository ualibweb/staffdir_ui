angular.module('ualib.staffdir')

    .service('StaffDirectoryService', [function(){
        var self = this; //ensures proper contest in closure statements
        this.sortBy = ''; // Default sort column, can be overridden via 'sortBy' attribute for staffDirectory directive
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).

        // reset all facets
        this.resetFacets = function(){
            self.facet = {};
        };


        // Accepts string or array arguments of facets to clear
        this.clearFacets = function(){
            var copy = {};
            var omitKeys = Array.prototype.concat.apply(Array.prototype, arguments);
            console.log(omitKeys);

            Object.keys(self.facet).map(function(key){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = self.facet[key];
                }
            });
            console.log(copy);
            angular.copy(copy, self.facet);
            console.log(self.facet);
        };

        /**
         * Inspired by Angular UI Router library omit() function
         * https://github.com/angular-ui/ui-router/blob/master/src/common.js
         */
        // extracted from underscore.js
        // Return a copy of the object omitting the blacklisted properties.
        function omit(obj) {
            var copy = {};
            var omitKeys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
            console.log(omitKeys);
            Object.keys(obj).map(function(key, index){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = obj[key];
                }
            });
            return copy;
        }
    }]);