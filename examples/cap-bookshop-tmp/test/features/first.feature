Feature: Bookshop first feature file

    Scenario: Login as "alice", open "Browse Books" and search for "jane"
        Given we have started the application
        And we have opened the url "/" with user "alice"
        When we select tile "Browse Books"
        And we search for "jane"
        Then we expect to have 2 table records