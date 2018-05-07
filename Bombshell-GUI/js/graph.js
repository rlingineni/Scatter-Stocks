let LOCAL_TABLE = []
let LOCAL_LISTOFTICKS = [];

async function generateGraph() {

    //check if news Articles have been selected
    if (Object.keys(SELECTED_ARTICLES).length == 0) {
        alert("No Articles have been selected to generate a graph");
        $("#generate-button").removeClass("loading");
        $("#generate-button").prop("disabled", false);
        return;
    }


    $("#generate-button").addClass("loading");
    $("#generate-button").prop("disabled", true);
    $("#chart-area").empty();
    //do selected companies exist?

    let companiesSelected = ["AAPL", "MSFT", "WMT"]

    let listOfBubbles = [];


    //TO-DO: perform in parallel


    //foreach company selected
    for (let symbol of companiesSelected) {
        let stockData = await getStocksForSymbol(symbol);


        //for every article day lookup dates
        for (let id in SELECTED_ARTICLES) {
            let bubbleInfo = Object.assign({}, STOCK_MAP[symbol]);
            let publishDate = SELECTED_ARTICLES[id].pub_date;
            bubbleInfo.note = SELECTED_ARTICLES[id].headline;

            let intradayChange = determineIntradayForStock(stockData, publishDate);

            bubbleInfo.dayChange = determineIntradayForStock(stockData, publishDate);
            bubbleInfo.eventDay = new moment(publishDate).format("YYYY-MM-DD");
            bubbleInfo.marketCapImpact = calculateImpactOnMarketCap(symbol, bubbleInfo.dayChange);
            console.log(bubbleInfo);
            listOfBubbles.push(bubbleInfo);
        }
    }

    LOCAL_TABLE = generateBubbleTable(listOfBubbles);
    LOCAL_LISTOFTICKS = generateYearlyQuarters(listOfBubbles);
    let tickNames = generateYearlyQuarterStrings(listOfBubbles);
    let scatterPlotData = generateScatterPlotData(listOfBubbles);



    $("#generate-button").removeClass("loading");
    $("#generate-button").prop("disabled", false);

    drawScatterplot(scatterPlotData, LOCAL_LISTOFTICKS, tickNames);
    //drawChart();
}



function generateScatterPlotData(listOfBubbles) {

    let data = []
    for (let bubble of listOfBubbles) {
        let bubbleValue = {
            date: new moment(bubble.eventDay, "YYYY-MM-DD").format("MM/DD/YY"),
            company: bubble.Name,
            industry: bubble.Sector,
            priceChangePercent: bubble.dayChange,
            marketCapDecrease: bubble.marketCapImpact,
            note: bubble.note
        };
        data.push(bubbleValue);
    }

    return data;

}




function generateBubbleTable(listOfBubbles) {

    let row = [];
    let table = [['ID', 'X', 'Intraday Change', 'Industry', 'Volume']]
    let id = 1;
    for (let bubble of listOfBubbles) {
        row = [];
        row.push(bubble.Symbol + "-" + id++);
        row.push(new moment(bubble.eventDay, "YYYY-MM-DD").toDate());
        row.push(bubble.dayChange)
        row.push(bubble.Sector)
        row.push(bubble.marketCapImpact)
        table.push(row);
    }

    return table;

}

function generateYearlyQuarterStrings(listOfBubbles) {
    let listOfDates = {};
    let listOfTicksNames = []
    console.log(listOfBubbles);
    for (let bubble of listOfBubbles) {
        listOfDates[new moment(bubble.eventDay, "YYYY-MM-DD").year()] = {};
    }


    for (let year in listOfDates) {

        if (Object.keys(listOfDates).length < 2) {
            listOfTicksNames.push("Apr. " + year);
            listOfTicksNames.push("Oct. " + year);

        }

        listOfTicksNames.push("Jan. " + year);
        listOfTicksNames.push("Jun. " + year);
    }

    return listOfTicksNames;


}

function generateYearlyQuarters(listOfBubbles) {

    let listOfDates = {};
    let listOfTicks = []
    console.log(listOfBubbles);
    for (let bubble of listOfBubbles) {
        listOfDates[new moment(bubble.eventDay, "YYYY-MM-DD").year()] = {};
    }


    for (let year in listOfDates) {

        if (Object.keys(listOfDates).length < 2) {
            //listOfTicks.push({ v: new Date(year, 3), f: new moment(new Date(year, 3)) });
            //listOfTicks.push({ v: new Date(year, 11), f: new moment(new Date(year, 11)) });
            listOfTicks.push(new Date(year, 4));
            listOfTicks.push(new Date(year, 11));

        }

        listOfTicks.push(new Date(year, 0));
        listOfTicks.push(new Date(year, 7));

        //listOfTicks.push({ v: new Date(year, 0), f: new moment(new Date(year, 0)) });
        //listOfTicks.push({ v: new Date(year, 7), f: new moment(new Date(year, 7)) });
    }
    console.log(listOfTicks);
    return listOfTicks;

}

function drawChart() {

    let data = google.visualization.arrayToDataTable(LOCAL_TABLE);

    var options = {
        animation: {
            duration: 1200,
            easing: "out"
        },
        vAxis: {
            title: "Stock Intraday % change after News",
            minValue: -1,
            textStyle: {
                color: 'black', fontName: 'Helvetica', bold: true
            },

        },
        height: 500,
        bubble: {
            textStyle: {
                auraColor: "none",
                stroke: "#000000",
                color: "transparent"
            }
        },
        hAxis: {
            gridlines: {
                color: "transparent"
            },
            slantedText: true,
            ticks: LOCAL_LISTOFTICKS,
            textStyle: {
                color: 'black', fontName: 'Helvetica'
            }

        }
    };

    let chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}