Feature: User can close the dispenser when dispenser is opened
  Scenario: User close an opened dispenser
    Given the dispenser exists
      And the user open the dispenser
      And the user close the dispenser
     Then the user receives status code of 202

  Scenario: User close a closed dispenser
    Given the dispenser exists
      And the user close the dispenser
     Then the user receives status code of 409

  Scenario: User close an opened dispenser before open
    Given the dispenser exists
      And the user open the dispenser
      And the user close the dispenser 1 second ago
     Then the user receives status code of 409
    
  Scenario: User close an opened dispenser after usage
    Given the dispenser exists
      And the user open the dispenser
      And the user close the dispenser
      And the user open the dispenser
      And the user close the dispenser
     Then the user receives status code of 202