import express from "express";

export default class Server{

    #app;
    #host;
    #port;
    #router;
    #server;

    constructor(port, host, router) {
        this.#app = express();
        this.#port = port;
        this.#host = host;
        this.#router = router
        this.#server = null;
        
    }

    getApp() {
        return this.#app;
    }

    start() {
        this.#server = this.#app.listen(this.#port, this.#host, () => {
            console.log(`Server listening on http://${this.#host}:${this.#port}`);
        });
        this.#app.use(express.json());
        this.#app.use(
            this.#router.getStartPoint(),
            this.#router.getRouter()
        );
        
    }

    close() {
        this.#server?.close();
    }
}