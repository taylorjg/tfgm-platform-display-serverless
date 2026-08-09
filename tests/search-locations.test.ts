import { describe, expect, it } from "vitest";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { handler } from "@app/handlers/search-locations.ts";

const createEvent = (searchKey?: string) =>
  ({
    queryStringParameters: searchKey ? { searchKey } : undefined,
  }) as unknown as APIGatewayProxyEventV2;

describe("searchLocations integration test", () => {
  it("should return 200 status code", async () => {
    const event = createEvent("Piccadilly");
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    expect(result.statusCode).toBe(200);
  });

  it("should return an array of locations", async () => {
    const event = createEvent("Piccadilly");
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(Array.isArray(body)).toBe(true);
  });

  it("should return locations with correct shape", async () => {
    const event = createEvent("Piccadilly");
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(body.length).toBeGreaterThan(0);

    const location = body[0];
    expect(location).toHaveProperty("atcoCode");
    expect(location).toHaveProperty("name");
    expect(location).toHaveProperty("services");
    expect(Array.isArray(location.services)).toBe(true);
  });

  it("should return services with correct shape", async () => {
    const event = createEvent("Piccadilly");
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(
      body.every((loc: { services: Record<string, unknown>[] }) =>
        loc.services.every((service) => "id" in service && "name" in service)
      )
    ).toBe(true);
  });

  it("should return empty array for non-matching search", async () => {
    const event = createEvent("ZZZZNONEXISTENT");
    const result = (await handler(event)) as APIGatewayProxyStructuredResultV2;

    const body = JSON.parse(result.body as string);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });
});
