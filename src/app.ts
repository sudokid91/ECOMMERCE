import express from "express";
const app = express();

import { config } from "dotenv";
config();

import { dbConnect } from "./config/dbConnect";
dbConnect();

import authRoute from "./routes/authRoute";

import bodyParser from "body-parser";
import { errorHandler, notFoundError } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/user", authRoute);

app.use(notFoundError);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log("server listening on port: ", PORT);
});
