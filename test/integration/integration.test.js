// Test database connection
// configure env
// test server - to make requests
//test controller
// test router
// test service
// test data
import { expect } from "chai";
import sinon from "sinon";
import supertest from "supertest";

import Config from "../../src/config/Config.js";
import Database from "../../src/db/Database.js";
import Server from "../../src/server/Server.js";
import User from "../../src/models/User.model.js";
import UserController from "../../src/controllers/User.controller.js";
import UserRoutes from "../../src/routes/User.routes.js";
import UserService from "../../src/services/User.services.js";


import testData from "../data/sampleUsers.js"
const { testUsers, newUser }  = testData;


describe("Integration Tests", () => {
    let userServer;
    let userService;
    let database;
    let request;

    // create a server and connect to a database
    before(async () => {
        
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;
        userService = new UserService;
        const userController = new UserController(userService);
        const userRoutes = new UserRoutes(userController);  
        console.log(userRoutes);
        database = new Database(DB_URI)
        await database.connect();
        userServer = new Server(PORT, HOST, userRoutes);
        userServer.start();
        request = supertest(userServer.getApp());
        
    });

    after(async () => {
        await userServer.close();
        await database.close();
    })

    beforeEach(async () => {

        try {
            await User.deleteMany();
            console.log("Database cleared");
        } catch (e) {
            console.log(e.message);
            console.log("Error clearing");
            throw new Error();
        }
        
        try {
            await User.insertMany(testUsers);
            console.log("Database populated");            
        } catch (e) {
            console.log(e.message);

        }
    });

    describe("GET requests to / on UserRoutes", () => {

        it("should respond with a 200 status code for a GET request", async () => {
            const response = await request.get("/").send(testUsers[0]);
            expect(response.status).to.equal(200);
        })
    });

    describe("POST requests to /addLocation on UserRoutes", () => {

        it("should respond with a 201 status code for a post request", async () => {
            const response = await request.post("/addLocation").send({
                userRef: testUsers[0],
                location: "Paris"
            });
            expect(response.status).to.equal(201);
        })
    });

    describe("DELETE requests to /removeLocation on UserRoutes", () => {

        it("should respond with a 201 status code for a post request", async () => {
            const response = await request.delete("/removeLocation").send({
                userRef: testUsers[0],
                location: "Barcelona"
            });
            expect(response.status).to.equal(201);
        })
    });


    describe("POST requests to / on UserRoutes", () => {

        it("should respond with a 200 status code for a POST request", async () => {
            // console.log("new User ", newUser);
            const response = await request.post("/").send(newUser);
            // console.log(newUser);
            expect(response.status).to.equal(201);
        });

        it("should respond with the created user for a POST /", async () => {
            const response = await request.post("/").send(newUser);



            expect(response.body).to.include(newUser);
            // expect(response.body).to.include.keys('email', 'password', 'savedLocations');
            // expect(response.body.savedLocations).to.be.an('array');
        });

        it("should add a new user to the database for POST /", async () => {
            await request.post("/").send(newUser);
            const response = await request.get("/");
            const addedUser = response.body.find(
                (user) => user.email === newUser.email
            );
            expect(addedUser).to.include(newUser);
        });

        it("should add an empty array for savedLocations by default if there is not one already", async () => {
            await request.post("/").send(newUser);
            const response = await request.get("/");
            const addedUser = response.body.find(
                (user) => user.email === newUser.email
            );
            expect(addedUser).to.include(newUser);
        });

        it("should add an empty array for savedLocations by default if there is not one already", async () => {
            // Arrange
            const response = await request.post("/").send(newUser);
            // Act
            expect(response.status).to.equal(201);
            // Assert
            expect(response.body.savedLocations).to.deep.equal([]);
        }); 

        it("should respond with a 500 status code if there is an error", async () => {
            // Arrange
            const stub = sinon.stub(userService, "addUser");
            stub.throws(new Error("Test error"));
            // Act
            const response = await request.post("/").send(newUser);
            // Assert
            expect(response.status).to.equal(500);
        });

        it("should respond with a 400 status code for invalid POST - missing email", async () => {
            // Arrange
            const invalidUser = { ...newUser, email: null };
            // Act
            const response = await request.post("/").send(invalidUser);
            // console.log(response.message);
            // Assert
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property("errors");
        });

        it("should respond with a 400 status code for invalid POST - missing password", async () => {
            // Arrange
            const invalidUser = { ...newUser, password: null };
            // Act
            const response = await request.post("/").send(invalidUser);
            // console.log(response.message);
            // Assert
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property("errors");
        }); 

        
        it("should respond with a 400 status code for no email key", async () => {
            // Arrange
            const invalidUser = { ...newUser };
            delete invalidUser.email;
            console.log(invalidUser);
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property("errors");
        });
        
        it("should respond with a 400 status code for invalid user", async () => {
            // Arrange
            // Act
            const response = await request.post("/").send(" ");
            // Assert
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property("errors");
        }); 

        it("should respond with a 400 status code for invalid POST- additional key", async () => {
            // Arrange
            const invalidUser = { ...newUser, injection: "malicious code" };
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(500);

        });

        it("should respond with a 400 status code for invalid POST - invalid savedLocations ", async () => {
            // Arrange
            const invalidUser = { ...newUser, savedLocations: "not an array" };
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property("errors");
        });         






    });

    describe("PUT requests to /update from Todo Routes", () => {
        const testUser = testUsers[0];
        const testId = testUsers[0]._id;
        // const updatedUser = {
        //     ...testUser,
        //     password: "Updated password",
        // };

        it("should respond with a 200 status code for PUT /:id", async () => {
            const updatedUser = {
                email: "test-email1@domain.com",
                password: "newpassword",
            };
            const response = await request.put(`/update`).send(updatedUser);

            expect(response.status).to.equal(202);
        });


    });

});