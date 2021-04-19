# Task1. Mandatory Task

We have to face three challenges here:

- Mark in colour the communities.
- Continue using the size of the circle as an indicator of severity.

# Steps

- We will take as starting example _task1_, let's copy the content from that folder and execute _npm install_.

```bash
npm install
```

- We have differences between the names of the communities. We rename the names in the files _communities.ts_ and
  _dataCommuniteies.ts_ to be the same as in _spain.json_.

- We create a color scale, with the same domina as radius scale.

_./src/index.ts_

```diff
+ const color = d3
+  .scaleThreshold<number, string>()
+  .domain([20, 50, 200, 100000, 300000, 500000, 700000])
+  .range([
+    "#FACCFF",
+    "#BFBAF9",
+    "#75AAE9",
+    "#009ACC",
+    "#0087A0",
+    "#00706A",
+    "#4F4350",
+  ]);
```

- Also we add a method to assign to each community a color.

_./src/index.ts_

```diff
+ const assignCommunityBackgroundColor = (communityName: string) => {
+  const item = data.find((item) => item.name === communityName);
+
+  return item ? color(item.value) : color(0);
+};
```

- Where we create the paths we add the fill attribute to add colour to each community.

_./src/index.ts_

```diff
svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any)
+  .style("fill", function (d: any) {
+    return assignCommunityBackgroundColor(d.properties.NAME_1);
+  });
```

-We also have to add it to the update method, so that when clicking on the buttons,
the colours of the communities are painted with the new data.

_./src/index.ts_

```diff
const updateChart = (affectedData: AffectedEntry[]) => {
  data = affectedData;
  d3.selectAll("circle")
    .data(latLongCommunities)
    .transition()
    .duration(500)
    .attr("r", (d) => calculateRadiusBasedOnAffectedCases(d.name));

+  d3.selectAll("path")
+    .data(geojson["features"])
+    .transition()
+    .duration(500)
+    .style("fill", function (d: any) {
+      return assignCommunityBackgroundColor(d.properties.NAME_1);
+    });
};
```
