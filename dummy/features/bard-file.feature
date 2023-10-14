Feature: <bard-file>
  Scenario: It works
    Given I am on the homepage
    When I attach the file "image.jpg" to "Image"
    Then I should see a preview of "image.jpg" within the bard-file

    When I press "Submit"
    Then I should see "Post created!"
    Then I should see "image.jpg"
    And I should see the "image.jpg" image
