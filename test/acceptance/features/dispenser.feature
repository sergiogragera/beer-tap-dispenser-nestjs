Feature: The user wants to create a dispenser
  
  Scenario: User create a dispenser
    When the user creates a dispenser
    Then the user receives status code of 200

  Scenario: User create a dispenser when other dispensers exist
    Given the dispenser exists
     When the user creates a dispenser
     Then the user receives status code of 200