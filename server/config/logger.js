const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

module.exports = logger;
