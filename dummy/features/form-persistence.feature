Feature: It supports naive serialization and resumption with the form-persistence npm package
  Scenario: It works with not-yet-uploaded file
    Given I am on the homepage
    When I fill in "Name" with "Jerry"
    And I attach the file "image.jpg" to "Image"
    Then I should see an upload progress bar at 100% within the "image.jpg" uploaded-file

    Given I am on the homepage
    Then I should see "Name" filled in with "Jerry"
    And I should see a preview of "image.jpg" within the "Image" bard-file

    When I press "Submit"
    Then I should see "Post created!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

  Scenario: It works with an already uploaded file
    Given I am on the homepage
    When I fill in "Name" with "Jerry"
    And I attach the file "image.jpg" to "Image"
    Then I should see an upload progress bar at 100% within the "image.jpg" uploaded-file
    And I should see a preview of "image.jpg" within the "Image" bard-file
    When I press "Submit"
    Then I should see "Post created!"

    When I follow "Edit"
    Then I should see "Name" filled in with "Jerry"
    And I should see an upload progress bar at 100% within the "image.jpg" uploaded-file
    And I should see a preview of "image.jpg" within the "Image" bard-file

    When I reload the page
    Then I should see "Name" filled in with "Jerry"
    And I should see an upload progress bar at 100% within the "image.jpg" uploaded-file
    And I should see a preview of "image.jpg" within the "Image" bard-file

    When I press "Submit"
    Then I should see "Post updated!"
    And I should see "image.jpg"
    And I should see the "image.jpg" image

