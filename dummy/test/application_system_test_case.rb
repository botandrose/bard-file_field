require "test_helper"
require "capybara/cuprite"

Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(
    app, **{
      window_size: [1200, 800],
      browser_options: {},
      process_timeout: 10,
      inspector: true,
      headless: false # !ENV["HEADLESS"].in?(%w[n 0 no false])
    }
  )
end
Capybara.default_driver = Capybara.javascript_driver = :cuprite

Capybara.server = :puma, { Silent: true }

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :cuprite, using: :chromium
end
