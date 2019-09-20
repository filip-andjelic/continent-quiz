# Continent Quiz Test application

This web app is meant to simulate simple client-side web app for testing knowledge of Continents. 
It has following features:

      - Top 3 ranks holding highest points ever made saved in LocalStorage
      - Home / Reset button for clearing Top 3 ranks
      - Questions' screen containing 5 questions
      - Configuration object containing question number (5 currently, but possible to be changed) and total points format (currently thousand digit separator is `,` but possible to change)
      - Current questions' progress is saved in LocalStorage, meaning that if tab is refreshed User would be taken to the last question edited to continue where he'd left off
      - Results screen where User can see his current total result
      
Application is written using ReactJS with Aviator routing and custom Store system. 

To serve development version of the app run
``npm start``. In order to run bundled prod version of the app please run ``npm un build`` than ``serve -s build -l 4000`` and open tab with URL ``http://localhost:4000``.