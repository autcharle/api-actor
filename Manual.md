## API Actor manual

### What we have

- A SQL script providing data of actors

### What we need

#### Tools/ Packages

- Visual studio code
- MySQL Workbench or any of database management software
- npm
- node

#### Backend server

- ExpressJS

### Step-by-step tutorial

#### Create an expressJS server

- Run a command _npm init_ to initialize a new Node.js project with npm, a Javascript package manager.
- Create a file named _server.js_ or whatever you want ending with _.js_, this will be an entry point of your backend server
- Open package.json and update "main" to that entry point file name. For example: "main": "server.js"
- Also add a line "type": "module" for further import use
- Run a command _npm install express --save_ to install package express and add to project as dependencies
- Open _server.js_ and start adding below code

      import express from "express";

      const server = express();

      server.get("/", async (req, res) => {
        res.json("Hello world");
      });

      server.listen(5000, () => {
        console.log("Listening on port 5000");
      });

- Run a command _node server.js_
- Open a browser and visit url "http://localhost:5000"
- Now a basic server is setup with the first api endpoint "/" to retrieve a response with string "Hello world"

#### Connect to MySQL database

- Install package _mysql2_ with a command _npm i mysql2 --save_
- Create a file _database.js_ within new folder _utils_
- Adding below code

        import mysql from "mysql2";

        const pool = mysql.createPool({
            host: <your_db_host>,
            database: <your_db_name>,
            user: <your_db_user>,
            password: <your_db_password>,
        });

        export default pool.promise();

- This file declares a function to create connection pool to MySQL server, so you will need to fill in _your_db_ details
- Final line is to export above function for global use
- Update _server.js_ as below

        import db from "./utils/database.js";

        server.get("/", async (req, res) => {
            const data = await db.execute("SELECT first_name, last_name FROM actor");
            res.json(data[0]);
        });

- Restart server and re-visit "http://localhost:5000"
- We will get the list of all actors details with their first name and last name
- Optional: for more security database details -> using dotenv configuration

  - Install package _dotenv_
  - Update utils/database.js

        import mysql from "mysql2";
        import "dotenv/config";

        const pool = mysql.createPool({
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
        });

        export default pool.promise();

  - Add _.env_ file at root folder

        DATABASE_HOST=<your_db_host>
        DATABASE_NAME=<your_db_name>
        DATABASE_USER=<your_db_user>
        DATABASE_PASSWORD=<your_db_pass>

#### Create a Data Transfer Object (DTO)

- Install package _sequelize_
- Create a Sequelize instance to connect to database, by create a file _utils/helper.js_

        import { Sequelize } from "sequelize";
        import "dotenv/config";

        const sequelize = new Sequelize(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        { dialect: "mysql", host: process.env.DATABASE_HOST }
        );

        export default sequelize;

- Define a model named actor based on same database table, by create a file _model/Actor.js_

        import { DataTypes } from "sequelize";
        import sequelize from "../utils/helper.js";

        const Actor = sequelize.define(
        "Actor",
        {
            actorId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "actor_id",
            },
            firstName: {
            type: DataTypes.STRING(45),
            primaryKey: false,
            field: "first_name",
            },
            lastName: {
            type: DataTypes.STRING(45),
            primaryKey: false,
            field: "last_name",
            },
            lastUpdate: {
            type: DataTypes.DATE,
            primaryKey: false,
            defaultValue: DataTypes.NOW,
            field: "last_update",
            },
        },
        {
            tableName: "actor",
            timestamps: false,
        }
        );

        export default Actor;

- Update _server.js_

        import Actor from "./model/Actor.js";

        server.get("/v1/actors", async (req, res) => {
            const data = await Actor.findAll();
            res.json(data);
        });

- Restart server and visit "http://localhost:5000/v1/actors"
- We will get a list of actors details as defined attributes of model actor

#### Automate DTO creation based on database tables

- Install package _sequelize-auto_
- Add a script into package.json

        "generate:models": "sequelize-auto -h %npm_config_HOST% -d %npm_config_DB% -u %npm_config_USER% -x %npm_config_PASS% -p 3306  --dialect mysql -o './models' -l esm --cm p --cp c --cf p -t actor"

- Run a command

  > npm run generate:models --HOST=<your_db_host> --db=<your_db_name> --USER=<your_db_user> --PASS=<your_db_password>

- We will get a folder models including _Actor.js_ and _init-models.js_ files
- Update _server.js_

        import sequelize from "./utils/helper.js";
        import initModels from "./models/init-models.js";

        const models = initModels(sequelize);

- Add to _server.js_

        server.get("/v1/actor/:id", async (req, res) => {
        const id = parseInt(req.params.id);
        const data = await models.Actor.findByPk(id);
        if (!data) {
            return res
            .status(404)
            .json({ errorId: "API-404", message: "Actor not found" });
        }
        res.json(data);
        });

- Restart server and visit "http://localhost:5000/v1/actors/<:id>"
  - <:id>: any number you want, please try 1 and 201 to see different responses

#### Implement APIs

- Install package _body-parser_
- Configure to retrieve response content as json only, in _server.js_

        import bodyParser from "body-parser";
        server.use(bodyParser.json());

- Implement rest of APIs, add to _server.js_

  - Create an actor API (POST)

        server.post("/v1/actors", async (req, res) => {
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(200).json(
            new Response({
                data: null,
                errors: [
                new Error({
                    errorId: "API-400",
                    message: "Missing first name or last name",
                }),
                ],
            })
            );
        }

        const data = await models.Actor.create({
            firstName: firstName,
            lastName: lastName,
            lastUpdate: Date.now(),
        });

        return res.status(201).json(new Response({ data, errors: null }));
        });

  - Important: Above code using defined class **Response** and **Error**, add 2 files

    - types/Response.js

            export class Response {
                constructor({ data, errors }) {
                    this.data = data;
                    this.errors = errors;
                }
            }

    - types/Error.js

            export class Error {
                constructor({ errorId, message }) {
                    this.errorId = errorId;
                    this.message = message;
                }
            }

  - Delete an actor API (DELETE)

        server.delete("/v1/actors/:id", async (req, res) => {
            const id = parseInt(req.params.id);
            const data = await models.Actor.findByPk(id);

            if (data) {
                data.destroy();
                return res.status(200).json(new Response({ data, errors: null }));
            }

            return res.status(200).json(
                new Response({
                data: null,
                errors: [
                    new Error({
                    errorId: "API-404-1",
                    message: "Actor not found to be deleted",
                    }),
                ],
                })
            );
        });

  - Update an actor API (PUT)

        server.put("/v1/actors/:id", async (req, res) => {
            const id = parseInt(req.params.id);
            const { firstName, lastName } = req.body;

            if (!firstName || !lastName) {
                return res.status(200).json(
                new Response({
                    data: null,
                    errors: [
                    new Error({
                        errorId: "API-400",
                        message: "Missing first name or last name",
                    }),
                    ],
                })
                );
            }

            const data = await models.Actor.findByPk(id);

            if (!data) {
                return res.status(200).json(
                new Response({
                    data: null,
                    errors: [
                    new Error({
                        errorId: "API-404-2",
                        message: "Actor not found to be updated",
                    }),
                    ],
                })
                );
            }

            data.firstName = firstName;
            data.lastName = lastName;
            data.lastUpdate = Date.now();
            data.save();

            return res.status(200).json(new Response({ data, errors: null }));
        });

- Restart server and try APIs on postman

### [API Specs](https://github.com/autcharle/api-actor?tab=readme-ov-file#api-specs)
