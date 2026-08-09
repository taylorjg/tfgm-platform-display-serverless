import { gql } from "graphql-request";

export const SearchLocations = gql`
  query SearchLocations($searchKey: String = "") {
    searchLocations(
      params: { modes: [TRAM], limit: 200, searchKey: $searchKey }
    ) {
      atcoCode
      name
      ... on MassTransportLocation {
        lines {
          ... on TramLine {
            services {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface RawService {
  id: string;
  name: string;
}

interface RawLine {
  services: RawService[];
}

interface RawSearchLocation {
  atcoCode: string;
  name: string;
  lines: RawLine[];
}

export interface RawSearchLocationsResponse {
  searchLocations: RawSearchLocation[];
}

export interface Service {
  id: string;
  name: string;
}

export interface SearchLocation {
  atcoCode: string;
  name: string;
  services: Service[];
}

export type SearchLocationsResponse = SearchLocation[];

// Transform to domain response
export const transformSearchLocations = (
  raw: RawSearchLocationsResponse
): SearchLocationsResponse => {
  if (!raw.searchLocations) return [];

  return raw.searchLocations.map((location) => ({
    atcoCode: location.atcoCode,
    name: location.name,
    services: location.lines.flatMap((line) => line.services),
  }));
};
