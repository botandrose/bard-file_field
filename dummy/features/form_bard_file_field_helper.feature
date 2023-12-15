Feature: form.bard_file_field is an improved form.file_field input with extra features
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
    Then I should see an upload progress bar at 100% within the "image.jpg" uploaded-file

  Scenario: It can display an existing file
    When I attach the file "image.jpg" to "Image"
    And I press "Submit"
    Then I should see "Post created!"
    When I follow "Edit"
    Then I should see a preview of "image.jpg" within the "Image" bard-file

  Scenario: It can remove a not-yet-submitted file
    When I fill in "Name" with "No Image"
    And I attach the file "image.jpg" to "Image"
    Then I should see a preview of "image.jpg" within the "Image" bard-file
    When I follow "Remove media" within the "image.jpg" uploaded-file
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
    And I follow "Remove media" within the "image.jpg" uploaded-file
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


