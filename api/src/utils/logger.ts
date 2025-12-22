import { createLogger, format, transports } from "winston"
import WinstonCloudwatch from "winston-cloudwatch"

import {
  AWS_LOGGING_ACCESS_ID,
  AWS_LOGGING_ACCESS_KEY,
  AWS_LOGGING_ENABLED,
  AWS_LOGGING_GROUP,
  AWS_LOGGING_REGION,
  AWS_LOGGING_STREAM,
  DEFAULT_LOG_LEVEL,
  RELEASE_TAG,
} from "@/config"

export const cloudwatchLogger = createLogger({
  format: format.json(),
  transports: [
    new WinstonCloudwatch({
      level: DEFAULT_LOG_LEVEL,
      jsonMessage: true,
      logGroupName: AWS_LOGGING_GROUP,
      logStreamName: `${AWS_LOGGING_STREAM}-${RELEASE_TAG}`,
      awsRegion: AWS_LOGGING_REGION,
      awsOptions: {
        credentials: {
          accessKeyId: AWS_LOGGING_ACCESS_ID,
          secretAccessKey: AWS_LOGGING_ACCESS_KEY,
        },
      },
    }),
  ],
})

export const consoleLogger = createLogger({
  level: DEFAULT_LOG_LEVEL,
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()],
})

export const logger = AWS_LOGGING_ENABLED === "true" ? cloudwatchLogger : consoleLogger

export default logger
