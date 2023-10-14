require "application_system_test_case"

class TestsTest < ApplicationSystemTestCase
  test "visiting the index" do
    visit root_url
  
    click_button "Submit"
  end
end
