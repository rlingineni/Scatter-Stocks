let SELECTED_ARTICLES = {};
let SELECTED_COMPANY = null;
let displayedArticles = [];



async function fetchAndPopulateHeadlines(selectedValue, endDate) {

    selectedValue = selectedValue || SELECTED_COMPANY; //if no value, then use previously selected

    //clear existing list
    clearExistingNewsArticles();

    //make the container smaller
    $("#news-items-list").removeClass("headline-container")

    displayMessage("Loading Articles ... ")

    //fetch data
    let headlines = await getHeadlinesfromNYTbyCompany(selectedValue, endDate);

    //clear existing list
    clearExistingNewsArticles();

    let id = 0;

    if (headlines.response.docs.length == 0) {
        displayMessage("No articles Found ... ")
        return;
    }

    for (let doc of headlines.response.docs) {

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

    //resize the container and make it scrollable
    $("#news-items-list").addClass("headline-container")
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

    let formattedTime = moment(doc.pub_date).format('dddd - MMM DD, YYYY');

    //JQUERY magic and build html object
    var rendered = Mustache.render(NEWS_ITEM_TEMPLATE, { headline: doc.headline.main, desc: doc.snippet, id, time: formattedTime });
    return rendered;

}

function clearExistingNewsArticles() {
    displayedArticles = [];
    $("#news-items-list").empty();
}