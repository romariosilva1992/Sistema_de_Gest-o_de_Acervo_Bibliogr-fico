import { Registry, collectDefaultMetrics, Counter, Histogram } from "prom-client";
import type { Request, Response, NextFunction } from "express";

export const registry = new Registry();
collectDefaultMetrics({ register: registry });

const requestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP.",
  labelNames: ["method", "route", "status_code"],
  registers: [registry],
});

const requestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos.",
  labelNames: ["method", "route", "status_code"],
  registers: [registry],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export function metricsMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const end = requestDuration.startTimer();
  response.on("finish", () => {
    const labels = {
      method: request.method,
      route: request.route?.path?.toString() ?? request.path,
      status_code: response.statusCode.toString(),
    };
    requestsTotal.inc(labels);
    end(labels);
  });
  next();
}
