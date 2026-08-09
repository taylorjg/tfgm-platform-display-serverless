// Manually scrape the list of tram stops for each line from:
// https://tfgm.com/ways-to-travel/tram/network-map
// Put each list of tram stops into a separate file e.g. green-line.txt, blue-line.txt, etc.
// Then, run this tool to convert the .txt files to .json files:
// $ cd src/network-map
// $ npx tsx make-network-map-files.ts

import { promises as fs } from "node:fs";

const processLine = async (
  locations: { atcoCode: string; name: string }[],
  id: string,
  name: string
) => {
  console.log(`Processing ${id}, ${name}`);
  const [colour, line] = id
    .split("_")
    .map((s) => s.toLowerCase())
    .map((s) => s.trim());
  const filenameBase = `${colour}-${line}`;
  const inputFilename = `${filenameBase}.txt`;
  const outputFilename = `${filenameBase}.json`;
  const inputFileContents = await fs.readFile(inputFilename, "utf-8");
  const tramStops = inputFileContents.split(/\n/).filter(Boolean);
  const object = {
    id,
    name,
    tramStops: tramStops.map((tramStop) => {
      const location = locations.find((l) => l.name.startsWith(tramStop));
      return {
        atcoCode: location?.atcoCode ?? null,
        name: tramStop,
      };
    }),
  };
  await fs.writeFile(outputFilename, JSON.stringify(object, null, 2));
};

const main = async () => {
  const searchLocationsResponse = await fetch(
    "https://8qyltr090f.execute-api.us-east-1.amazonaws.com/search-locations"
  );
  const locations = (await searchLocationsResponse.json()) as {
    atcoCode: string;
    name: string;
  }[];
  await processLine(locations, "Green_Line", "Altrincham - Bury");
  await processLine(
    locations,
    "Pink_Line",
    "East Didsbury - Rochdale Town Centre"
  );
  await processLine(
    locations,
    "Purple_Line",
    "Altrincham - Piccadilly/Etihad Campus"
  );
  await processLine(locations, "Yellow_Line", "Bury - Piccadilly");
  await processLine(locations, "Blue_Line", "Ashton-Under-Lyne - Eccles");
  await processLine(
    locations,
    "Red_Line",
    "The Trafford Centre - Deansgate-Castlefield"
  );
  await processLine(locations, "Navy_Line", "Manchester Airport - Victoria");
};

main();
