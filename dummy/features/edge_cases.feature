Feature: Various edge cases
  Scenario: File remains in form after rails validation error
    Given I am on "/edge_cases/rails_validation_error"
    When I attach the file "image.jpg" to "Image"
    Then I should see a preview of "image.jpg" within the "Image" bard-file
    When I fill in "Number" with "NOT A NUMBER"
    And I press "Submit"

    Then I should not see "Post created!"
    And I should see "Number is not a number"
    And I should see a preview of "image.jpg" within the "Image" bard-file

    When I fill in "Number" with "0"
    And I press "Submit"
    Then I should see "Post created!"
    And I should see a preview of "image.jpg" within the "Image" bard-file

