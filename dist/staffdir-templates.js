angular.module('ualib.staffdir.templates', ['staff-card/staff-card-list.tpl.html', 'staff-card/staff-card-md.tpl.html', 'staff-directory/staff-directory-facets.tpl.html', 'staff-directory/staff-directory-listing.tpl.html', 'staff-directory/staff-directory.tpl.html', 'staff-profile/staff-profile.tpl.html']);

angular.module("staff-card/staff-card-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-list.tpl.html",
    "<div ng-repeat=\"person in filteredList track by $index\">\n" +
    "    <div class=\"page-slice\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-12 col-sm-1\">\n" +
    "                <div class=\"alpha-index-header\" ng-if=\"person.alphaIndex[staffdir.facet.sortBy] != filteredList[$index-1].alphaIndex[staffdir.facet.sortBy]\">\n" +
    "                    <div ui-scrollfix=\"+0\">\n" +
    "                        {{person.alphaIndex[staffdir.facet.sortBy]}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-4 col-sm-3\">\n" +
    "                <img class=\"staff-portrait thumbnail\" ng-src=\"{{person.photo}}\" />\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-8\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-xs-12 col-sm-7 name-plate\">\n" +
    "                        <h3 class=\"name\">\n" +
    "                            <small ng-if=\"person.rank\">{{person.rank}}</small>\n" +
    "                            <a ng-href=\"/#/staffdir/profile/{{person.emailPrefix}}\" ng-if=\"person.profile !== null\">\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'firstname'}\" ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span>\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'lastname'}\" ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></span>\n" +
    "                            </a>\n" +
    "                            <span ng-if=\"person.profile == null\">\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'firstname'}\" ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span>\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'lastname'}\" ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></span>\n" +
    "                            </span>\n" +
    "                        </h3>\n" +
    "                        <h4 class=\"title\"><span ng-bind-html=\"person.title | highlight:staffdir.facet.search\"></span></h4>\n" +
    "                        <h5 class=\"hidden-xs\"><span ng-bind-html=\"person.department | highlight:staffdir.facet.search\"></span></h5>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div class=\"col-xs-12 col-sm-5\">\n" +
    "                        <ul class=\"fa-ul\">\n" +
    "                            <li ng-if=\"person.phone\"><span class=\"fa fa-phone fa-li\"></span>{{person.phone}}</li>\n" +
    "                            <li class=\"hidden-xs\" ng-if=\"person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li>\n" +
    "                            <li ng-if=\"person.email\"><span class=\"fa fa-envelope fa-li\"></span><a ng-href=\"mailto:{{person.email}}\" title=\"Email {{person.firstname}} {{person.lastname}}\">{{person.email}}</a></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-12 subject-specialty hidden-xs\" ng-if=\"person.subjects\">\n" +
    "                        <table class=\"table table-condensed\">\n" +
    "                            <thead>\n" +
    "                            <tr>\n" +
    "                                <th>Subject specialty</th>\n" +
    "                                <th class=\"text-center\">Selector</th>\n" +
    "                                <th class=\"text-center\">Instruction</th>\n" +
    "                            </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody>\n" +
    "                            <tr ng-repeat=\"subject in person.subjects | orderBy:'subject'\">\n" +
    "                                <td>\n" +
    "                                    <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\"></a>\n" +
    "                                    <span ng-if=\"!subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\">{{subject.subject}}</span>\n" +
    "                                </td>\n" +
    "                                <td class=\"text-center\"><span class=\"fa fa-circle text-info\" ng-if=\"subject.type == 1 || subject.type == 3\"></span></td>\n" +
    "                                <td class=\"text-center\"><span class=\"fa fa-circle text-info\" ng-if=\"subject.type > 1\"></span></td>\n" +
    "                            </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"alert alert-warning text-center\" role=\"alert\" ng-if=\"filteredList.length < 1\">\n" +
    "    <h2>\n" +
    "        No staff members found\n" +
    "        <span ng-if=\"staffdir.facet.library\"> in {{staffdir.facet.library}}</span>\n" +
    "        <span ng-if=\"staffdir.facet.selector\"> that are subject selectors</span>\n" +
    "        <span ng-if=\"staffdir.facet.instructor\"><span ng-if=\"staffdir.facet.selector\"> or</span> <span ng-if=\"!staffdir.facet.selector\"> that are</span> instruction librarians</span>\n" +
    "                <span ng-if=\"staffdir.facet.subject\">\n" +
    "                    <span ng-if=\"staffdir.facet.selector || staffdir.facet.instructor\"> for</span>\n" +
    "                    <span ng-if=\"!staffdir.facet.selector && !staffdir.facet.instructor\"> with a specialty in</span>\n" +
    "                     {{staffdir.facet.subject}}\n" +
    "                </span>\n" +
    "    </h2>\n" +
    "</div>");
}]);

angular.module("staff-card/staff-card-md.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-md.tpl.html",
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
    "                        <li ng-if=\"staffPerson.email\"><span class=\"fa fa-envelope fa-li\"></span><a href=\"mailto:{{staffPerson.email}}\">{{staffPerson.email}}</a></li>\n" +
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
    "<form class=\"facets-form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <h4>Filters</h4>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"facet-group\">\n" +
    "            <input class=\"form-control\" id=\"directorySearch\" name=\"directorySearch\" type=\"text\" ng-model=\"staffdir.facet.search\" placeholder=\"Keyword Search...\" ng-keyup=\"staffdir.changeFacet('search')\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <h5>Sort by</h5>\n" +
    "        <div class=\"facet-group\">\n" +
    "            <div class=\"btn-group btn-group-justified\">\n" +
    "                <label class=\"btn btn-default\" ng-model=\"staffdir.facet.sortBy\" btn-radio=\"'lastname'\" uncheckable ng-change=\"staffdir.changeFacet('sortBy')\">Last name</label>\n" +
    "                <label class=\"btn btn-default\" ng-model=\"staffdir.facet.sortBy\" btn-radio=\"'firstname'\" uncheckable ng-change=\"staffdir.changeFacet('sortBy')\">First name</label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <h5>Subject specialty</h5>\n" +
    "\n" +
    "        <div class=\"facet-group\">\n" +
    "\n" +
    "            <select class=\"form-control\" ng-model=\"staffdir.facet.subject\" name=\"subject\" ng-options=\"subject for subject in facets.subjects\" ng-change=\"staffdir.changeFacet('subject')\">\n" +
    "                <option value=\"\">-- Select Subject --</option>\n" +
    "            </select>\n" +
    "            <label class=\"checkbox-inline\">\n" +
    "                <input type=\"checkbox\" id=\"selector\" ng-true-value=\"1\" ng-model=\"staffdir.facet.selector\" ng-change=\"staffdir.changeFacet('selector')\"> Selector\n" +
    "            </label>\n" +
    "            <label class=\"checkbox-inline\">\n" +
    "                <input type=\"checkbox\" id=\"instructor\" ng-true-value=\"2\" ng-model=\"staffdir.facet.instructor\" ng-change=\"staffdir.changeFacet('instructor')\"> Instructor\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <h5>Department</h5>\n" +
    "        <div class=\"facet-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"staffdir.facet.department\" name=\"department\" ng-options=\"department for department in facets.departments\" ng-change=\"staffdir.changeFacet('department')\">\n" +
    "                <option value=\"\">-- Select Department --</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <h5>Library</h5>\n" +
    "        <div class=\"facet-group\">\n" +
    "            <div class=\"radio\">\n" +
    "                <label>\n" +
    "                    <input type=\"radio\" ng-model=\"staffdir.facet.library\" value=\"\" ng-checked=\"!staffdir.facet.library\" ng-change=\"staffdir.changeFacet('library')\"> All\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"radio\" ng-repeat=\"library in facets.libraries\">\n" +
    "                <label>\n" +
    "                    <input type=\"radio\" ng-model=\"staffdir.facet.library\" value=\"{{library}}\" ng-change=\"staffdir.changeFacet('library')\"> {{library}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <button class=\"btn btn-primary btn-block hidden-xs\" type=\"button\" ng-click=\"staffdir.clearFacets()\">\n" +
    "            <span class=\"fa fa-fw fa-refresh\"></span> Reset Filters\n" +
    "        </button>\n" +
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
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'lastname', 'sortable-reverse': staffdir.sortReverse && staffdir.facet.sortBy == 'lastname'}\">Name</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'title')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'title', 'sortable-reverse': staffdir.sortReverse && staffdir.facet.sortBy == 'title'}\">Title</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'department')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'department', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'department'}\">Department/Unit</a>\n" +
    "            </th>\n" +
    "            <th>Contact</th>\n" +
    "            <th class=\"hidden-xs hidden-sm\">Specialty</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"person in filteredList = (list | filter:staffdir.facet.search | filter:staffdir.facet.subject:true | orderBy:staffdir.sortBy:staffdir.sortReverse) track by $index\">\n" +
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
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-md-push-9\">\n" +
    "        <div class=\"staff-directory-facets\" facets=\"staffdir.facets\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-md-pull-3\">\n" +
    "        <div ng-show=\"facets.showFacetBar\">\n" +
    "            <ol class=\"breadcrumb facetcrumb\">\n" +
    "                <li ng-if=\"facets.facet.department\"><strong>Department:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('department')\">{{facets.facet.department | truncate : 20 : '...'}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                <li ng-if=\"facets.facet.library\"><strong>Library:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('library')\">{{facets.facet.library}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                <li ng-if=\"facets.facet.subject\"><strong>Subject:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('subject')\">{{facets.facet.subject}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                <li ng-if=\"facets.facet.selector\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('selector')\">Selector <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                <li ng-if=\"facets.facet.instructor\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('instructor')\">Instructor <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "\n" +
    "                <li class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=\"facets.clearFacets()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"staff-directory-listing\" list=\"staffdir.list\" sort-by=\"lastname\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("staff-profile/staff-profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-profile/staff-profile.tpl.html",
    "<h2>Faculty/Staff Profile</h2>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "        <img class=\"staff-portrait thumbnail\" ng-src=\"{{userProfile.person.photo}}\" ng-if=\"userProfile.person.photo != null\"\n" +
    "             width=\"180\" height=\"225\">\n" +
    "        <img class=\"staff-portrait thumbnail\" ng-src=\"wp-content/themes/roots-ualib/assets/img/user-profile.png\"\n" +
    "             ng-if=\"userProfile.person.photo == null\" width=\"180\" height=\"225\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9\">\n" +
    "        <h3 class=\"name\">\n" +
    "            <small ng-if=\"userProfile.person.rank\">{{userProfile.person.rank}}</small>\n" +
    "            <span ng-bind-html=\"userProfile.person.firstname\"></span> <span ng-bind-html=\"userProfile.person.lastname\"></span>\n" +
    "        </h3>\n" +
    "        <h4 class=\"title\"><span ng-bind-html=\"userProfile.person.title\"></span></h4>\n" +
    "        <h5 class=\"hidden-xs\"><span ng-bind-html=\"userProfile.person.department\"></span></h5>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <ul class=\"fa-ul\">\n" +
    "                <li ng-if=\"userProfile.person.phone\"><span class=\"fa fa-phone fa-li\"></span>{{userProfile.person.phone}}</li>\n" +
    "                <li class=\"hidden-xs\" ng-if=\"userProfile.person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{userProfile.person.fax}}</li>\n" +
    "                <li ng-if=\"userProfile.person.email\"><span class=\"fa fa-envelope fa-li\"></span>\n" +
    "                    <a href=\"mailto:{{userProfile.person.email}}\">{{userProfile.person.email}}</a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"userProfile.person.website.length > 11\"><span class=\"fa fa-external-link-square fa-li\"></span>\n" +
    "                    <a ng-href=\"{{userProfile.person.website}}\" class=\"external-link\">Personal website</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <ul class=\"fa-ul\">\n" +
    "                <li ng-if=\"userProfile.person.resume.length > 11\"><span class=\"fa fa-file-text fa-li\"></span>\n" +
    "                    <a ng-href=\"{{userProfile.person.resume}}\">Resume / CV</a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"userProfile.person.social1\">\n" +
    "                    <span ng-class=\"{{userProfile.person.snClass1}}\"></span>\n" +
    "                    <a ng-href=\"{{userProfile.person.social1}}\" class=\"external-link\">{{userProfile.person.snTitle1}}</a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"userProfile.person.social2\">\n" +
    "                    <span ng-class=\"{{userProfile.person.snClass2}}\"></span>\n" +
    "                    <a ng-href=\"{{userProfile.person.social2}}\" class=\"external-link\">{{userProfile.person.snTitle2}}</a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"userProfile.person.social3\">\n" +
    "                    <span ng-class=\"{{userProfile.person.snClass3}}\"></span>\n" +
    "                    <a ng-href=\"{{userProfile.person.social3}}\" class=\"external-link\">{{userProfile.person.snTitle3}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <span ng-bind-html=\"userProfile.person.profile\"></span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
