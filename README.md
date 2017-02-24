# clubs
Clubs management system for KFUPM.

## Directories
- `/views` contains the pages in .ejs format, which is like html
- `/public` contains front-end files, e.g., `/public/js` contains front-end Javascript files

## Setup
To run the server, you'll need both [node.js](https://nodejs.org/en/) and [mongodb](https://www.mongodb.com/download-center?jmp=nav#community) installed on your machine. After that, clone the repository using the `git clone` command. Then `cd` into the directory and run `npm install`. This command installs all project dependencies and puts them in a folder called `node_modules`. It is like pip if you come from Python.

## Run
Now `start mongod --port 27027` in another terminal and run `node ./bin/www`. Now you can visit `localhost:3000` in your broweser. Once the server starts, it should connect to the mongoDB server. You might face a problem with mongo regarding `dbpath`, read the problem carefully and try to configure the `dbpath` before trying again.

## Collaboration tips
- Use comments in a smart way.
- Try to eliminate the need of comments.
- Use meaningful and conventionally accepted variables names such as i, j, k, for indexing and so on.
- Don't feel the need to make everything an object or a function.
- Try to write meaningful commit messages


Suggestions are welcomed anytime.
