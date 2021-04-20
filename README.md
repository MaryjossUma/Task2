# Task2. Advanced Task

We have to face two challenges here:

- To mark communities in colour.
- Continue to use the size of the circle as an indicator of severity.

# Steps

- Let's take _task1_ as an initial example, copy the contents of that folder and run _npm install_.

```bash
npm install
```

- There are differences between the names of the communities in the different files. We change the names in the _communities.ts_
  and _dataCommuniteies.ts_ files to be the same as in _spain.json_.

- We create a colour scale, with the same domain as the radius scale.

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

- We also added a method to assign each community a colour.

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

- We also have to add it to the update method, so that when clicking on the buttons,
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
