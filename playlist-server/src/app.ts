import 'reflect-metadata';
// import path from 'path';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import express from 'express';
import { useExpressServer } from 'routing-controllers';
import * as containers from './services/ServiceProvider';

export const baseDir = __dirname;

(async () => {
    await containers.init();
    useContainer(Container);

    const app = express();
    useExpressServer(app, {
        cors: true,
        controllers: [baseDir + '//controllers/*{.js,.ts}'],
    });

    const port: number = Number(process.env.PORT) || 3400;
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
})();
