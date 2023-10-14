# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"

pin_all_from "src"

pin "lit", to: "https://ga.jspm.io/npm:lit@3.0.0/index.js"
pin "@lit/reactive-element", to: "https://ga.jspm.io/npm:@lit/reactive-element@2.0.0/reactive-element.js"
pin "lit-element/lit-element.js", to: "https://ga.jspm.io/npm:lit-element@4.0.0/lit-element.js"
pin "lit-html", to: "https://ga.jspm.io/npm:lit-html@3.0.0/lit-html.js"
pin "lit-html/is-server.js", to: "https://ga.jspm.io/npm:lit-html@3.0.0/is-server.js"

pin "file-type", to: "https://ga.jspm.io/npm:file-type@18.2.1/browser.js"
pin "buffer", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/buffer.js"
pin "events", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/events.js"
pin "ieee754", to: "https://ga.jspm.io/npm:ieee754@1.2.1/index.js"
pin "inherits", to: "https://ga.jspm.io/npm:inherits@2.0.4/inherits_browser.js"
pin "node:buffer", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/buffer.js"
pin "node:stream", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/stream.js"
pin "peek-readable", to: "https://ga.jspm.io/npm:peek-readable@5.0.0/lib/index.js"
pin "process", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/process-production.js"
pin "readable-stream", to: "https://ga.jspm.io/npm:readable-stream@3.6.0/readable-browser.js"
pin "readable-stream/lib/internal/streams/from.js", to: "https://ga.jspm.io/npm:readable-stream@3.6.0/lib/internal/streams/from-browser.js"
pin "readable-stream/lib/internal/streams/stream.js", to: "https://ga.jspm.io/npm:readable-stream@3.6.0/lib/internal/streams/stream-browser.js"
pin "readable-web-to-node-stream", to: "https://ga.jspm.io/npm:readable-web-to-node-stream@3.0.2/lib/index.js"
pin "string_decoder", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/string_decoder.js"
pin "strtok3/core", to: "https://ga.jspm.io/npm:strtok3@7.0.0/lib/core.js"
pin "token-types", to: "https://ga.jspm.io/npm:token-types@5.0.1/lib/index.js"
pin "util", to: "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/util.js"
pin "util-deprecate", to: "https://ga.jspm.io/npm:util-deprecate@1.0.2/browser.js"
