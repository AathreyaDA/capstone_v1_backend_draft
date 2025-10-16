import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import { registerUser, login, connectDB, printAllUsers} from "./helpers/MongoFunctions.mjs";
import cors from "cors";

// dotenv.config();

dotenv.config({
    path:"../.env"
});

// console.log(process.env.MONGODB_CONNECTION_STRING)
const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://localhost:5173",
    credentials:false
}))
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from serverless-http locally!" });
});

await connectDB();

app.post("/api/register", async(req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const result = await registerUser(username, email, password);
  res.send(result);
})


app.post("/api/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const authorization = await login(username, password);

    res.send(authorization);
})
// export for Vercel
// export const handler = serverless(app);

// for local testing
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Local server running at http://localhost:${PORT}`);
  });
}
