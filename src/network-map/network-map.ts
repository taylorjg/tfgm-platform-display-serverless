import blueLine from "./blue-line.json" with { type: "json" };
import greenLine from "./green-line.json" with { type: "json" };
import navyLine from "./navy-line.json" with { type: "json" };
import pinkLine from "./pink-line.json" with { type: "json" };
import purpleLine from "./purple-line.json" with { type: "json" };
import redLine from "./red-line.json" with { type: "json" };
import yellowLine from "./yellow-line.json" with { type: "json" };

const services = [
  blueLine,
  greenLine,
  navyLine,
  pinkLine,
  purpleLine,
  redLine,
  yellowLine,
];

export const networkMap = new Map(
  services.map((service) => [service.id, service])
);
