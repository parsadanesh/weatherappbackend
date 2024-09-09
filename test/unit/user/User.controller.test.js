import { expect } from "chai";
import sinon from "sinon";
import UserController from "../../../src/controllers/User.controller.js";

describe("UserController", () => {
    let userController;
    let userServices;
    let req;
    let res;

    beforeEach(() => {
        userServices = {
            addUser: sinon.stub(),
            editUser: sinon.stub(),
            getSaved: sinon.stub(),
            addLocation: sinon.stub()
        };
        userController = new UserController(userServices)
    })
    req = {
        body: {},
    };

    res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
    };

    describe("add a new user", () => {

        it("should add a new user", async () => {
            // Arrange
            const newUser = {
                _id: "1",
                email: "test-email@domain.com",
                password: "testpass1",
                savedLocations: []
            };
            userServices.addUser.resolves(newUser);
            // Act
            await userController.addUser(req, res);
            // Assert
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(newUser)).to.be.true;
        });


        it("should send a 500 response if addUser returns a user without an id", async () => {
            // Arrange
            const newUser = { email: "test-email@domain.com", password: "testpass1", savedLocations: []};
            userServices.addUser.resolves(newUser);
            // Act
            await userController.addUser(req, res);
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Unable to create account",
                })
            ).to.be.true;
        });   
        
        it("should send a 400 response if req.body is null", async () => {
            // Arrange
            req.body = null;

            // Act
            await userController.addUser(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid Details" })).to.be.true;
        });


    });

    describe("edit users password", () => {
        it("should edit a users password", async () => {
            // Assign
            const updatedUser = {
                email: "test-email@domail.com",
                password: "password123!",
            };
            userServices.editUser.resolves(user);


            // Act
            await userController.editUser(req, res);
            // Assert
            expect(res.status.calledWith(202)).to.be.true;
            expect(res.json.calledWith(user)).to.be.true;
            });    
    });
        
    describe("get saved locations", () => {
        it("should get the locations from the service and return as json", async () => {
            // Arrange
            const saved = [];
            userServices.getSaved.resolves(saved);
            // Act
            await userController.getSaved(req, res);

            // Assert
            expect(res.json.calledWith(saved)).to.be.true;

        });

        it("should send a 500 response if getSaved throws an error", async () => {
            // Arrange
            const testError = new Error("Test error");
            userServices.getSaved.rejects(testError);
            // Act
            await userController.getSaved(req, res);
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: testError.message })).to.be.true;

        })

        it("should send an empty array if no locations are saved", async () => {
            // Arrange
            const saved = [];
            userServices.getSaved.resolves(saved);
            // Act
            await userController.getSaved(req, res);
            // Assert
            expect(res.json.calledWith(saved)).to.be.true;

        })

    });

    describe("save a location", () => {
        it("should save a location", async () => {
            // Arrange
            const newUser = {
                _id: "1",
                email: "test-email@domain.com",
                password: "testpass1",
                savedLocations: ["London"]
            };

            userServices.addLocation.resolves(newUser);
            // Act
            
            await userController.addLocation(req, res);

            // Assert
            expect(res.json.calledWith(newUser)).to.be.true;

        });

        it.only("should throw 401 save a location", async () => {
            // Arrange
            const newUser = {
                _id: "1",
                email: "test-email@domain.com",
                password: "testpass1",
                savedLocations: []
            };

            userServices.addLocation.resolves(newUser);
            // Act
            req.body = null;
            // console.log(req);
            
            await userController.addLocation(req, res);
            

            // Assert
            expect(res.status.calledWith(400)).to.be.true;

        });
    });
})
