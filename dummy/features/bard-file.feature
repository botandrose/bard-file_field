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

  Scenario: It supports file type validation
    When I attach the file "video.mp4" to "Image"
    Then I should see "Image must be a image" within the bard-file
    Then I should not see a preview within the bard-file

    When I press "Submit"
    Then I should not see "Post created!"
    And I should not see "video.mp4"

  Scenario: It supports file size validation
    When I attach the file "video.mp4" to "Image"
    Then I should see "Image must be smaller than 100KB" within the bard-file
    Then I should not see a preview within the bard-file

    When I press "Submit"
    Then I should not see "Post created!"
    And I should not see "video.mp4"

  Scenario: It supports naive serialization and resumption with the form-persistence npm package
    When I fill in "Name" with "Jerry"
    And I attach the file "image.jpg" to "Image"
    Then I should see an upload progress bar at 100% within the bard-file

    Given I am on the homepage
    Then I should see "Name" filled in with "Jerry"
    # FIXME how can we show a preview of the already uploaded "image.jpg"
    And I should not see a preview

    When I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

