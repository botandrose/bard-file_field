Given "I am on the homepage" do
  visit "/"
end

Given "I am on {string}" do |path|
  visit path
end

When "I fill in {string} with {string}" do |field, value|
  fill_in field, with: value
end

When "I attach the file {string} to {string}" do |path, field|
  attach_file field, Rails.root.join("features/support/fixtures/#{path}")
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
  figure = find("figure")
  expect(figure).to have_content(filename)
  expect(figure).to have_css("img")
end

Then "I should not see a preview" do
  expect(page).to_not have_css("figure")
end

Then "I should see an upload progress bar at 100%" do
  expect(page).to have_css(".direct-upload--complete")
end

Then "the {string} bard-file should have a validation error containing {string}" do |field, message|
  field = find_field(field)
  bard_file = field.find(:xpath, "..")
  within(bard_file) do
    el = find("input[type=text]")
    actual = el.evaluate_script("this.validationMessage")
    expect(actual).to include message
  end
end

Then "debugger" do
  debugger
end
