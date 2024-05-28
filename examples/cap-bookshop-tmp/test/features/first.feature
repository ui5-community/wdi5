Feature: Bookshop first feature file

    Scenario: Open "Browse Books" and search for "jane"
        Given we have started the application
        And we have opened the url "/"
        When we select tile "Browse Books"
        And we search for "jane"
        Then we expect to have 2 table records