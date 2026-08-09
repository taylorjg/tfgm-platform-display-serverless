import { describe, expect, it } from "vitest";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { handler } from "@app/handlers/get-trams.ts";

const PICCADILLY_GARDENS_ATCO = "9400ZZMAPGD";

const createEvent = (atcoCode: string) =>
  ({
    queryStringParameters: { atcoCode },
  }) as unknown as APIGatewayProxyEventV2;

describe("getTrams integration test", () => {
  it("should return 200 status code", async () => {
    const event = createEvent(PICCADILLY_GARDENS_ATCO);
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    expect(result.statusCode).toBe(200);
  });

  it("should return an array of trams", async () => {
    const event = createEvent(PICCADILLY_GARDENS_ATCO);
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(Array.isArray(body)).toBe(true);
  });

  it("should return trams with correct shape", async () => {
    const event = createEvent(PICCADILLY_GARDENS_ATCO);
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(
      body.every(
        (tram: Record<string, unknown>) =>
          "carriages" in tram &&
          "destinationDisplay" in tram &&
          "status" in tram &&
          "due" in tram
      )
    ).toBe(true);
  });

  it("should return trams with correct types", async () => {
    const event = createEvent(PICCADILLY_GARDENS_ATCO);
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(
      body.every(
        (tram: {
          carriages: unknown;
          destinationDisplay: unknown;
          status: unknown;
          due: unknown;
        }) =>
          typeof tram.carriages === "string" &&
          typeof tram.destinationDisplay === "string" &&
          typeof tram.status === "string" &&
          typeof tram.due === "number"
      )
    ).toBe(true);
  });

  it("should return an error for invalid atcoCode", async () => {
    const event = createEvent("INVALID_ATCO_CODE");
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('{"error":"Failed to fetch trams"}');
  });
});
