function drawScatterplot(data, listOfDates, tickNames) {

    var dateParse = d3.timeParse("%m/%d/%y"),
        margin = { top: 20, right: 25, bottom: 30, left: 100 },
        width = d3.select("#scatterplot").node().offsetWidth - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    document.querySelector("#scatterplot").innerHTML = "";


    var tooltip = d3.select("#tooltiparea").append('div')
        .attr("class", "tooltip tooltipWide")

    var svg = d3.select("#scatterplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var xScale = d3.scaleTime()
        .range([0, width])


    var yScale = d3.scaleLinear()
        .range([0, height])

    var radius = d3.scaleLinear()
        .range([6, 2000])

    data.forEach(function (d) {
        d.priceChangePercent = +d.priceChangePercent;
        d.marketCapDecrease = +d.marketCapDecrease;
    })

    data.sort(function (a, b) {
        return b.marketCapDecrease - a.marketCapDecrease
    })

    yScale.domain([10, -20])

    xScale.domain([d3.min(data, function (d) { return dateParse(d.date) }),
    dateParse("1/01/19")])

    radius.domain(d3.extent(data, function (d) { return d.marketCapDecrease }))

    svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(d3.axisBottom(xScale)
            .tickSizeOuter(0)
            .tickValues(listOfDates)
            .tickFormat(function (d, i) {
                return tickNames[i];
            }))




    svg.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(" + (margin.left + width) + "," + margin.top + ")")
        .call(d3.axisRight(yScale)
            .ticks(6))


    var labelFontSize = 14

    var ticks = svg.selectAll('.y-axis .tick')
        .attr('data-top-tick', 'false')

    var bottomTick = ticks._groups[0][ticks.size() - 1];

    var topTick = ticks._groups[0][0];
    topTick.setAttribute('data-top-tick', 'true');

    var topTickText = d3.select(topTick).select('text').node()

    var topTickWidth = topTickText.getBoundingClientRect().width;

    var bottomTickWidth = bottomTick.getBoundingClientRect().width;

    var tickX = d3.select(topTick).select('text').attr("x")

    var tickX1 = tickX;
    var tickX2 = topTickWidth;

    ticks.select('line')
        .attr('x1', (-width + -margin.left))
        .attr('x2', (0 + (topTickWidth)))
        .attr('class', function (d) { return "line_" + d })

    ticks.select('text')
        .attr('dy', -7)
        .attr('text-anchor', 'end')

    var xTicks = svg.selectAll('.x-axis .tick')

    xTicks.select('text')
        .attr('dy', 14)

    xTicks.select('line')
        .attr('y2', 7)

    svg.select('.tick[data-top-tick="true"]').append('text')
        .classed('unit-suffix', true)
        .attr('text-anchor', 'start')
        .attr('x', (tickX))
        .attr('dy', '0.25em')
        .attr('transform', 'translate(0, -' + (parseInt(labelFontSize) / 2 + 3) + ')')
        .attr('fill', 'black')
        .text('%');

    var dotGroup = svg.selectAll("g.dot")
        .data(data)
        .enter().append("g")
        .attr("class", "dot")
        .attr("transform", function (d) {
            return "translate(" + (margin.left + xScale(dateParse(d.date))) + "," + (margin.top + yScale(d.priceChangePercent)) + ")"
        })

    dotGroup.append("circle")
        .attr("r", function (d) {
            if (width > 500) {

                return Math.sqrt(Math.abs(radius(d.marketCapDecrease)))
            }
            else { return Math.sqrt(Math.abs(radius(d.marketCapDecrease) / 2)) }
        })
        .attr("class", function (d) { return d["industry"] })
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseout', hideTooltip)



    var tooltipOffset = { x: 5, y: -25 }
    var tooltipLeft = { x: 45, y: -25 }
    var tooltipRight = { x: -45, y: -25 }

    var tooltipDateFormat = d3.timeFormat("%b. %-d")

    function properAbvMonth(d) {

        var correct = {
            'Mar': 'March',
            'Apr': 'April',
            'May': 'May',
            'Jun': 'June',
            'Jul': 'July',
        }

        return d.replace(/(Mar|Apr|May|Jun|Jul)+([\.]){0,1}/g, function ($1, $2, $3) {
            return correct[$2]
        })
    }

    function showTooltip(d) {
        moveTooltip()
        d3.select(this)
            .style('stroke-width', '2px')
            .style('stroke', '#000')
            .style('stroke-opacity', 1)
        tooltip.style('display', 'block')
            .html("<span>" + d.company + "</span> <br/>" + d.priceChangePercent + "% intraday share price change on " + properAbvMonth(tooltipDateFormat(dateParse(d.date))) + " after " + d.note)
    }

    // Move the tooltip to track the mouse
    function moveTooltip() {
        tooltip.style('top', (d3.event.pageY + tooltipOffset.y) + 'px')
            .style('left', (d3.event.pageX + ((d3.event.pageX < 70) ? tooltipLeft.x : ((d3.event.pageX > (width - 70)) ? tooltipRight.x : tooltipOffset.x))) + 'px')
    }

    // Create a tooltip, hidden at the start
    function hideTooltip() {
        tooltip.style('display', 'none')
        d3.select(this)
            .style('stroke', self.strokeColor)
            .style('stroke-width', 1)
            .style('stroke-opacity', .2)
    }

}