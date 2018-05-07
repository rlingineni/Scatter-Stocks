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
