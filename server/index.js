import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv/config";
import bodyParser from "body-parser";
import route from "./routes/route.js";
import cookieParser from "cookie-parser";
import cluster from "cluster";
import os from "os";

const PORT = parseInt(process.env.PORT || "4000", 10);

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Primary process PID: ${process.pid}`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`
    );
    console.log("Starting a new worker...");
    cluster.fork(); // Restart a new worker when one dies
  });
} else {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/", route);

  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Worker ${process.pid} connected to MongoDB`);
    })
    .catch((error) =>
      console.error(`Worker ${process.pid} error connecting to MongoDB:`, error)
    );

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}
