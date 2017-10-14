# Application Objectives:
* One place for all clubs' activities. (members don't have to search in their whatsapp or email)
* Schedule events with date, time, and location.
* Know who will attend the event. (make decisions based on promises)
* Publish club's posts, and announcements.
* Restrict some events to members only.
* Join to get notified about your club's events. (through emails and notifications)
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

## Front-end developers scope
* `/views` contains the pages in .ejs format, which is html with embedded JavaScript
* `/views/partials` contains .ejs files that are included in other .ejs files
* `/public` contains front-end files, e.g., `/public/js` contains front-end JavaScript files
* As a front-end developer, you don't need to touch any folders other than these.

## Setup
1. Install [node.js](https://nodejs.org/en/) v7 or above.
2. Run `git clone https://github.com/HassanAlgoz/clubs.git`.
3. `cd` into the directory and run `npm install`. This command installs all project dependencies and puts them in a folder called `node_modules`. It is like pip if you come from Python.
4. You'll need to add a `.env` file, so ask me to give you one
5. Run `npm start`
6. Open `localhost:3000` in your browser

## Bugs
There will be bugs, so, when you find one kindly open a new **issue** for it, if none is already opened for it.

## Using The API
The REST API implemented follows:
* Plural naming of resources such as `/api/clubs/<club-ID>` and `/api/events/<event-ID>`
* `POST /api/clubs` Creates a new club
* `PUT /api/clubs/<club-ID>` To Modify
* `DELETE /api/clubs/<club-ID>` To delete
* Use a verb with `PUT` method for other operations on a resource. Example: `PUT /api/clubs/<club-ID>/join`.
