/**
 * Initialize UI Components and Pre-Load Components
 */

$(document).ready(function () {
    $('.ui.accordion').accordion();
    $('#stockselector').dropdown({
        fullTextSearch: "exact"
    });


    $('#companySearch')
        .search({
            onSelect: function (result, response) {
                console.log("CHANGED:", result, response)
            },
            onSearchQuery: function (q) {
                console.log(q)
            }
        });


    //google.charts.load("current", { packages: ["corechart"] });
    d3.select(window).on('resize', debounce(function () { generateGraph() }, 100))

    $('.item')
        .popup({
            on: 'hover'
        });



    //DATE SELECTOR CODE
    $('#example9').calendar({
        type: 'date',
        onChange: function (date, text, mode) {

            if (!SELECTED_COMPANY) {
                console.log("No company selected")
                return false;
            }

            let selectedDate = new moment(date);
            $("#calendarButton").html(selectedDate.format("MM/DD/YY"))
            let currentDate = new moment(Date.now());

            //check if date is valid
            if (selectedDate.day() == 0 || selectedDate.day() == 1 || selectedDate.day() == 6) {
                alert("Cannot pick events that occured on a Saturday, Sunday or Monday");
                return false;
            }

            if (selectedDate.isAfter(currentDate)) {
                alert("Can't get the news for day's after today");
                return false;
            }

            if (selectedDate.format("YYYYMMDD") === currentDate.format("YYYYMMDD")) {
                $("#calendarButton").html("Today")
            }
            console.log("Getting headlines date around ", selectedDate.format("MM-DD-YYYY"));
            fetchAndPopulateHeadlines(null, selectedDate.format("YYYYMMDD"));

        }
    });

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

    function triggerAutoComplete(val) {
        console.log("GOT VAL", val)
    }


});





