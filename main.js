

main();



function main() {

    var read = require('read-data').json;
    var writeData = require('write');
    let STOCKS_LIST = read.sync("./Bombshell-GUI/data/stock-info.json");

    for (let stock of STOCKS_LIST) {
        reClassifyStocks(stock);
    }

    writeData.sync("./Bombshell-GUI/data/stock-info.json", JSON.stringify(STOCKS_LIST));

}

function reClassifyStocks(stock) {

    let industry = stock.industry.split(" ");
    let sector = stock.Sector;

    //retail
    if (industry[0].includes("Department")) {
        stock.Sector = "Retail"
        return;
    }

    //automotive
    if (industry[0].includes("Auto")) {
        stock.Sector = "Auto"
        return;
    }

    //Health
    if (sector.includes("Health")) {
        stock.Sector = "Health"
        return;
    }

    //Food
    if (industry[0].includes("Food") || industry[0].includes("Restaurants")) {
        stock.Sector = "Food"
        return;
    }

    //Real-Estate
    if (industry[0].includes("Real")) {
        stock.Sector = "Real Estate"
        return;
    }

    //Tech
    if (sector.includes("Technology")) {
        stock.Sector = "Tech"
        return;
    }

    stock.Sector = "Misc."
}