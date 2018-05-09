/**
 * Initialize UI Components and Pre-Load Components
 */

$(document).ready(function () {
    $('.ui.accordion').accordion();

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





