<!DOCTYPE html>
<html lang="en" ng-app="sisui">
  <head>
    <title>SIS</title>
    {% for script in scripts -%}
    <script src="{{ script }}?v={{version}}"></script>
    {% endfor %}
    <script src="./app/js/vendor/ace/ace.js"></script>
    <link rel="stylesheet" ng-href="{{ theme }}?v={{version}}">
    {%- for css_file in css -%}
    <link rel="stylesheet" href="{{ css_file }}?v={{version}}">
    {% endfor -%}
    <link rel="icon" href="./common/images/favicon.ico?v={{version}}" type="image/x-icon" />
  </head>
  <body>
    <header ng-hide="embedded" class="navbar navbar-default navbar-static-top">
      <div class="container">
        <div class="navbar-header"><a ui-sref="app.schemas.list" class="navbar-brand">SIS</a></div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            {% if docs.length %}
            <li class="dropdown" ng-class="{'active':$state.is('docs')}">
                <a class="dropdown-toggle" data-toggle="dropdown">Docs <span class="caret"></span></a>
                <ul class="dropdown-menu" role="menu">
                    {%- for doc in docs -%}
                    <li><a ui-sref="docs({doc:'{{ doc[0] }}'})">{{ doc[2] }}</a></li>
                    {% endfor -%}
                </ul>
            {% endif %}
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">Theme <span class="caret"></span></a>
                <ul class="dropdown-menu" role="menu" ng-controller="ThemeController" ng-init="setTheme('{{ themes[0] }}')">
                    {% for theme in themes %}
                    <li><a ng-click="setTheme('{{theme}}')">{{ theme }}</a></li>
                    {% endfor %}
                </ul>
            </li>
          </ul>
          <sis-userstatus></sis-userstatus>
        </div>
      </div>
    </header>
    <div class="container">
      <ui-view></ui-view>
    </div>
    <div ng-hide="embedded" class="footer">
        <div class="container">
            <ng-include src="'app/partials/footer.html'"></ng-include>
        </div>
    </div>
  </body>
</html>
