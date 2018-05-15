loadtemplates();

let NEWS_ITEM_TEMPLATE = "";
let SELECTED_LABEL_TEMPLATE = "";
let STOCK_LIST = []
let STOCK_MAP = {} //Used to lookup info fast
let TEMPLATES_READY = false; //Observe Value to get templates status

let USER_SELECTED_COMPANIES = {} //used to keep track of labels that are selected



async function loadtemplates() {

    NEWS_ITEM_TEMPLATE = await $.get('components/news-item.html');
    SELECTED_LABEL_TEMPLATE = await $.get('components/selected-label.html')
    STOCK_LIST = await $.get('data/stock-info.json');


    Mustache.parse(NEWS_ITEM_TEMPLATE);
    Mustache.parse(SELECTED_LABEL_TEMPLATE);

    TEMPLATES_READY = true;

    let content = [];
    let id = 0;
    //populate the list of companies
    for (let stock of STOCK_LIST) {
        let symbol = stock.Symbol;
        let name = stock.Name;
        let combinedName = stock.Name + " (" + stock.Symbol + ")"
        content.push({ title: combinedName, id })
        STOCK_MAP[symbol] = stock;
        id++;
    }

    parseURLAndGenerateValues();

    $("#secondaryCompanySearch").search({
        source: content,
        onSelect: function (result, response) {
            let stock = STOCK_LIST[result.id];
            //add to selected labels
            generateAndAddStockLabel(stock.Symbol);
        }
    })

}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}


function parseURLAndGenerateValues() {
    //Read the URL and generate a graph
    let eventsKey = getQueryVariable("events")

    if (eventsKey) {
        let symbols = getQueryVariable("symbols");
        parseAndAddHeadlinesFromURL(eventsKey);
        parseAndAddStocksFromURL(symbols);
        generateGraph();
    }
}

function parseAndAddHeadlinesFromURL(eventsKey) {
    let eventHeadlines = Base64.decode(eventsKey)
    let newsArticles = eventHeadlines.split("@!@")

    for (let numArticle = 0; numArticle < newsArticles.length - 1; numArticle++) {
        let article = newsArticles[numArticle];
        let key = new Date().getTime();
        let articleComponents = article.split("-");
        let publishDate = new moment(articleComponents[articleComponents.length - 1], "MM/DD/YYYY").toDate(); // the last element is the date

        //sum up everything that is not the last component
        let headline = "";
        for (var i = 0; i < articleComponents.length - 1; i++) {
            headline += articleComponents[i]
        }

        console.log("Read headline: ", headline);
        generateAndAddArticle(key, headline, publishDate)
    }

}

function parseAndAddStocksFromURL(symbols) {

    let stocks = symbols.split(",");
    for (let symbol of stocks) {
        generateAndAddStockLabel(symbol);
    }
}

function generateAndAddStockLabel(stockSymbol) {
    let stock = STOCK_MAP[stockSymbol];
    let rendered = Mustache.render(SELECTED_LABEL_TEMPLATE, { id: stock.Symbol, labelName: stock.Name });
    $("#selected-companies").append(rendered);
    $("#delete-label-" + stock.Symbol).click(onDeleteSelectedStock);
    USER_SELECTED_COMPANIES[stock.Symbol] = {};

}

function onDeleteSelectedStock(event) {
    let stockSymbol = event.currentTarget.id.split("-")[2];
    $("#selected-label-" + stockSymbol).remove();
    delete USER_SELECTED_COMPANIES[stockSymbol];
}



