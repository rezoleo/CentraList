# Import node.js `path` module.
sysPath = require 'path'

# A simple helper that checks if string starts with substring.
startsWith = (string, substring) ->
  string.lastIndexOf(substring, 0) is 0

exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  conventions:
    assets: /^app\/assets\//
    ignored: (path) ->
      startsWith sysPath.basename(path), '_' or /^bower_components\/bootstrap\//.test(path)
  modules:
    definition: false
    wrapper: false
  paths:
    public: '_watch'
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(bower_components|vendor)/

    stylesheets:
      joinTo:
        'css/app.css': /^(app|vendor)/
      order:
        before: [
          'app/styles/bootstrap.less'
        ]

    templates:
      joinTo: 
        'js/dontUseMe' : /^app/ # dirty hack for Jade compiling.

  plugins:
    jade:
      pretty: no # Adds pretty-indentation whitespaces to output (false by default)
    jade_angular:
      modules_folder: 'views'
      locals: {}


  # Enable or disable minifying of result js / css files.
  simplify: yes
  # overrides
  overrides:
    production:
      paths:
        public: 'dist'
