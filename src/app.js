/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # Staff Directory App
 * ## default route: [/#/staffdir](http://www.lib.ua.edu/#/staffdir)
 */
/**
 * @ngdoc overview
 * @name staffdir
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires angular-filter
 * @requires ui-bootstrap
 * @requires angularLazyImg
 * @requires ualib-ui
 *
 * @description
 * # Staff Directory App
 * ## default route: [/#/staffdir](http://www.lib.ua.edu/#/staffdir)
 */

angular.module('ualib.staffdir', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'angularLazyImg',
    'ualib.ui',
    'ualib.staffdir.templates'
]);


//Alias for demo purposes
angular.module('staffdir', ['ualib.staffdir']);
