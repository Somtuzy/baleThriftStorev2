import "express-async-errors";
import pino from "pino";
const logger = pino()

import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});
