import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/student.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    success: true,
    data: {
      status: "ok"
    }
  });
});

app.use("/auth", authRouter);
app.use("/", studentRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
