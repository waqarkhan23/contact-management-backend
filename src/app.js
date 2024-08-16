import express from "express";
import cors from "cors";
const app = express();
import { Router } from "./routes/routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.use("/api", Router);

export default app;
