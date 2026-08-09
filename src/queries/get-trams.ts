import { gql } from "graphql-request";

export const GetTrams = gql`
  query GetTrams($atcoCode: String!) {
    locationByAtco(atcoCodes: [$atcoCode]) {
      atcoCode
      ... on MassTransportLocation {
        departures(limit: 20) {
          trip {
            ... on TramTrip {
              carriages
              destinationDisplay
            }
          }
          timings {
            status
            wait
          }
        }
      }
    }
  }
`;

interface RawDeparture {
  trip: {
    carriages: string;
    destinationDisplay: string;
  };
  timings: {
    status: string;
    wait: number;
  };
}

interface RawLocation {
  atcoCode: string;
  departures: RawDeparture[];
}

export interface RawGetTramsResponse {
  locationByAtco: RawLocation[];
}

export interface Tram {
  carriages: string;
  destinationDisplay: string;
  status: string;
  due: number;
}

export type GetTramsResponse = Tram[];

// Transform to domain response
export const transformGetTrams = (
  raw: RawGetTramsResponse,
  filter: {
    services: {
      id: string;
      name: string;
      tramStops: { atcoCode: string; name: string }[];
    }[];
    towards: "starts" | "ends";
  } | null
): GetTramsResponse => {
  const location = raw.locationByAtco?.[0];
  if (!location?.departures) return [];

  let filteredDepartures = location.departures.filter(
    (departure) => departure.trip && departure.timings
  );

  if (filter) {
    filteredDepartures = filteredDepartures.filter((departure) => {
      if (departure.trip.destinationDisplay === "Terminates Here") return true;

      return filter.services.some((service) => {
        const thisStopIndex = service.tramStops.findIndex(
          (tramStop) => tramStop.atcoCode === location.atcoCode
        );
        const destinationStopIndex = service.tramStops.findIndex(
          (tramStop) => tramStop.name === departure.trip.destinationDisplay
        );

        if (thisStopIndex < 0 || destinationStopIndex < 0) return false;

        if (filter.towards === "starts") {
          return destinationStopIndex < thisStopIndex;
        }

        if (filter.towards === "ends") {
          return destinationStopIndex > thisStopIndex;
        }

        return false;
      });
    });
  }

  return filteredDepartures.map((departure) => ({
    carriages: departure.trip.carriages,
    destinationDisplay: departure.trip.destinationDisplay,
    status: departure.timings.status,
    due: departure.timings.wait,
  }));
};
