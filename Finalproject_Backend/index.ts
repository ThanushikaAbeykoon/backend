import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"; // Import the cors package
import { MONGO_URI } from "./config";
import { ArenaRoute, CoachRoute, CustomerRoute, UserRoute } from "./routes";

const app = express();

// Enable CORS for all origins
app.use(cors()); // This will allow all origins by default

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", UserRoute);
app.use("/arena", ArenaRoute);
app.use("/book", CustomerRoute);
app.use("/coach", CoachRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(8000, () => {
  console.clear();
  console.log("Server is running on port 8000");
});
