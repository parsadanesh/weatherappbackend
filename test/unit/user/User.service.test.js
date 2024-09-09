import { expect } from "chai";
import sinon from "sinon";

import User from "../../../src/models/User.model.js";
import UserService from "../../../src/services/User.services.js";


describe("userService Tests", () => {
    let userService;

    beforeEach(() => {
        userService = new UserService();
    })


    describe("getSaved Tests", () => {

        it("should call find on the User model", async () => {
            const findStub = sinon.stub(User, "find")
            findStub.returnsThis([]);

            await userService.getSaved();

            expect(findStub.calledOnce).to.be.true;

            findStub.restore();
        });


    });

    

});