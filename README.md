# Clubs' Events WebApp
* One place for all clubs' activities.
* Schedule events with date, time, and location.
* Know who will attend the event.
* Publish club's posts, and announcements.
* Restrict some events to members only.
* Join to get notified about your club's events.
* The app runs on all platforms with a web browser.


## Files Tree
```
├───models
├───public
│   ├───css
│   │   ├───fonts
│   │   └───lib
│   ├───img
│   └───js
│       └───lib
├───routes
└───views
    └───partials
```
- `/views` contains the pages in .ejs format, which is html with embedded JavaScript.
- `/views/partials` contains .ejs files that are included in other .ejs files
- `/public` contains front-end files, e.g., `/public/js` contains front-end JavaScript files
- `/routes/index.js` contains the pages the user would visit

## Setup
To run the server, you'll need both [node.js](https://nodejs.org/en/) and [mongodb](https://www.mongodb.com/download-center?jmp=nav#community) installed on your machine. After that, clone the repository using the `git clone` command. Then `cd` into the directory and run `npm install`. This command installs all project dependencies and puts them in a folder called `node_modules`. It is like pip if you come from Python.

## Run
Now `start mongod --port 27017` in another terminal and run `npm start`. Now you can visit `localhost:3000` in your browser. Once the server starts, it should connect to the mongoDB server. You might face a problem with mongo regarding `dbpath`, read the problem carefully and try to configure `dbpath` before trying again.

## Bugs
There will be bugs, so, when you find one kindly open a new **issue** for it, if none is already opened.

If you face any problems, contact me.