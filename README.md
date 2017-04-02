# clubs
Clubs management system for KFUPM.

## Directories
- `/views` contains the pages in .ejs format, which is like html
- `/public` contains front-end files, e.g., `/public/js` contains front-end Javascript files

## Setup
To run the server, you'll need both [node.js](https://nodejs.org/en/) and [mongodb](https://www.mongodb.com/download-center?jmp=nav#community) installed on your machine. After that, clone the repository using the `git clone` command. Then `cd` into the directory and run `npm install`. This command installs all project dependencies and puts them in a folder called `node_modules`. It is like pip if you come from Python.

## Run
Now `start mongod --port 27027` in another terminal and run `node ./bin/www`. Now you can visit `localhost:3000` in your browser. Once the server starts, it should connect to the mongoDB server. You might face a problem with mongo regarding `dbpath`, read the problem carefully and try to configure the `dbpath` before trying again.

## Bugs
When you find bugs kindly open a new **issue** for it, if none is already opened for it.

If you face any problems, contact me.