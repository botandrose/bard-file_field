Given "I am on the homepage" do
  visit "/"
end

Given "I am on {string}" do |path|
  visit path
end

When "I reload the page" do
  visit page.current_path
end

When "I fill in {string} with {string}" do |field, value|
  fill_in field, with: value
end

When "I attach the file {string} to {string}" do |path, field|
  attach_file field, Rails.root.join("features/support/fixtures/#{path}")
end

When "I attach a file of type {string} to {string}" do |extension, field|
  path = Rails.root.join("features/support/fixtures/empty.#{extension}")
  FileUtils.touch(path)
  attach_file field, path
end

When "I attach the following files to {string}:" do |field, table|
  files = table.raw.map(&:first).map { |path| Rails.root.join("features/support/fixtures/#{path}") }
  attach_file field, files
end

When "I follow {string}" do |link|
  find_link(link).trigger "click"
end

When "I press {string}" do |button|
  click_button button
end

Then "I should see {string} filled in with {string}" do |field, value|
  expect(find_field(field).value).to eq(value)
end

Then /^I should see "(.*?)"$/ do |text|
  expect(page).to have_content(text)
end

Then /^I should not see "(.*?)"$/ do |text|
  expect(page).to_not have_content(text)
end

Then "I should see the {string} image" do |filename|
  expect(page).to have_css("img[src$='/#{filename}']")
end

Then "I should not see the {string} image" do |filename|
  expect(page).to_not have_css("img[src$='/#{filename}']")
end

Then "I should see a preview of {string}" do |filename|
  expect(find("uploaded-file")[:filename]).to eq(filename)
end

Then "I should not see a preview" do
  expect(page).to_not have_css("figure")
end

Then "I should see an upload progress bar at 100%" do
  page.document.synchronize 5, errors: [Capybara::ElementNotFound, Ferrum::JavaScriptError] do
    expect(page).to have_css("progress-bar[percent='100']")
  end
end

Then "the {string} bard-file should have a validation error containing {string}" do |field, message|
  messages = bard_file_validation_messages(field)
  expect(messages).to include message
end

Then "the {string} bard-file should have no validation errors" do |field|
  messages = bard_file_validation_messages(field)
  expect(messages).to be_empty
end

def bard_file_validation_messages field
  field = find_field(field)
  bard_file = field.find(:xpath, "..")
  [bard_file, *bard_file.all("uploaded-file input")].map do |e|
    e.evaluate_script("this.validationMessage")
  end.select(&:present?)
end

Then "debugger" do
  debugger
end
