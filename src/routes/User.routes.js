import { Router } from "express";
import UserValidator from "../middleware/User.validator.js";
import UserController from "../controllers/User.controller.js";

export default class UserRoutes {
    #controller;
    #router;
    #startPoint;

    constructor(controller = new UserController(), startPoint = "/") {
        this.#controller = controller;
        this.#router = Router();
        this.#startPoint = startPoint;
        this.#initialiseRoutes();
    }

    #initialiseRoutes() {      
        this.#router.get(
            "/",
            this.#controller.getSaved
        );
        this.#router.post(
            "/",
            UserValidator.validate(),
            this.#controller.addUser
        );
        this.#router.put(
            "/update",
            UserValidator.validate(),
            this.#controller.editUser
        );
        this.#router.post("/login",
            this.#controller.login
        );
        this.#router.post(
            "/addLocation",
            this.#controller.addLocation
        )
        this.#router.delete(
            "/removeLocation",
            this.#controller.removeLocation
        );
    }

    getRouter() {
        return this.#router;
    }

    getStartPoint() {
        return this.#startPoint;
    }
}