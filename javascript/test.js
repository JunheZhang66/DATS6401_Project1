google.charts.load('current', {
    packages: ['corechart', 'line', 'bar', 'geochart'],
    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});

// Geo Map
google.charts.setOnLoadCallback(drawRegionsMap);
var curGeoYear = '2011'
var curGeoType = 'GDP'

function drawRegionsMap() {
    sheetName = curGeoYear
        // Build Query by user selection
    query = 'SELECT A '
    if (curGeoType == 'GDP') {
        query += ',B'
    } else if (curGeoType == 'Military') {
        query += ',C'
    } else if (curGeoType == 'Health') {
        query += ',D'
    } else if (curGeoType == 'Education') {
        query += ',E'
    }
    drawGeoChart(sheetName, query, geoChartHandler)
}
// Geo Map Handler
function geoChartHandler(response) {
    var data = response.getDataTable();

    var options = {
        height: 500,
        width: 800,
        colorAxis: { minValue: 0, colors: ['#cab7ab', '#068a9c'] }
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
}
// Geo Map query data
function drawGeoChart(sheetName, query, responseHandler) {
    var queryString = encodeURIComponent(query);
    var query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1pnlrBD7zk0FPq3-ohs1SATcPJB0O4yw2GPiCpKeKiJE/gviz/tq?sheet=' +
        sheetName + '&headers=1&tq=' + queryString);
    query.send(responseHandler);
}
// handle compare by categories Miliatary, Health and Education

function handelGeoChartType(response) {
    curGeoType = response.value
    drawRegionsMap();
}
// compare bar chart button to control year
$('#section-Geo .dropdown-item').click(function() {
    year = $(this).attr('value')
    buttonText = 'Year-' + year
    $('#section-Geo .btn.btn-info.dropdown-toggle').text(buttonText)
    curGeoYear = year
    drawRegionsMap();
});
// draw bar charts
google.charts.setOnLoadCallback(drawBarChartsByCountry);

function drawBarChartsByCountry(country = [], stat = false) {
    if (!stat) { stat = 'Per' } else { stat = 'Stat' }
    var query = 'SELECT A,B,C,D,E,F'
    if (country.length > 0) {
        query += ' WHERE';
        for (let i = 0; i < country.length; i++) {
            query += ' A=' + '"' + country[i] + '"';
            if (i + 1 < country.length) {
                query += ' OR'
            }
        }
    }
    drawBarChart('Military-' + stat, query, barChartMilitaryResponseHandler);
    drawBarChart('Health-' + stat, query, barChartHealthResponseHandler);
    drawBarChart('Education-' + stat, query, barChartEducationResponseHandler);
}
// Bar Chart query data
function drawBarChart(sheetName, query, responseHandler) {
    var queryString = encodeURIComponent(query);
    var query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1ySGQItcaygIkpFGaCAB-K4mdaopyRgDRkqb5F6jgCd4/gviz/tq?sheet=' +
        sheetName + '&headers=1&tq=' + queryString);
    // setTimeout(query.send(responseHandler), 1000)
    query.send(responseHandler);
}
// bar chart Miliary Handler
function barChartMilitaryResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({
        column: 5,
        desc: true
    });

    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        vAxis: {
            title: 'Spending in Billion ($)'
        },
        hAxis: {
            title: 'Country'
        }
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('bar-chart1'));
    chart.draw(data, options);
}
// bar chart Health Handler
function barChartHealthResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({
        column: 5,
        desc: true
    });

    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        vAxis: {
            title: 'Spending in Billion ($)'
        },
        hAxis: {
            title: 'Country'
        }
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('bar-chart2'));
    chart.draw(data, options);
}
// bar chart Education Handler
function barChartEducationResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({
        column: 5,
        desc: true
    });

    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        vAxis: {
            title: 'Spending in Billion ($)'
        },
        hAxis: {
            title: 'Country'
        }
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('bar-chart3'));
    chart.draw(data, options);
}
// bar chart button to control country
curCountries = {
        'USA': true,
        'China': true,
        'India': true,
        'Germany': true,
        'UK': true,
        'Japan': true,
        'France': true,
        'Saudi Arabia': true,
        'Russia': true,
        'South Korea': true,
        'Brazil': true,
        'Australia': true
    }
    // bar chart handle check box by country
function handleCheckBox(response) {
    curCountries[response.value] = !curCountries[response.value]
    var countries = []
    for (const country in curCountries) {
        if (curCountries[country]) {
            countries.push(country)
        }
    }
    drawBarChartsByCountry(countries, true);
}
// bar chart handle switch between static and percentage
function switchBarChartHandler(response) {
    var countries = []
    for (const country in curCountries) {
        curCountries[country] = true
        countries.push(country)
    }
    let static = true
    if (response.value != 1) {
        static = false
    }
    drawBarChartsByCountry(countries, static);
}
// bar chart reset all country
function handleResetCheckBox(response) {
    var countries = []
    for (const country in curCountries) {
        curCountries[country] = true
        countries.push(country)
    }
    $('.custom-control-input').prop('checked', true)
    drawBarChartsByCountry(countries, true);
}

// Draw compare bar chart by year
google.charts.setOnLoadCallback(drawCompareBarChartByYear);
var curYear = 2011 // initial year
var curSortBy = 1
var curStatic = false
    // Bar Chart by year from 2011 to 2015
function drawCompareBarChartByYear(year = curYear, stat = curStatic) {
    sheetNameGDP = year + '-compare';
    sheetNameShared = year + '-shared-compare';
    if (stat) {
        sheetNameGDP += '-stat';
        sheetNameShared += '-stat';
    } else {
        sheetNameGDP += '-per';
        sheetNameShared += '-per';
    }
    // sheetName = '2011-compare'
    query = 'SELECT A, C,D,E';
    drawBarChart(sheetNameGDP, query, barChartCompareResponseHandler);
    drawBarChart(sheetNameShared, query, barChartSharedCompareResponseHandler);
}
// bar chart handler for % gdp
function barChartCompareResponseHandler(response, sortBy = parseInt(curSortBy)) {
    var data = response.getDataTable();
    console.log('SortBy = ' + sortBy)
    data.sort({
        column: sortBy,
        desc: true
    });
    console.log(data)
    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        hAxis: {
            title: 'Country',
            minValue: 0
        },
        vAxis: {
            title: 'Spending Billion ($)'
        }
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('bar-chart-compare'));
    chart.draw(data, options);
}
// bar chart handler for shared gdp
function barChartSharedCompareResponseHandler(response, sortBy = parseInt(curSortBy)) {
    var data = response.getDataTable();
    console.log('SortBy = ' + sortBy)
    data.sort({
        column: sortBy,
        desc: true
    });
    console.log(data)
    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        hAxis: {
            title: 'Country',
            minValue: 0
        },
        vAxis: {
            title: 'Spending Billion ($)'
        }
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('bar-chart-shared-compare'));
    chart.draw(data, options);
}
// handle compare by categories Miliatary, Health and Education

function sortCompareBarChartHandler(response) {
    curSortBy = response.value
    console.log('curSortBy' + curSortBy)
    drawCompareBarChartByYear(curYear);
}
// compare bar chart button to control year
$('#section2 .dropdown-item').click(function() {
    year = $(this).attr('value')
    buttonText = 'Year-' + year
    $('#section2 .btn.btn-info.dropdown-toggle').text(buttonText)
    curYear = year
    console.log(curYear);
    drawCompareBarChartByYear(curYear);
});
// switch between static and percentage
function switchCompareBarChartHandler(response) {
    if (response.value == 0) {
        curStatic = false
    } else {
        curStatic = true
    }
    // console.log('curStatic' + curStatic)
    drawCompareBarChartByYear(curYear);
}

// draw bar chart growing rate 
google.charts.setOnLoadCallback(drawBarChartsByGrowingRate);
var growCount = 1
var curHeal = true
var hTitle = 'Health'
    // bar chart growing rate
function drawBarChartsByGrowingRate(heal = curHeal) {
    growCount = 1
    sheetName = 'HealEdu-grow-per-stat'
    if (heal) {
        hTitle = 'Health'
        queryPer = 'SELECT A,B'
        queryStat = 'SELECT A,C'
    } else {
        hTitle = 'Education'
        queryPer = 'SELECT A,D'
        queryStat = 'SELECT A,E'
    }
    drawBarChart(sheetName, queryPer, barChartByGrowingResponseHandler1);
    drawBarChart(sheetName, queryStat, barChartByGrowingResponseHandler2);
}
// draw bar chart growing rate #1
function barChartByGrowingResponseHandler1(response) {
    var data = response.getDataTable();
    console.log('inside growing data= ' + data)
    data.sort({
        column: 1,
        desc: true
    });
    var options = {
        width: 500,
        height: 700,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },

        hAxis: {
            title: 'Country',
            minValue: 0,
            fontSize: 4,
            textStyle: {
                fontSize: 7,
                bold: true
            }
        },
        vAxis: {
            title: hTitle + ' Spending in U.S $'
        }
    };
    var chart = new google.visualization.BarChart(
        document.getElementById('bar-chart-grow-compare1'));
    chart.draw(data, options);
}
// draw bar chart growing rate #2
function barChartByGrowingResponseHandler2(response) {
    var data = response.getDataTable();
    console.log('inside growing data= ' + data)
    data.sort({
        column: 1,
        desc: true
    });
    var options = {
        width: 500,
        height: 700,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },

        hAxis: {
            title: 'Country',
            minValue: 0,
            fontSize: 4,
            textStyle: {
                fontSize: 7,
                bold: true
            }
        },
        vAxis: {
            title: hTitle + ' Spending in U.S $'
        }
    };
    var chart = new google.visualization.BarChart(
        document.getElementById('bar-chart-grow-compare2'));
    chart.draw(data, options);
}

// switch between health and education
function switchGrowingRateBarChartHandler(response) {
    if (response.value == 0) {
        curHeal = false
    } else {
        curHeal = true
    }
    // console.log('curStatic' + curStatic)
    drawBarChartsByGrowingRate(curHeal);
}

// draw line charts
google.charts.setOnLoadCallback(drawLineCharts);
var curLineType = 'GDP'

function drawLineCharts() {
    var query = 'SELECT *'
    sheetName = '_Total_Stat'
    if (curLineType == 'GDP') {
        sheetName = curLineType + sheetName
    } else if (curLineType == 'Military') {
        sheetName = curLineType + sheetName
    } else if (curLineType == 'Health') {
        sheetName = curLineType + sheetName
    } else if (curLineType == 'Education') {
        sheetName = curLineType + sheetName
    }
    // sheetName = 'Military_Total_Stat'
    console.log('line chart')
    drawGeoChart(sheetName, query, geoChartHandler)
    var queryString = encodeURIComponent(query);
    var query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/19EaMgLOZU12dImjIAFTpdnyIWGeXw_lHFJne-AXmHBY/gviz/tq?sheet=' +
        sheetName + '&headers=1&tq=' + queryString);
    query.send(linechartResponseHandler);
}
// draw line charts
function linechartResponseHandler(response) {
    var data = response.getDataTable();
    var options = {
        chart: {
            title: 'GDP Increase Rate',
            subtitle: 'in millions of dollars (USD)'
        },
        width: 1000,
        height: 400,
        axes: {
            x: {
                0: { side: 'top' }
            }
        }
    };

    var chart = new google.charts.Line(document.getElementById('line-chart'));

    chart.draw(data, google.charts.Line.convertOptions(options));
}
// line chart type switch handler
function handleLineChartType(response) {
    curLineType = response.value
    drawLineCharts()
}