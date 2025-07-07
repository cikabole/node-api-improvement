import express from "express";
import { errorHandler } from "./error-handler.middleware";
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { MembershipModule } from "./modern/src/membership.module";

// because of the javascript module, we need to use require to import the legacy routes
const legacyMembershipRoutes = require("./legacy/routes/membership.routes");

async function bootstrap() {
  const app = express();
  const port = 3099;

  app.use(express.json());
  app.use("/legacy/memberships", legacyMembershipRoutes);

  const nestApp = await NestFactory.create(
    MembershipModule,
    new ExpressAdapter(app)
  );
  await nestApp.init();

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

try {
  bootstrap();
} catch (e) {
  console.log(e);
}
