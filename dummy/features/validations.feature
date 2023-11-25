Feature: form.bard_file_field has validation options
  Scenario: It supports required validation
    Given I am on "/validations/required_file"

    When I press "Submit"
    Then I should not see "Post created!"
    And the "Required file" bard-file should have a validation error containing "Please select a file."

    When I attach the file "image.jpg" to "Required file"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see a preview of "image.jpg" within the "Required file" bard-file

  Scenario: It supports file type validation
    Given I am on "/validations/optional_image"

    When I attach the file "video.mp4" to "Optional image"
    Then the "Optional image" bard-file should have a validation error containing "Optional image must be a image."
    Then I should not see a preview within the "Optional image" bard-file

    When I press "Submit"
    Then I should not see "Post created!"
    And I should not see "video.mp4"

    When I attach the file "image.jpg" to "Optional image"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see a preview of "image.jpg" within the "Optional image" bard-file

  Scenario: It supports file size validation
    Given I am on "/validations/optional_file_with_max_size"
    When I attach the file "video.mp4" to "File"
    Then the "File" bard-file should have a validation error containing "File must be smaller than 100KB, and \"video.mp4\" is 119.59KB. Please attach a smaller file."
    Then I should not see a preview within the "File" bard-file

    When I press "Submit"
    Then I should not see "Post created!"
    And I should not see "video.mp4"

    When I attach the file "image.jpg" to "File"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see a preview of "image.jpg" within the "File" bard-file

