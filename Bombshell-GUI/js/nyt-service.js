async function getHeadlinesfromNYTbyDate(selectedDate) {

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

function cleanCompanyName(companyName) {

    let regExp = /\(([^)]+)\)/;
    let symbolString = regExp.exec(companyName)[0];
    companyName = companyName.replace(symbolString, '');
    return companyName;

}

async function getHeadlinesfromNYTbyCompany(companyName, endDate) {


    companyName = cleanCompanyName(companyName);
    let url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=da7478038493428aad87be41ba7009fc&q=' + encodeURIComponent(companyName) + '&fq=' + encodeURIComponent('news_desk:("Business")') + '&sort=newest'

    if (endDate) {
        url += "&endDate=" + endDate;
    }

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


