import { app } from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Sever Running at : http:localhost:${PORT}`),
);
