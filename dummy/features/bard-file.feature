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
    Then I should see a preview of "image.jpg" within the "Image" bard-file

  Scenario: It uploads the file before form submission
    When I attach the file "image.jpg" to "Image"
    Then I should see an upload progress bar at 100% within the "Image" bard-file

  Scenario: It supports file type validation
    When I attach the file "video.mp4" to "Image"
    Then the "Image" bard-file should have a validation error containing "Image must be a image."
    Then I should not see a preview within the "Image" bard-file

    When I press "Submit"
    Then I should not see "Post created!"
    And I should not see "video.mp4"

  Scenario: It supports file size validation
    When I attach the file "video.mp4" to "Image"
    Then the "Image" bard-file should have a validation error containing "Image must be smaller than 100KB, and \"video.mp4\" is 119.59KB. Please attach a smaller file."
    Then I should not see a preview within the "Image" bard-file

    When I press "Submit"
    Then I should not see "Post created!"
    And I should not see "video.mp4"

  Scenario: It supports naive serialization and resumption with the form-persistence npm package
    When I fill in "Name" with "Jerry"
    And I attach the file "image.jpg" to "Image"
    Then I should see an upload progress bar at 100% within the "Image" bard-file

    Given I am on the homepage
    Then I should see "Name" filled in with "Jerry"
    # FIXME how can we show a preview of the already uploaded "image.jpg"
    And I should not see a preview

    When I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

  Scenario: It can remove a not-yet-submitted file
    When I fill in "Name" with "No Image"
    And I attach the file "image.jpg" to "Image"
    Then I should see a preview of "image.jpg" within the "Image" bard-file
    When I follow "Remove media" within the "Image" bard-file
    And I press "Submit"
    Then I should see "Post created!"
    And I should see "No Image"
    And I should not see "image.jpg"
    And I should not see the "image.jpg" image

  Scenario: It can remove an existing file
    When I fill in "Name" with "Image"
    And I attach the file "image.jpg" to "Image"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

    When I follow "Edit"
    And I follow "Remove media" within the "Image" bard-file
    And I press "Submit"
    Then I should see "Post updated!"
    And I should not see "image.jpg"
    And I should not see the "image.jpg" image

  Scenario: It can update an existing file
    When I fill in "Name" with "Image"
    And I attach the file "image.jpg" to "Image"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

    When I follow "Edit"
    And I attach the file "image2.jpg" to "Image"
    And I press "Submit"
    Then I should see "Post updated!"
    And I should see "image2.jpg"
    And I should see the "image2.jpg" image

  Scenario: It supports multiple files
    When I attach the following files to "Images":
      | image.jpg  |
      | image2.jpg |
    And I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image
    And I should see "image2.jpg"
    And I should see the "image2.jpg" image

  # Scenario: It supports drag and drop
  # Scenario: The delete button is clicked mid-upload
  # Scenario: A new file is chosen mid-upload
  # Scenario: Submit button is disabled and summary displays when submitted before uploads complete
  # Scenario: It is disabled with the disabled attribute
  # Scenario: It is disabled when in a disabled fieldset


