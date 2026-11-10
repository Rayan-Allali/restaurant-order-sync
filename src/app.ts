import express from 'express'
import cors from 'cors'
import { errorMiddleware } from './utils/errors'
import { ErrorResponse } from './utils/response'
import { HttpCodes } from './config/Errors'
import * as EnvProvider from './config/EnvProvider'
import System from './settings'
import { HOST_NAMES_ARR } from './host-name'
import SetRouters from './setRouters'
import { ProcessManager } from './process'
import { swaggerSpec } from './config/swagger'
export const app = express()
const { NODE_ENV, PORT } = EnvProvider.env
import swaggerUi from "swagger-ui-express";
const allowedOrigins: string[] = HOST_NAMES_ARR
app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalNetwork =
        EnvProvider.IN_DEVELOPMENT && origin != null 

      if (!origin || allowedOrigins.includes(origin) || isLocalNetwork) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

SetRouters(app)

app.set('trust proxy', true)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((_req, res) =>
  ErrorResponse(
    res,
    HttpCodes.NotImplemented.code,
    HttpCodes.NotImplemented.message
  )
)

app.use(errorMiddleware)


if (NODE_ENV !== 'test') {


  System.Start().then(async () => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`Backend available at http://localhost:${PORT}`);
      });

      ProcessManager.register(server);
  }).catch(async (error) => {
      console.error("System startup failed:", error);

      try {
        await System.Stop();
      } finally {
        process.exit(1);
      }
    });
}

