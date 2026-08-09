import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { GraphQLClient } from "graphql-request";
import {
  SearchLocations,
  transformSearchLocations,
  RawSearchLocationsResponse,
} from "@app/queries/index.ts";
import packageJson from "../../package.json" with { type: "json" };

const { TFGM_API_URL } = process.env;

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(`Version: ${packageJson.version}`);
  console.log("Searching locations from TfGM API");

  const searchKey = event.queryStringParameters?.searchKey ?? "";
  console.log(`searchKey: ${searchKey}`);

  try {
    const graphqlClient = new GraphQLClient(TFGM_API_URL!);
    const rawData = await graphqlClient.request<RawSearchLocationsResponse>(
      SearchLocations,
      {
        searchKey,
      }
    );
    const data = transformSearchLocations(rawData);

    console.log(`Successfully found ${data.length} locations`);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    const err = error as Error;
    console.error("GraphQL request failed:", {
      message: err.message,
      stack: err.stack,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to search locations" }),
    };
  }
};
