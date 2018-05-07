/**
 * Initialize UI Components and Pre-Load Components
 */

$(document).ready(function () {
    $('.ui.accordion').accordion();
    $('#stockselector').dropdown({
        fullTextSearch: "exact"
    });

    //google.charts.load("current", { packages: ["corechart"] });
    d3.select(window).on('resize', debounce(function () { generateGraph() }, 100))

    $('.item')
        .popup({
            on: 'hover'
        });

    $('#example2').calendar({
        type: 'date',
        onChange: function (date, text, mode) {

            let selectedDate = new moment(date);
            let currentDate = new moment(Date.now());

            //check if date is valid
            if (selectedDate.day() == 0 || selectedDate.day() == 1 || selectedDate.day() == 6) {
                alert("Cannot pick events that occured on a Saturday, Sunday or Monday");
                return false;
            }

            if (selectedDate.format("YYYYMMDD") === currentDate.format("YYYYMMDD")) {
                alert("It's too soon to judge impact from today's news");
                return false;
            }

            fetchAndPopulateHeadlines(date);

        }
    });

    $('#example2').calendar('set date', new moment().day(-2).toDate());

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





