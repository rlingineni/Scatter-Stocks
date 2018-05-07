let SELECTED_ARTICLES = {};
let displayedArticles = [];


async function fetchAndPopulateHeadlines(selectedDate) {

    //clear existing list
    clearExistingNewsArticles();
    displayMessage("Loading Articles ... ")

    //fetch data
    let headlines = await getHeadlinesfromNYT(selectedDate);

    //clear existing list
    clearExistingNewsArticles();

    let id = 0;

    if (headlines.response.docs.length == 0) {
        displayMessage("No articles Found ... ")
        return;
    }

    for (let doc of headlines.response.docs) {

        if (id >= 5) {
            break;
        }

        //generate HTML for item
        let item = generateNewsItem(doc, id);

        //add the item to news item list
        $("#news-items-list").append(item);
        $("#news-item-" + id).bind("click", onClickNewsItem);

        //if previously selected, persist selection
        if (shouldHighlight(doc["_id"])) {
            $("#news-item-" + id).addClass("active");
        }


        id++;
        displayedArticles.push(doc);
    }
}

function displayMessage(message) {

    $("#news-items-list").append("<p>" + message + "</p>");
}

function onClickNewsItem(event) {
    let itemID = event.currentTarget.id.split("-")[2];

    let selectedNewsItem = displayedArticles[+itemID];
    let key = selectedNewsItem["_id"];

    //check if already selected
    if (key in SELECTED_ARTICLES) {
        //deselect item
        $("#" + event.currentTarget.id).removeClass("active");
        delete SELECTED_ARTICLES[key];
    } else {
        //select item
        SELECTED_ARTICLES[key] = selectedNewsItem;
        $("#" + event.currentTarget.id).addClass("active");
    }

}

function shouldHighlight(key) {

    //check if already selected
    if (key in SELECTED_ARTICLES) {
        return true;
    }
    return false;
}

function generateNewsItem(doc, id) {

    //JQUERY magic and build html object
    var rendered = Mustache.render(NEWS_ITEM_TEMPLATE, { headline: doc.headline.main, desc: doc.snippet, id });
    return rendered;

}

function clearExistingNewsArticles() {
    displayedArticles = [];
    $("#news-items-list").empty();
}