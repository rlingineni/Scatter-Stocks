
function determineIntradayForStock(stockData, date) {
    let stockTimeSeries = stockData["Time Series (Daily)"];
    let symbol = stockData['Meta Data']['2. Symbol'];
    let stockTimeStamps = Object.keys(stockTimeSeries);

    let dates = generateDaysToCheck(date, stockTimeStamps, 0);

    if (dates == null) {
        return null;
    }

    stockTimeSeries[dates[0]] = stockTimeSeries[dates[0]] || {};
    stockTimeSeries[dates[1]] = stockTimeSeries[dates[1]] || {};
    stockTimeSeries[dates[2]] = stockTimeSeries[dates[2]] || {};


    let dayBeforeClose = +stockTimeSeries[dates[0]]["4. close"];
    let dayOfOpen = +stockTimeSeries[dates[1]]["1. open"];
    let dayOfClose = +stockTimeSeries[dates[1]]["4. close"];
    let dayAfterOpen = +stockTimeSeries[dates[2]]["1. open"];
    let intradayChange = getDayChanges(dayBeforeClose, dayOfOpen, dayOfClose, dayAfterOpen)
    return intradayChange;
}


/**
 * Fetch all of the stock data for a particular symbol
 * @param {string} symbol 
 */
async function getStocksForSymbol(symbol) {
    let url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + symbol + "&outputsize=full&apikey=EKKG90HQKAUWW0ID"

    var settings = {
        "async": true,
        "crossDomain": true,
        url,
        "method": "GET",
        "headers": {}
    }

    let stockData = await $.ajax(settings);

    return stockData

}

function parseMarketCap(marketCapString) {

    let multiplierString = marketCapString[marketCapString.length - 1];
    let baseValue = parseFloat(marketCapString.match(new RegExp("([0-9]+\.[0-9]+)"))[0]);
    let multiplier = 0;
    if (multiplierString === 'M') {
        multiplier = 1000000000;
    }
    if (multiplierString === "B") {
        multiplier = 1000000000000;
    }

    if (baseValue) {
        return multiplier * baseValue;
    }

    return null;
}

function calculateImpactOnMarketCap(symbol, intradayChange) {

    //min impact is 100 million

    let stock = STOCK_MAP[symbol];
    let stockMarketCapValue = parseMarketCap(stock.MarketCap);
    let marketImpact = 100000000;
    if (stockMarketCapValue) {
        marketImpact = stockMarketCapValue * Math.abs(intradayChange);
    }

    return marketImpact;

}

function getDayChanges(dayBeforeClose, dayOfOpen, dayOfClose, dayAfterOpen) {

    let dayBeforeChange = (dayOfOpen - dayBeforeClose) / dayOfOpen;
    let dayOfChange = (dayOfClose - dayOfOpen) / dayOfOpen;
    let dayAfterChange = (dayAfterOpen - dayOfClose) / dayOfClose;

    let changes = [dayBeforeChange, dayOfChange, dayAfterChange];
    let maxIntradayChangeInvert = null;
    let maxIntradayChange = null;
    for (let change of changes) {
        if (!isNaN(change)) {
            if (Math.abs(change) > maxIntradayChangeInvert || maxIntradayChange == null) {
                maxIntradayChangeInvert = Math.abs(change);
                maxIntradayChange = change;
            }
        }
    }

    maxIntradayChange *= 100; //multiply by hundred to normalize percent

    return (Math.round(maxIntradayChange * 100) / 100);
}

function generateDaysToCheck(startDate, stockTimeStamps, numDaysApart) {
    //if can't find valid range after 10 days, return null
    if (numDaysApart > 10) {
        return null;
    }

    let currentDay = new moment(startDate);
    let currentDayString = currentDay.format("YYYY-MM-DD");

    let indexOfDay = stockTimeStamps.indexOf(currentDayString);
    if (indexOfDay != -1) {
        let dayOf = stockTimeStamps[indexOfDay]
        let dayBefore = stockTimeStamps[indexOfDay + 1]
        let dayAfter = stockTimeStamps[indexOfDay - 1]
        let daysToCheck = [dayBefore, dayOf, dayAfter]
        return daysToCheck;
    }
    //find the closest next timestamp to the selected article
    let nextDay = currentDay.clone().add(1, 'days');
    return generateDaysToCheck(nextDay, stockTimeStamps, numDaysApart + 1);


}



