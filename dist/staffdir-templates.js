angular.module('ualib.staffdir.templates', ['staffdir.tpl.html']);

angular.module("staffdir.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffdir.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table class=\"table table-striped table-hover\">\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <th>Name</th>\n" +
    "                        <th>Title</th>\n" +
    "                        <th>Department/Unit</th>\n" +
    "                        <th>Contact</th>\n" +
    "                        <th>Expertise</th>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                    <tr ng-repeat=\"person in staffdir\">\n" +
    "                        <td>\n" +
    "                            <div ng-if=\"person.rank\" class=\"text-muted\"> {{person.rank}}</div>\n" +
    "                            {{person.lastname}}, {{person.firstname}}\n" +
    "                        </td>\n" +
    "                        <td>{{person.title}}</td>\n" +
    "                        <td>{{person.department}}</td>\n" +
    "                        <td>\n" +
    "                            <ul class=\"fa-ul\">\n" +
    "                                <li><span class=\"fa fa-phone fa-li\"></span>{{person.phone}}</li>\n" +
    "                                <li><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li>\n" +
    "                                <li><span class=\"fa fa-envelope fa-li\"></span>{{person.email}}</li>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <ul class=\"list-unstyled\" ng-if=\"person.subjects\">\n" +
    "                                <li ng-repeat=\"subject in person.subjects\">\n" +
    "                                    <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\">{{subject.subject}}</a>\n" +
    "                                    <span ng-if=\"!subject.link\">{{subject.subject}}</span>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
