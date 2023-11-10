# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin "@rails/activestorage", to: "https://ga.jspm.io/npm:@rails/activestorage@7.1.1/app/assets/javascripts/activestorage.esm.js"
pin_all_from "app/javascript/controllers", under: "controllers"

pin "bard-file", to: "bard-file.js"
pin "bard-file/css", to: "bard-file/css.js"
pin "bard-file/file", to: "bard-file/file.js"
pin "bard-file/form-controller", to: "bard-file/form-controller.js"
pin "bard-file/format-bytes", to: "bard-file/format-bytes.js"
pin "bard-file/is-constructor", to: "bard-file/is-constructor.js"
pin "lit", to: "https://ga.jspm.io/npm:lit@3.0.0/index.js"
pin "@lit/reactive-element", to: "https://ga.jspm.io/npm:@lit/reactive-element@2.0.0/reactive-element.js"
pin "lit-element/lit-element.js", to: "https://ga.jspm.io/npm:lit-element@4.0.0/lit-element.js"
pin "lit-html", to: "https://ga.jspm.io/npm:lit-html@3.0.0/lit-html.js"
pin "lit-html/is-server.js", to: "https://ga.jspm.io/npm:lit-html@3.0.0/is-server.js"
pin "mime", to: "https://cdn.skypack.dev/mime/lite"

pin "form-persistence", to: "https://cdn.jsdelivr.net/npm/form-persistence@2.0.6/form-persistence.js/+esm"

pin "rails-request-json", to: "https://ga.jspm.io/npm:rails-request-json@0.0.1/index.js"
pin "@rails/request.js", to: "https://ga.jspm.io/npm:@rails/request.js@0.0.8/src/index.js"

