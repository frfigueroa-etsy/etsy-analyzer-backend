import express, {Router} from 'express'
import cors from 'cors'
import { envs } from './configs/envs'

interface Options {
    port: number;
    routes:Router;
}

export class Server {
    public readonly app = express();
    private serverListener: any;
    private readonly port:number;
    private readonly routes:Router;

    constructor(options:Options){
        const { port, routes} = options;
        this.port = port;
        this.routes = routes;
    }

    async start(){
        //* Middlewares
        this.app.use(express.json());
        this.app.use(cors());

        //* REST API Routes
        this.app.use(this.routes);

        //*PORT
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Etsy Analyzer Server running at http://localhost:${this.port}`);
        });

    }

    async close(){
        this.serverListener?.close();
    }

}