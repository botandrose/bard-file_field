require "cucumber/rails"
require "capybara/cuprite"
require "cuprite/downloads/cucumber"
require "capybara/shadowdom"
require "capybara-screenshot/cucumber" unless ENV["CI"]

Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(app, {
    window_size: [1920, 2160],
    timeout: 20,
    process_timeout: 20,
    js_errors: true,
  })
end

Capybara.server = :puma, { Silent: true }
Capybara.default_driver = :cuprite
Capybara.default_normalize_ws = true

DatabaseCleaner.strategy = :truncation
DatabaseCleaner.clean_with :truncation
