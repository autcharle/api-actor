import winston from "winston";
import "winston-daily-rotate-file";
const { combine, timestamp, printf, colorize, align, json } = winston.format;

const logFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  align(),
  printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const argString = Object.keys(args).length
      ? JSON.stringify(args, null, 2)
      : "";
    return `${timestamp} [${level}]: ${message} ${argString}`;
  })
);

export const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), json()),
    }),
    new winston.transports.File({
      filename: "logs/express.log",
      format: combine(timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/express-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: combine(timestamp(), json()),
    }),
  ],
});
