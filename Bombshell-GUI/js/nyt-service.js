async function getHeadlinesfromNYT(selectedDate) {

    let selected = new moment(selectedDate);

    let startDate = selected.format("YYYYMMDD");
    let endDate = selected.add(1, 'days').format("YYYYMMDD");
    console.log("checking days from ", startDate, endDate);
    let url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:("Business")&begin_date=' + startDate + '&end_date=' + endDate + '&api-key=da7478038493428aad87be41ba7009fc'

    var settings = {
        "async": true,
        "crossDomain": true,
        url,
        "method": "GET",
        "headers": {}
    }

    let headlines = await $.ajax(settings);

    return headlines;
}


function checkHeadlineInCache(selectedDate) {

    let dateInCache = false;
    if (!dateInCache) {
        return getHeadlinesfromNYT(selectedDate)
    }

}