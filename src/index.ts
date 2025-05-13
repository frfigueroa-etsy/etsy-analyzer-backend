import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { RouterManager } from './routes/RouteManager';
import { envs } from './configs/envs';
import { Server} from './server'

dotenv.config();

(async() => {
  main()
})();

async function main(){
  console.log(envs.PORT)
  const server = new Server({
    port:envs.PORT,
    routes:RouterManager.routes
  });

  server.start();
}