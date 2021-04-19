import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { stats, lastStats, AffectedEntry } from "./dataCommunities";

let data = stats;

const maxAffected = stats.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const color = d3
  .scaleThreshold<number, string>()
  .domain([20, 50, 200, 100000, 300000, 500000, 700000])
  .range([
    "#FACCFF",
    "#BFBAF9",
    "#75AAE9",
    "#009ACC",
    "#0087A0",
    "#00706A",
    "#4F4350",
  ]);

const assignCommunityBackgroundColor = (communityName: string) => {
  const item = data.find((item) => item.name === communityName);

  return item ? color(item.value) : color(0);
};

const affectedRadiusScale = d3
  .scaleThreshold<number, number>()
  .domain([20, 50, 200, 100000, 300000, 500000, 700000])
  .range([5, 10, 15, 20, 30, 40, 50]);

const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
  const entry = data.find((item) => item.name === comunidad);

  return entry ? affectedRadiusScale(entry.value) : 0;
};

// Tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any)
  .style("fill", function (d: any) {
    return assignCommunityBackgroundColor(d.properties.NAME_1);
  });

svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("r", (d) => calculateRadiusBasedOnAffectedCases(d.name))
  .attr("cx", (d) => aProjection([d.long, d.lat])[0])
  .attr("cy", (d) => aProjection([d.long, d.lat])[1])
  .on("mouseover", function (e: any, datum: any) {
    const affected = data.find((item) => item.name === datum.name).value;
    const coords = { x: e.x, y: e.y };
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(`<span>${datum.name}: ${affected}</span>`)
      .style("left", `${coords.x}px`)
      .style("top", `${coords.y - 28}px`);
  })
  .on("mouseout", function (datum) {
    div.transition().duration(500).style("opacity", 0);
  });

const updateChart = (affectedData: AffectedEntry[]) => {
  data = affectedData;
  d3.selectAll("circle")
    .data(latLongCommunities)
    .transition()
    .duration(500)
    .attr("r", (d) => calculateRadiusBasedOnAffectedCases(d.name));

  d3.selectAll("path")
    .data(geojson["features"])
    .transition()
    .duration(500)
    .style("fill", function (d: any) {
      return assignCommunityBackgroundColor(d.properties.NAME_1);
    });
};

document
  .getElementById("first")
  .addEventListener("click", function handlFirstResults() {
    updateChart(stats);
  });

document
  .getElementById("last")
  .addEventListener("click", function handlLastResults() {
    updateChart(lastStats);
  });
