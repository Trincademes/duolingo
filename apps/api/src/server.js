import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/student.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT ?? 3333;

// Middlewares globais: liberam acesso do mobile/admin e interpretam JSON do corpo.
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

// Cada grupo de rotas delega a regra de negocio para os services.
app.use("/auth", authRouter);
app.use("/", studentRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
