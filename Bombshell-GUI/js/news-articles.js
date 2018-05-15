let SELECTED_ARTICLES = {};
let displayedArticles = []; //used as temp store to show all the displayed articles



async function fetchAndPopulateHeadlines(selectedValue, endDate) {

    //clear existing list
    clearExistingNewsArticles();

    //make the container smaller
    $("#news-items-list").removeClass("headline-container")

    displayMessage("Loading Articles ... ")

    //fetch data
    let headlines = {}

    try {
        headlines = await getHeadlinesfromNYTbyQuery(selectedValue, endDate);
    } catch (ex) {
        clearExistingNewsArticles();
        displayMessage("Err. Couldn't load articles. See Console for detailed output")
        console.error(ex);
        return;
    }

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
    let publishDate = moment(selectedNewsItem["pub_date"]).format("MM/DD/YY");
    let headline = selectedNewsItem.headline.main;

    //check if already selected
    if (key in SELECTED_ARTICLES) {
        //deselect item
        $("#" + event.currentTarget.id).removeClass("active");
        $("#selected-label-" + key).remove();
        delete SELECTED_ARTICLES[key];
    } else {
        //select item
        SELECTED_ARTICLES[key] = selectedNewsItem;
        $("#" + event.currentTarget.id).addClass("active");

        let item = Mustache.render(SELECTED_LABEL_TEMPLATE, { id: key, labelName: headline + " - " + publishDate });
        $("#selected-articles").prepend(item)
        $("#delete-label-" + key).click(onDeleteSelectedArticle)
        /**Duplicate item and add to selected list */
        $("selected").append($("#" + event.currentTarget.id).clone());
    }

}

function onDeleteSelectedArticle(event) {
    let key = event.currentTarget.id.split("-")[2];
    delete SELECTED_ARTICLES[key];
    $("#selected-label-" + key).remove();
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
    let rendered = Mustache.render(NEWS_ITEM_TEMPLATE, { headline: doc.headline.main, desc: doc.snippet, id, time: formattedTime });
    return rendered;

}

function clearExistingNewsArticles() {
    displayedArticles = [];
    $("#news-items-list").empty();
}