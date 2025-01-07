Feature: The user wants to retrieve usages of dispenser

  Scenario: User retrieve dispenser without usages
    Given the dispenser exists
     When the user gets the dispenser spendings
     Then the user receives status code of 200
      And the total amount is equals to 0

  Scenario: User retrieve opened dispenser
    Given the dispenser exists
      And the user open the dispenser 10 seconds ago
     When the user gets the dispenser spendings
     Then the user receives status code of 200
      And the total amount is greater than 0

  Scenario: User retrieve closed dispenser
    Given the dispenser exists
      And the user open the dispenser 10 seconds ago
      And the user close the dispenser
     When the user gets the dispenser spendings
     Then the user receives status code of 200
      And the total amount is greater than 0
      And exists 1 usage

   Scenario: User retrieve opened dispenser closed ago
    Given the dispenser exists
      And the user open the dispenser 10 seconds ago
      And the user close the dispenser 5 seconds ago
      And the user open the dispenser
     When the user gets the dispenser spendings
     Then the user receives status code of 200
      And the total amount is greater than 0
      And exists 2 usages

  Scenario: User retrieve closed dispenser multiple times
    Given the dispenser exists
      And the user open the dispenser 10 seconds ago
      And the user close the dispenser 7 seconds ago
      And the user open the dispenser 5 seconds ago
      And the user close the dispenser
     When the user gets the dispenser spendings
     Then the user receives status code of 200
      And the total amount is greater than 0
      And exists 2 usages