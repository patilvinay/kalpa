const { createLogger, format, transports } = require("winston");
const signale = require("signale");

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple(),
    format.colorize({ all: true })
  ),
  transports: [new transports.Console({ level: "error" })],
  levels: {
    info: 0,
    warn: 1,
    error: 2,
    verbose: 3,
    i: 4,
    db: 5,
  },
  color: {
    info: "green",
    warn: "cyan",
    error: "red",
    verbose: "blue",
    i: "gray",
    db: "magenta",
  },
});

module.exports.logger = logger;
module.exports.signale = signale;
