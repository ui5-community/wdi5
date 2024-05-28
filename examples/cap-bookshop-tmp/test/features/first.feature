Feature: Bookshop first feature file

    Scenario: Open "Manage Books" as "alice" and search for "jane"
        Given we have started the application
        And we have opened the url "/" with user "alice"
        When we select tile "Manage Books"
        And we search for "jane"
        Then we expect to have 2 table records