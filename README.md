# News API (News Space)

> This project was built as part of the backend for the News Space app hosted on Heroku. The RESTful API provides the end-user with an interface to interact with the databases, and retrieve articles, comments, topics and users.
> Live demo [_here_](https://news-space.herokuapp.com/).

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Contact](#contact)

## General Information

The RESTful API, through the various available endpoints, relays information to the end-user from the databases which store data entries about articles, comments, topics, and users. For example, the end-user may retrieve information about a selected article when an article id parameter has been inputted in the endpoint (‘https://news-space.herokuapp.com/api/articles/2’ will retrieve information about the article that has article id = 2). The API also accept queries in the request, such as ‘topic’ and ‘sort_by’. The former filters the retrieved array of articles by the topic referenced, and the latter sorts the retrieved array of articles by valid columns in the relational database for articles.

## Technologies Used

- node.js
- Express (4.18.1)
- PostgreSQL (14)

## Setup

To run and test the project locally, please follow the instructions below:

1. Clone the News API repo

   ```sh
   git clone https://github.com/OneInfiniteLoops/News-API.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Please note that you will need to access your own environment variables before you can connect to the two local databases. You can do this by creating two .env. files in the parent directory of the repository, .env.test and .env.development. These files are automatically ignored by Git. Once the files are created, set PGDATABASE=<database_name_here> to the corresponding databases respectively. For example, write PGDATABASE=<database_name_test> for the .env.test file.

4. Run "jest" on the test suites enclosed in app.test.js. The file is located in the "test" directory. Running the test file will automatically seed and use data from the test databases.

## Contact

Created by James Yeung [@OneInfiniteLoops].
