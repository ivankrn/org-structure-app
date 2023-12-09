import * as d3 from "d3";

interface Location {
  id: string;
  name: string;
  subsidiaries: Subsidiary[];
}

interface Subsidiary {
  id: string;
  name: string;
}

interface OrganizationalUnit {
  id: string;
  name: string;
  type: string;
  locations: Location[];
  subsidiaries: Subsidiary[];
  employees: Employee[];
}

interface Employee {
  id: string;
  fullName: string;
}

interface TreeNode {
  id?: string;
  name: string;
  children?: TreeNode[];
}

const idHistory: string[] = [];

function showTotalView() {
  d3.json("https://org-structure-app-vkkan.run-eu-central1.goorm.site/api/organizational-units?type=legal_entity&group-by=location")
    .then((data) => {
      const convertedData = convertUnitGroupedByLocations(data[0]);
      redrawTreeFromData(convertedData);
    });
}

function updateTreeFromUnitId(id: string | undefined) {
  d3.json(`https://org-structure-app-vkkan.run-eu-central1.goorm.site/api/organizational-units/${id}`)
    .then((data) => {
      redrawTreeFromData(convertUnit(data));
    });
}

function redrawTreeFromData(jsonData): void {
  const root = tree(d3.hierarchy(jsonData)
    .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

  svg.selectAll(".link").remove();
  svg.selectAll(".link")
    .data(root.links())
    .join("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .attr("d", d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y));

  svg.selectAll(".node").remove();
  svg.selectAll(".node")
    .data(root.descendants())
    .join("circle")
    .attr("class", "node")
    .attr("id", d => d.data.id)
    .on("click", (evt) => {
      console.log(evt);
      const unitId = evt.target.id;
      if (idHistory[idHistory.length - 1] !== unitId) {
        idHistory.push(unitId);
      }
      updateTreeFromUnitId(unitId);
    })
    .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 2.5);

  svg.selectAll(".label").remove();
  svg.selectAll(".label")
    .data(root.descendants())
    .join("text")
    .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
    .attr("dy", "0.31em")
    .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
    .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
    .attr("paint-order", "stroke")
    .attr("stroke", "white")
    .attr("fill", "currentColor")
    .attr("class", "label")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .text(d => d.data.name);
}

export function returnToPreviousId(): void {
  idHistory.pop();
  if (idHistory.length === 0) {
    showTotalView();
  } else {
    const previousId = idHistory.pop();
    updateTreeFromUnitId(previousId);
  }
}

function convertUnitGroupedByLocations(organizationalUnit: OrganizationalUnit): TreeNode {
  const tree: TreeNode = { id: organizationalUnit.id, name: getUnitNameWithType(organizationalUnit) };
  tree.children = [];
  organizationalUnit.locations.forEach(location => {
    const locationChild: TreeNode= { id: location.id, name: location.name };
    locationChild.children = [];
    location.subsidiaries.forEach(subsidiary => {
      const newSubsidiary: TreeNode | undefined = { id: subsidiary.id, name: getUnitNameWithType(subsidiary) };
      locationChild.children.push(newSubsidiary);
    });
    tree.children.push(locationChild);
  });
  return tree;
}

function convertUnit(organizationalUnit: OrganizationalUnit): TreeNode {
  const tree: TreeNode = { id: organizationalUnit.id, name: getUnitNameWithType(organizationalUnit) };
  tree.children = [];
  organizationalUnit.subsidiaries.forEach(subsidiary => {
    const newSubsidiary: TreeNode = { id: subsidiary.id, name: getUnitNameWithType(subsidiary) };
    tree.children.push(newSubsidiary);
  });
  const employees: TreeNode = { name: "Прочие сотрудники", children: [] };
  organizationalUnit.employees.forEach(employee => {
    const newEmployee: TreeNode = { id: employee.id, name: employee.fullName };
    employees.children.push(newEmployee);
  });
  tree.children.push(employees);
  return tree;
}

function getUnitNameWithType(unit: OrganizationalUnit): string {
  let type: string;
  if (unit.type === "LEGAL_ENTITY") {
    type = "Юр.лицо";
  } else if (unit.type === "DIVISION") {
    type = "Подразделение";
  } else if (unit.type === "DEPARTMENT") {
    type = "Отдел";
  } else if (unit.type === "GROUP") {
    type = "Группа";
  }
  return `${type} "${unit.name}"`;
}

let data = { "name": "Загрузка", children: [] };

// Declare the chart dimensions and margins.
const width = 1500;
const height = width;
const cx = width * 0.5; // adjust as needed to fit
const cy = height * 0.495; // adjust as needed to fit
const radius = Math.min(width, height) / 2 - 80;

// Create a radial tree layout. The layout’s first dimension (x)
// is the angle, while the second (y) is the radius.

const tree = d3.tree()
  .size([2 * Math.PI, radius])
  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

// Sort the tree and apply the layout.
const root = tree(d3.hierarchy(data)
  .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

// Create the SVG container.
const svg = d3.select('body')
  .append('svg')
  .attr("id", "graph")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-cx, -cy, width, height])
  .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

// Appends links.
svg.append("g")
  .attr("class", "link")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
  .selectAll()
  .data(root.links())
  .join("path")
  .attr("d", d3.linkRadial().angle(d => d.x).radius(d => d.y));

// Append nodes.
svg.append("g")
  .selectAll()
  .data(root.descendants())
  .join("circle")
  .attr("class", "node")
  .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
  .attr("fill", d => d.children ? "#555" : "#999")
  .attr("r", 1.5);

// Append labels.
svg.append("g")
  .attr("class", "label")
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 3)
  .selectAll()
  .data(root.descendants())
  .join("text")
  .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .attr("paint-order", "stroke")
  .attr("stroke", "white")
  .attr("fill", "currentColor")
  .text(d => d.data.name);

export default showTotalView;