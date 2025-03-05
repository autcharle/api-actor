## API Actor

### Prerequisite

- Mysql database setup with provided SQL script
- Database connected

### Setting up .env

- Create a .env file placed at root folder
- Add 4 variables to the file
  - DATABASE_HOST=<connected_db_host_url>
  - DATABASE_NAME=<connected_db_name>
  - DATABASE_USER=<connected_db_user>
  - DATABASE_PASSWORD=<connected_db_password>
- Save and now you're ready to run the backend server

### Running server on port 5000

- Run a command in terminal
  > npm run start

### API specs

| Method | Endpoint       | Description                                        |
| ------ | -------------- | -------------------------------------------------- |
| GET    | /v1/actors     | retrieve list of all actors                        |
| GET    | /v1/actors/:id | retrieve details of an actor with id               |
| POST   | /v1/actors     | add an actor with firstName and lastName           |
| PUT    | /v1/actors/:id | update firstName and lastName of an existing actor |
| DELETE | /v1/actors/:id | delete an existing actor with id                   |
