/**
 * Initialize UI Components and Pre-Load Components
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

$(document).ready(function () {

    //google.charts.load("current", { packages: ["corechart"] });
    d3.select(window).on('resize', debounce(function () { generateGraph() }, 100))

    $("#searchevent").keyup(function (event) {
        if (event.keyCode === 13) {

            console.log("on enter")
            console.log($("#searchevent").val())
            let text = $("#searchevent").val();
            if (text) {
                console.log("Getting headlines for ", text)
                fetchAndPopulateHeadlines(text);
            }

        }
    });

    $("#calendarDisplay").html(new moment().format("MM/DD/YY"))

    $("#calendarButton").calendar({
        type: "date",
        onChange: function (date, text, mode) {
            let selectedDate = new moment(date);
            let currentDate = new moment(Date.now());

            if (selectedDate.isAfter(currentDate)) {
                alert("Whoa Nelly, you can't create an event in the future");
                return false;
            }

            $("#calendarDisplay").html(selectedDate.format("MM/DD/YY"))
        }
    });

    $("#calendarButton").calendar("set date", new Date())

    function debounce(func, wait) {
        wait = wait || 0
        var timeout
        return function () {
            var later = function () {
                timeout = null
                func(arguments)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }


});



function displayDatePicker() {
    $("#addManualArticleView").show();
}

function addManualArticle() {
    let headline = $("#articleInput").val();
    let publishDate = $("#calendarButton").calendar("get date")
    let key = new Date().getTime();
    if (!headline) {
        alert("You can't leave the headline empty!")
        return;
    }
    generateAndAddArticle(key, headline, publishDate)
    $("#addManualArticleView").hide();
}

function generateAndAddArticle(key, headline, publishDate) {
    //Mimic an Actual Article from the API
    SELECTED_ARTICLES[key] = {
        isManual: true,
        headline: {
            main: headline
        },
        pub_date: publishDate
    };
    publishDate = new moment(publishDate).format("MM/DD/YY");
    let item = Mustache.render(SELECTED_LABEL_TEMPLATE, { id: key, labelName: headline + " - " + publishDate });
    $("#selected-articles").prepend(item)
    $("#delete-label-" + key).click(onDeleteSelectedArticle)
}





