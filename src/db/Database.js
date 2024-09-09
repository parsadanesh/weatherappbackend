import mongoose from "mongoose";

export default class Database {
    #uri;

    constructor(uri) {
        this.#uri = uri;
    }

    async connect() {
        try {
            await mongoose.connect(this.#uri);
            return console.log(`Connection to ${this.#uri} successful`)
        } catch (e) {
            console.log("connection error", e);
        }  
    }

    async close() {
        await mongoose.disconnect();
    }
}