http://custardbelly.com/blog/blog-posts/2014/01/08/bdd-in-js-cucumberjs/

https://github.com/cucumber/cucumber-js/blob/master/example/example.js

https://github.com/cucumber/cucumber-js

https://github.com/cucumber/cucumber/wiki/Gherkin

Comment lines are allowed anywhere in the file. They begin with zero or more spaces, followed by a hash sign (#) and some amount of text.

Parser divides the input into features, scenarios and steps. When you run the feature the trailing portion (after the keyword) of each step is matched to a Ruby code block called Step Definitions.

     1: Feature: Some terse yet descriptive text of what is desired
     2:   Textual description of the business value of this feature
     3:   Business rules that govern the scope of the feature
     4:   Any additional information that will make the feature easier to understand
     5: 
     6:   Scenario: Some determinable business situation
     7:     Given some precondition
     8:       And some other precondition
     9:      When some action by the actor
    10:       And some other action
    11:       And yet another action
    12:      Then some testable outcome is achieved
    13:       And something else we can check happens too
    14: 
    15:   Scenario: A different situation

