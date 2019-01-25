# Firebase Train Scheduler

## Overview
[![Train Schduler](assets/images/275x200TrainScheduler.png)](https://plinck.github.io/TrainScheduler/)

This is a Totrain schedule application that uses Firebase to host arrival and departure data for trains. First, you schedule a train by entering relevant information about when it is first scheduled and how often it runs.  Then, the app shows the schedule of all the trains and when the next arrival time is and how many minutes until it arrives.
  
* When adding trains, you provide the following:
  * Train Name
  * Destination
  * First Train Time -- in military time
  * Frequency -- in minutes
  
* The app calculates when the next train will arrive based on current time and frequency
* The app updates the train arrivals (next time and minutes away) every minute to keep the times up to the minute on the web page
* I added a `delete` button to the list of trains to allow you to delete it

### Live Link
* [Demo](https://plinck.github.io/TrainScheduler/)

### Screen Shots
* ![Demo](https://plinck.github.io/TrainScheduler/assets/images/page1.png)
* ![Demo](https://plinck.github.io/TrainScheduler/assets/images/page2.png)

### Possible New Features

* Add `update` button for each train. Let the user edit the row's elements-- allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).

* As a final challenge, make it so that only users who log into the site with their Google or GitHub accounts can use your site. You'll need to read up on Firebase authentication for this bonus exercise.

* A bit more refactroing of code and design improvements as time permits

## Linked my responsive portffolio and my bootstrap portfolio sites

I added a portfolio item to both my responsive and bootstrap portfolio.  Both of those have a portfolio item that links to this game.  Just click on the image to open up the game.  You can link to either of them by clicking the links below:

* [Responsvive Portfolio](https://plinck.github.io/Responsive-Portfolio/portfolio.html)
* [Bootstrap Portfolio](https://plinck.github.io/Bootstrap-Portfolio/portfolio.html)

- - -
