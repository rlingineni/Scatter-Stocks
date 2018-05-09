loadtemplates();

let NEWS_ITEM_TEMPLATE = "";
let SELECTED_LABEL_TEMPLATE = "";
let STOCK_LIST = []
let STOCK_MAP = {} //Used to lookup info fast


let USER_SELECTED_COMPANIES = {} //used to keep track of labels that are selected



async function loadtemplates() {

    NEWS_ITEM_TEMPLATE = await $.get('components/news-item.html');
    SELECTED_LABEL_TEMPLATE = await $.get('components/selected-company.html')
    STOCK_LIST = await $.get('data/stock-info.json');


    Mustache.parse(NEWS_ITEM_TEMPLATE);
    Mustache.parse(SELECTED_LABEL_TEMPLATE);



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


    $("#companySearch").search({
        source: content,
        onSelect: function (result, response) {
            let company = result.title;
            if (Object.keys(SELECTED_ARTICLES).length > 0) {
                SELECTED_ARTICLES = {} //clear selected articles
            }
            SELECTED_COMPANY = company;

            //reset the date button
            $("#calendarButton").html("Today")

            console.log("Getting headlines for ", company)
            fetchAndPopulateHeadlines(company);
        }
    })

    $("#secondaryCompanySearch").search({
        source: content,
        onSelect: function (result, response) {
            let stock = STOCK_LIST[result.id];
            //add to selected labels
            var rendered = Mustache.render(SELECTED_LABEL_TEMPLATE, { id: stock.Symbol, labelName: stock.Name });
            $("#selected-companies").append(rendered);
            $("#delete-label-" + stock.Symbol).click(onSelectedLabelDelete);
            USER_SELECTED_COMPANIES[stock.Symbol] = {};
        }
    })
}

function onSelectedLabelDelete(event) {
    let stockSymbol = event.currentTarget.id.split("-")[2];
    $("#selected-label-" + stockSymbol).remove();
    delete USER_SELECTED_COMPANIES[stockSymbol];
}



