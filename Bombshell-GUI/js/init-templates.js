loadtemplates();

let NEWS_ITEM_TEMPLATE = "";
let STOCK_LIST = []
let STOCK_MAP = {}

async function loadtemplates() {

    NEWS_ITEM_TEMPLATE = await $.get('components/news-item.html');
    STOCK_LIST = await $.get('data/stock-info.json');

    let stocksListHTML = "";


    //populate the list of companies
    for (let stock of STOCK_LIST) {
        let symbol = stock.Symbol;
        let name = stock.Name;
        let stocksOption = '<option value="' + symbol + '">' + name + " (" + symbol + ")" + '</option>';
        stocksListHTML += stocksOption;
        STOCK_MAP[symbol] = stock;
    }

    $("#stockselector").append(stocksListHTML);

    Mustache.parse(NEWS_ITEM_TEMPLATE);
}

/**
 * Set names for Stock List
 */
function reClassifyStocks(stock) {

    let industry = stock.industry.split(" ");
    let sector = stock.Sector;

    //retail
    if (industry[0].includes("Department")) {
        stock.Sector = "Retail"
    }

    //automotive
    if (industry[0].includes("Auto")) {
        stock.Sector = "Auto"
    }

    //Health
    if (sector.includes("Health")) {
        stock.Sector = "Health"
    }

    //Food
    if (industry[0].includes("Food") || industry[0].includes("Restaurants")) {
        stock.Sector = "Food"
    }

    //Real-Estate
    if (industry[0].includes("Real")) {
        stock.Sector = "Real Estate"
    }

    //Tech
    if (sector.includes("Technology")) {
        stock.Sector = "Tech"
    }

}