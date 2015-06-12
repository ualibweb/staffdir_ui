angular.module('ualib.staffdir.templates', ['staff-card/staff-card-list.tpl.html', 'staff-card/staff-card.tpl.html', 'staff-directory/staff-directory-facets.tpl.html', 'staff-directory/staff-directory-listing.tpl.html', 'staff-directory/staff-directory.tpl.html']);

angular.module("staff-card/staff-card-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-list.tpl.html",
    "<div class=\"row\" ng-repeat=\"person in staffdir track by person.id\">\n" +
    "\n" +
    "        <div class=\"staff-card\" staff-person=\"person\"></div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("staff-card/staff-card.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card.tpl.html",
    "<div class=\"staff-card-container panel panel-default\">\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"name-plate col-sm-12 text-right\">\n" +
    "                <h4 class=\"name\"><small ng-if=\"staffPerson.rank\">{{staffPerson.rank}} </small>{{staffPerson.firstname}} {{staffPerson.lastname}}</h4>\n" +
    "                <div class=\"title\">{{staffPerson.title}}</div>\n" +
    "                <div class=\"\">{{staffPerson.department}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div class=\"staff-card-detail\">\n" +
    "                    <h6>Contact</h6>\n" +
    "                    <ul class=\"fa-ul\">\n" +
    "                        <li ng-if=\"staffPerson.phone\"><span class=\"fa fa-phone fa-li\"></span>{{staffPerson.phone}}</li>\n" +
    "                        <li ng-if=\"staffPerson.fax\"><span class=\"fa fa-fax fa-li\"></span>{{staffPerson.fax}}</li>\n" +
    "                        <li ng-if=\"staffPerson.email\"><span class=\"fa fa-envelope fa-li\"></span>{{staffPerson.email}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div class=\"staff-card-detail\" ng-if=\"staffPerson.subjects\">\n" +
    "                    <h6>Subject Expertise</h6>\n" +
    "                    <ul class=\"list-unstyled\">\n" +
    "                        <li role=\"presentation\" ng-repeat=\"subject in staffPerson.subjects | orderBy:subject.subject\" ng-class=\"{'disabled': !subject.link}\">\n" +
    "                            <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\">{{subject.subject}}</a>\n" +
    "                            <span title=\"{{subject.subject}}\" ng-if=\"!subject.link\">{{subject.subject}}</span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staff-directory/staff-directory-facets.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-facets.tpl.html",
    "<form class=\"facets-form form-horizontal text-center\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-5\">\n" +
    "            <input class=\"form-control\" id=\"directorySearch\" name=\"directorySearch\" type=\"text\" ng-model=\"staffdir.facet.search\" placeholder=\"Search...\" ng-keyup=\"changeFacet('search')\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-5 hidden-xs\">\n" +
    "            <select class=\"form-control\" ng-model=\"staffdir.facet.subject\" name=\"subject\" ng-options=\"subject for subject in facets.subjects\" ng-change=\"changeFacet('subject')\">\n" +
    "                <option value=\"\">-- Select Subject Specialty --</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-2\">\n" +
    "            <button class=\"btn btn-primary hidden-xs\" type=\"button\" ng-click=\"clearFacet('search', 'subject')\">\n" +
    "                <span class=\"fa fa-refresh\"></span> Reset Filters\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("staff-directory/staff-directory-listing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-listing.tpl.html",
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table table-striped table-condensed table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>\n" +
    "                <a href=\"#\"\n" +
    "                   ng-click=\"sortList($event, 'lastname')\"\n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.sortBy == 'lastname', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'lastname'}\">Name</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'title')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.sortBy == 'title', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'title'}\">Title</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'department')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.sortBy == 'department', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'department'}\">Department/Unit</a>\n" +
    "            </th>\n" +
    "            <th>Contact</th>\n" +
    "            <th class=\"hidden-xs hidden-sm\">Specialty</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"person in filteredList = (list | filter:staffdir.facet.search | filter:staffdir.facet.subject:true | orderBy:staffdir.sortBy:staffdir.sortReverse) track by  person.id\">\n" +
    "            <td class=\"text-nowrap\">\n" +
    "                <div ng-if=\"person.rank\" class=\"text-muted\"> {{person.rank}}</div>\n" +
    "                <span ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span> <strong ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></strong>\n" +
    "\n" +
    "            </td>\n" +
    "            <td class=\"hidden-xs\"><span ng-bind-html=\"person.title | highlight:staffdir.facet.search\"></span></td>\n" +
    "            <td class=\"hidden-xs\"><span ng-bind-html=\"person.department | highlight:staffdir.facet.search\"></span></td>\n" +
    "            <td>\n" +
    "                <ul class=\"fa-ul\">\n" +
    "                    <li ng-if=\"person.phone\"><span class=\"fa fa-phone fa-li\"></span>{{person.phone}}</li>\n" +
    "                    <li ng-if=\"person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li>\n" +
    "                    <li ng-if=\"person.email\"><span class=\"fa fa-envelope fa-li\"></span> <a ng-href=\"mailto:{{person.email}}\" title=\"Email {{person.firstname}} {{persone.lastname}}\">{{person.email}}</a></li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "            <td class=\"hidden-xs hidden-sm\">\n" +
    "                <ul class=\"list-unstyled\" ng-if=\"person.subjects\">\n" +
    "                    <li ng-repeat=\"subject in person.subjects | orderBy:subject.subject\">\n" +
    "                        <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\"></a>\n" +
    "                        <span ng-if=\"!subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\">{{subject.subject}}</span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"filteredList.length === 0\">\n" +
    "        <h2>\n" +
    "            No results<span ng-if=\"staffdir.facet.subject\"><strong> for {{staffdir.facet.subject}}</strong> subject specialists</span>\n" +
    "            <span ng-if=\"staffdir.facet.search\"> matching <strong>\"{{staffdir.facet.search}}\"</strong></span>\n" +
    "        </h2>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staff-directory/staff-directory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory.tpl.html",
    "<div class=\"page-header\">\n" +
    "    <h1>Staff Directory</h1>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"page-slice\">\n" +
    "    <div class=\"staff-directory-facets\" facets=\"staffdir.facets\"></div>\n" +
    "</div>\n" +
    "<div class=\"staff-directory-listing\" list=\"staffdir.list\" sort-by=\"lastname\"></div>\n" +
    "\n" +
    "\n" +
    "");
}]);
