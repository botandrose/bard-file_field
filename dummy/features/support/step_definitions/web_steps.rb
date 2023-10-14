Given "I am on the homepage" do
  visit '/'
end

When "I attach the file {string} to {string}" do |path, field|
  attach_file field, Rails.root.join("features/support/fixtures/#{path}")
end

When "I attach the following files to {string}:" do |field, table|
  files = table.raw.map(&:first).map { |path| Rails.root.join("features/support/fixtures/#{path}") }
  attach_file field, files
end

When "I press {string}" do |button|
  click_button button
end

Then /^I should see "(.*?)"$/ do |text|
  expect(page).to have_content(text)
end

Then "I should see the {string} image" do |filename|
  expect(page).to have_css("img[src$='/#{filename}']")
end

Then "I should see a preview of {string} within the bard-file" do |filename|
  within find("bard-file").shadow_root do
    expect(page).to have_content(filename)
    expect(page).to have_css("img")
  end
end
