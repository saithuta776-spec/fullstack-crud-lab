import cors from "cors";
import healthRoute from "./routes/v1/health.js";
import { NextFunction, Response, Request } from "express";
import { customRequest } from "./types/index.js";
import express from "express";
// import viewRoute from "./routes/w";
// import authRouter from "./routes/v1/auth.js";
// import userRouter from "./routes/v1/admin/user.js";
// import profileRouter from "./routes/v1/api/index.js";
import * as errorController from "./controllers/web/errorController.js";
// import { auth } from "./middlewares/auth.js";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as middleware from "i18next-http-middleware";
import path from "path";
import routes from "./routes/v1/index.js";
import cron from "node-cron";
import {
  createOrUpdateSetting,
  getSettingStatus,
} from "./services/systemService.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:517",
    credentials: true,
  }),
);

app.use(express.json()).use(cookieParser());
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locales",
        "{{lng}}",
        "{{ns}}.json",
      ),
    },
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookie"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
  });
app.use(middleware.handle(i18next));

app.use(express.static("uploads/images"));
app.use("/optimize", express.static("uploads/optimize"));

app.use(routes);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // console.error("🔥 FULL ERROR:");
  // console.error(error);

  const status = error.status || 400;
  const message = error.message || "Server error";
  const errorCode = error.errorCode || "Error_Code";

  return res.status(status).json({
    message,
    errorCode,
  });
});

// cron.schedule("* * * * *", async () => {
//   console.log(`\nRunning a task every minute for testing purpose`);
//   const setting = await getSettingStatus("maintenance");
//   if (setting?.value === "true") {
//     await createOrUpdateSetting("maintenance", "false");
//     console.log("Maintenance is off");
//   }
// });
