// setup dimensions and margins
const margin = {top: 50, right: 30, bottom: 50, left: 60},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// create SVG container
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// scales and axes
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`);

const yAxis = svg.append("g");

// line generator
const line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.Close));

// path element
const path = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

let allData = []; 

// load and process data
d3.csv("QQQ_Final_Clean.csv", d => {
    const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S"); 
    return {
        Date: parseDate(d.Date),
        Close: +d.Close,
        Volume: +d.Volume,
        Month: +d.Month,
        DayOfWeek: +d.DayOfWeek
    };
}).then(data => {
    // filter out any failed parses
    allData = data.filter(d => d.Date !== null);

    if (allData.length === 0) {
        console.error("No data loaded. Check file format or date parser.");
        return;
    }

    // attach listeners
    d3.select("#month-select").on("change", update);
    d3.select("#year-select").on("change", update);
    d3.select("#reset-btn").on("click", () => {
    // force dropdowns back to 'All'
    d3.select("#month-select").property("value", "All");
    d3.select("#year-select").property("value", "All");

    // 2. Trigger the update function to refresh the chart
    update();
});

    // initial draw
    update();
});

// update Function
function update() {
    // grab current values from dropdowns
    const m = d3.select("#month-select").property("value");
    const yVal = d3.select("#year-select").property("value");

    // filter the data step-by-step
    let filteredData = allData;

    if (yVal !== "All") {
        filteredData = filteredData.filter(d => d.Date.getFullYear() === +yVal);
    }
    if (m !== "All") {
        filteredData = filteredData.filter(d => d.Month === +m);
    }

    // handle case where no data exists (e.g., a weekend month or empty year)
    if (filteredData.length === 0) {
        d3.select("#dashboard").html("No data available for this selection.");
        path.attr("d", ""); 
        svg.selectAll(".vol-bar").remove();
        svg.selectAll(".annotation").remove();
        return;
    }

    // rescale axes for price (main chart)
    x.domain(d3.extent(filteredData, d => d.Date));
    y.domain([
        d3.min(filteredData, d => d.Close) * 0.98, 
        d3.max(filteredData, d => d.Close) * 1.02
    ]);

    // rescale axis for volume (bottom of the chart)
    const yVol = d3.scaleLinear()
        .range([height, height * 0.85])
        .domain([0, d3.max(filteredData, d => d.Volume)]);

    // update the visual axes
    xAxis.transition().duration(800).call(d3.axisBottom(x));
    yAxis.transition().duration(800).call(d3.axisLeft(y));

    // update Dashboard Stats
    const startPrice = filteredData[0].Close;
    const endPrice = filteredData[filteredData.length - 1].Close;
    const diff = (endPrice - startPrice).toFixed(2);
    const percent = ((diff / startPrice) * 100).toFixed(2);

    d3.select("#dashboard").html(`
        Showing: <strong>${m === "All" ? "Full Year" : "Month " + m} (${yVal === "All" ? "All Years" : yVal})</strong> | 
        Price Change: <span style="color: ${percent >= 0 ? 'green' : 'red'}">
            $${diff} (${percent}%)
        </span>
    `);

    // redraw the price line
    path.datum(filteredData)
        .transition()
        .duration(800)
        .attr("d", line);

    // draw volume bars
    svg.selectAll(".vol-bar").remove();
    svg.selectAll(".vol-bar")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("class", "vol-bar")
        .attr("x", d => x(d.Date))
        .attr("y", d => yVol(d.Volume))
        .attr("width", Math.max(1, (width / filteredData.length) - 1))
        .attr("height", d => height - yVol(d.Volume))
        .style("fill", (d, i) => {
            if (i === 0) return "#ccc";
            return d.Close >= filteredData[i-1].Close ? "#26a69a" : "#ef5350";
        })
        .style("opacity", 0.6);

    // historical annotations
    svg.selectAll(".annotation").remove();

    const milestones = [
        { date: new Date("2021-11-22"), label: "November 2021 - Inflation Fears Begin" },
        { date: new Date("2022-06-17"), label: "June 2022 - Highest Inflation in 40 Years" },
        { date: new Date("2022-10-13"), label: "October 2022 - Bear Market Bottom" },
        { date: new Date("2022-11-03"), label: "November 2022 - ChatGPT Launch" },
        { date: new Date("2023-05-24"), label: "May 2023 - Nvidia Earnings (AI Boom)" },
        { date: new Date("2024-08-05"), label: "August 2024 - Yen Carry Trade Dip" },
        { date: new Date("2026-02-28"), label: "February 2026 - Global Supply Shock" },
        { date: new Date("2026-04-01"), label: "April 2026 - Q1 Tech Earnings" }
    ];

    // only show annotations that fit within the current X-axis zoom
    const visibleMilestones = milestones.filter(ms => 
        ms.date >= x.domain()[0] && ms.date <= x.domain()[1]
    );

    svg.selectAll(".annotation")
        .data(visibleMilestones)
        .enter()
        .append("circle")
        .attr("class", "annotation")
        .attr("cx", d => x(d.date))
        .attr("cy", d => {
            // find the closest price point to stick the dot on the line
            const match = allData.find(obs => obs.Date.getTime() === d.date.getTime());
            return y(match ? match.Close : y.domain()[1]);
        })
        .attr("r", 6)
        .style("fill", "#f39c12") // orange color
        .style("stroke", "white")
        .append("title") // standard browser tooltip on hover
        .text(d => d.label);
}