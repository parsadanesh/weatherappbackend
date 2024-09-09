import UserService from "../services/User.services.js";

export default class UserController {
    #service;

    constructor(service = new UserService()) {
        this.#service = service;
    }

    getSaved = async (req, res) => {
        const invalidError = new Error("Invalid Details");
        try {
            if (!req.body) throw invalidError;
            res.json(await this.#service.getSaved(req.body));            
        } catch (error) {
            if (e.message === invalidError.message) {
                res.status(400).json({ message: e.message });
            }
            res.status(500).json({message: error.message })
        }        
    };

    addLocation = async (req, res) => {
        const invalidError = new Error("Invalid Details");
        try {
            
            if (!req.body) throw invalidError;
            const newUser = await this.#service.addLocation(req.body);
            res.status(201).json(newUser);
            
        } catch (e) {
            if (e.message === invalidError.message) {
                res.status(400).json({ message: e.message });
            }
            res.status(500).json({ message: e.message });  
            
        }
    }

    removeLocation = async (req, res) => {
        const invalidError = new Error("Invalid Details");
        try {
            if (!req.body) throw invalidError;
            
            const newUser = await this.#service.removeLocation(req.body);
            
            res.status(201).json(newUser);
        } catch (e) {
            if (e.message === invalidError.message) {
                res.status(400).json({ message: e.message });
            }
            res.status(500).json({ message: e.message });  
            
        }
    }
    
    addUser = async (req, res) => {
        const invalidError = new Error("Invalid Details");
        try {
            if (!req.body) throw invalidError;  
            const newUser = await this.#service.addUser(req.body)
            if (!newUser._id) {
                throw new Error("Unable to create account"); 
            }
            res.status(201).json(newUser);
        } catch (e) {
            if (e.message === invalidError.message) {
                res.status(400).json({ message: e.message });
            }
            res.status(500).json({ message: e.message });  
            
        }
    }

    editUser = async (req, res) => {
        try {
            const updatedUser = await this.#service.editUser(req.body);
            if (!updatedUser || !updatedUser.email || !updatedUser.password)
                throw Error("User was not found.");


            res.status(202).json(updatedUser);  
        } catch (e) {
            res.status(500).json({ message: e.message });
            
        }
    }

    login = async (req, res) => {
        try {
            const user = await this.#service.login(req.body);
            res.status(200).send({ message: `Login Success`, user });
        } catch (e) {
            res.status(400).send({
                message: `Unable to login with these details`,
                user: req.body,
            });
        }
    }
}