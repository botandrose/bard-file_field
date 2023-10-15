Feature: <bard-file> is an improved file input with extra features
  Background:
    Given I am on the homepage

  Scenario: I can use bard-file to attach a file to a form
    When I attach the file "image.jpg" to "Image"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

  Scenario: It displays a preview
    When I attach the file "image.jpg" to "Image"
    Then I should see a preview of "image.jpg" within the bard-file

  Scenario: It uploads the file before form submission
    When I attach the file "image.jpg" to "Image"
    Then I should see an upload progress bar at 100% within the bard-file

