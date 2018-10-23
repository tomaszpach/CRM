/**
 * Init and reload buttons for animate numbers and progress bars
 */
const $pageContent = document.getElementById('page-content'),
    $tiles = $pageContent.getElementsByClassName('tiles'),
    $tileWrappers = $pageContent.getElementsByClassName('tile-wrapper'),
    $restoreAllTilesButton = document.getElementById('restore-all-tiles'),
    $popup = document.getElementById('removed-popup');

let $tileWrapper,
    popupButtonTimeout;

$restoreAllTilesButton.addEventListener('click', () => {
    for (let i = 0; i < $tileWrappers.length; i++) {
        const $tile = $tileWrappers[i];

        $tile.classList.remove('hide');
    }
});

/**
 * Init animate numbers on document ready
 * @param numbersClass - animate numbers class (default: animate-number)
 */
const initAnimateNumbers = (numbersClass = 'animate-number') => {
    const numbers = $pageContent.getElementsByClassName(numbersClass);
    Object.values(numbers).forEach(number => {
        const {value, animationDuration} = number.dataset;
        $(number).animateNumbers(value, true, parseInt(animationDuration, 10));
    });
};

/**
 * Init animate progress bar on document read
 * Add [data-animation-duration] to change animation duration time (default: 1000)
 * @param progressClass - progress bar class (default: animate-progress-bar)
 */
const initProgressBars = (progressClass = 'animate-progress-bar') => {
    const progress = $pageContent.getElementsByClassName(progressClass);
    Object.values(progress).forEach(bar => {
        const {percentage = "0", animationDuration = 1000} = bar.dataset;
        bar.style.transition = `all ${animationDuration}ms`;
        bar.style.width = percentage;
    });
};

// todo cleanup code
const restoreRemovedElement = () => {
    const $animateNumber = $tileWrapper.getElementsByClassName('animate-number')[0],
        $progressBar = $tileWrapper.getElementsByClassName('progress-bar')[0],
        animateNumber_DataSet = $animateNumber ? $animateNumber.dataset : null,
        progressBar_DataSet = $progressBar ? $progressBar.dataset : null;

    $popup.addEventListener('click', function () {
        $tileWrapper.classList.remove('hide'); // show tile
        $popup.classList.add('hide'); // hide popup
    });

    // todo move this somewhere else because now it doesnt work as it should be
    // animation start on click on X
    reloadAnimateNumbers($animateNumber, animateNumber_DataSet);
    reloadAnimateProgressBar($progressBar, progressBar_DataSet)
};

/**
 * Add event listener to all tiles found and hook reload and remove functions to it
 */
for (let i = 0; i < $tiles.length; i++) {
    $tiles[i].addEventListener('click', (event) => {
        const $target = event.target,
            path = event.path || (event.composedPath && event.composedPath());

        reloadTile($target, path);
        hideTile($target, path);
    })
}

/**
 * Reload numbers and progress bar on click
 * @param $target - clicked element. Required to check if we clicked on .reload DOM element
 * @param path - path from clicked element to document
 */
const reloadTile = ($target, path) => {
    if ($target.matches('.reload')) {
        path.forEach(element => {
            if (element.classList && (element.classList.contains('tiles-body') || element.classList.contains('tiles-chart'))) {
                const $animateNumber = element.getElementsByClassName('animate-number')[0],
                    $progressBar = element.getElementsByClassName('progress-bar')[0],
                    animateNumber_DataSet = $animateNumber ? $animateNumber.dataset : null,
                    progressBar_DataSet = $progressBar ? $progressBar.dataset : null;

                $animateNumber ? reloadAnimateNumbers($animateNumber, animateNumber_DataSet) : null;
                $progressBar ? reloadAnimateProgressBar($progressBar, progressBar_DataSet) : null;
            }
        });
    }
};

/**
 * Remove whole tile with wrapper from DOM element.
 * !! Take a look how .remove() method works. It always remove one element above tile !!
 * @param $target - clicked element. Required to check if we clicked on .remove DOM element
 * @param path - path from clicked element to document
 */
const hideTile = ($target, path) => {
    if ($target.matches('.remove')) {
        window.clearTimeout(popupButtonTimeout); // Clear popupButtonTimeout. Fix issue when closing few tiles in a row and button disappear

        updateDomElement(path);
        $tileWrapper.classList.add('hide'); // go up one element and HIDE tile with wrapper.
        $popup.classList.remove('hide'); // show popup to restore hidden tile

        let tileTitle = $tileWrapper.getElementsByClassName("tiles-title")[0].innerText;
        $popup.innerText = `Przywróć ${tileTitle}`;
        popupButtonTimeout = setTimeout(() => {
            $popup.classList.add('hide')
        }, 3500);

        restoreRemovedElement()
    }
};

const updateDomElement = (path) => {
    let tilesPathIndex = null;

    path.forEach((element, index) => {
        if (element.classList && (element.classList.contains('tiles') || element.classList.contains('widget'))) {
            tilesPathIndex = index;
        }
    });
    $tileWrapper = path[tilesPathIndex + 1];
};

/**
 * Reload animate number function.
 * !! Remember to change [data-value-start] if you want to start from other value than 0 !!
 * Add [data-value-start] to change start value (default: 0)
 * Example: data-value-start="2137"
 * @param element - DOM element to animate (default: span with class .animate-number)
 * @param dataSet - data taken from element
 */
const reloadAnimateNumbers = (element, dataSet) => {
    const {valueStart = 0, value, animationDuration} = dataSet;

    element.innerText = valueStart;
    $(element).animateNumbers(value, true, parseInt(animationDuration, 10));
};

/**
 * Reload animate progress bar function.
 * Add [data-animation-duration] to change animation duration time (default: 1000)
 * @param element - DOM element to animate (default: span with class .animate-progress-bar)
 * @param dataSet - data taken from element
 */
const reloadAnimateProgressBar = (element, dataSet) => {
    const {percentage, animationDuration = 1000} = dataSet,
        time = 100;

    element.style.transition = `all ${time}ms`;
    element.style.width = "0%";

    setTimeout(() => {
        element.style.transition = `all ${animationDuration}ms`;
        element.style.width = percentage;
    }, time);
};

$(document).ready(function () {
    initAnimateNumbers();
    initProgressBars();

    // Sparkline charts
    $("#mini-chart-orders").sparkline([1, 4, 6, 2, 0, 5, 6, 4], {
        type: 'bar',
        height: '30px',
        barWidth: 6,
        barSpacing: 2,
        barColor: '#f35958',
        negBarColor: '#f35958'
    });

    $("#mini-chart-other").sparkline([1, 4, 6, 2, 0, 5, 6, 4], {
        type: 'bar',
        height: '30px',
        barWidth: 6,
        barSpacing: 2,
        barColor: '#0aa699',
        negBarColor: '#0aa699'
    });

    // todo dwa ostatnie wykresy? co to jest?!
    const setupEasyPieChart = (DOMElement, config) => {
        const $element = document.getElementById(DOMElement),
            $pieTextWrapper = $element.getElementsByClassName('easy-pie-percent')[0],
            $pieTextSpan = $pieTextWrapper.getElementsByTagName('span'),
            dataSet = $element.dataset,
            $DOMElement = jQuery('#' + DOMElement);

        const {start, end, barcolor = 'blue', trackcolor = '#e5e9ec', firstRow, secondRow} = dataSet;

        // Oblicz procenty z poczatkowej i koncowej wartosci
        const calculatePercent = parseInt(start, 10) / parseInt(end, 10),
            fixedPercent = (calculatePercent.toFixed(3)) * 100;

        // Ustaw procenty w spanie
        const getSpanText = `${start} / ${end}`;

        // Ustaw tekst wewnątrz wykresu.
        // Domyślnie bierze % z [data-start] i [data-end]
        // Można również ustawić własne poprzez [data-first-row] i [data-second-row]
        if (firstRow) {
            $pieTextSpan[0].classList.add('remove-percent');
        }
        firstRow ? $pieTextSpan[0].innerText = firstRow : $pieTextSpan[0].innerText = fixedPercent; // first row in chart
        secondRow ? $pieTextSpan[1].innerText = secondRow : $pieTextSpan[1].innerText = getSpanText; // second row in chart

        config = {...config, barColor: barcolor, trackColor: trackcolor};

        $DOMElement.easyPieChart(config);
        $DOMElement.data('easyPieChart').update(fixedPercent);
    };

    const defaultConfig = {
        lineCap: 'round',
        rotate: 180,
        lineWidth: 9,
        scaleColor: false
    };

    setupEasyPieChart('aktywne-konta', defaultConfig);
    setupEasyPieChart('konwersja-ofert', defaultConfig);
    setupEasyPieChart('konwersja-leadow', defaultConfig);
    setupEasyPieChart('nieskontraktowane', defaultConfig);
    setupEasyPieChart('utracone', defaultConfig);


    // Słupkowy wykres Flot chart

    // let d1_1 = [
    //     [1325376000000, 120],
    //     [1328054400000, 70],
    //     [1330560000000, 100],
    //     [1333238400000, 60],
    //     [1335830400000, 35]
    // ];
    //
    // let d1_2 = [
    //     [1325376000000, 80],
    //     [1328054400000, 60],
    //     [1330560000000, 30],
    //     [1333238400000, 35],
    //     [1335830400000, 30]
    // ];
    //
    // let d1_3 = [
    //     [1325376000000, 80],
    //     [1328054400000, 40],
    //     [1330560000000, 30],
    //     [1333238400000, 20],
    //     [1335830400000, 10]
    // ];
    //
    // let d1_4 = [
    //     [1325376000000, 15],
    //     [1328054400000, 10],
    //     [1330560000000, 15],
    //     [1333238400000, 20],
    //     [1335830400000, 15]
    // ];
    //
    // let data1 = [
    //     {
    //         label: "Konrad Duszyński",
    //         data: d1_1,
    //         bars: {
    //             show: true,
    //             barWidth: 12*24*60*60*300,
    //             fill: true,
    //             lineWidth:0,
    //             order: 1,
    //             fillColor:  "rgba(243, 89, 88, 0.7)"
    //         },
    //         color: "rgba(243, 89, 88, 0.7)"
    //     },
    //     {
    //         label: "Product 2",
    //         data: d1_2,
    //         bars: {
    //             show: true,
    //             barWidth: 12*24*60*60*300,
    //             fill: true,
    //             lineWidth: 0,
    //             order: 2,
    //             fillColor:  "rgba(251, 176, 94, 0.7)"
    //         },
    //         color: "rgba(251, 176, 94, 0.7)"
    //     },
    //     {
    //         label: "Product 3",
    //         data: d1_3,
    //         bars: {
    //             show: true,
    //             barWidth: 12*24*60*60*300,
    //             fill: true,
    //             lineWidth: 0,
    //             order: 3,
    //             fillColor:  "rgba(10, 166, 153, 0.7)"
    //         },
    //         color: "rgba(10, 166, 153, 0.7)"
    //     },
    //     {
    //         label: "Product 4",
    //         data: d1_4,
    //         bars: {
    //             show: true,
    //             barWidth: 12*24*60*60*300,
    //             fill: true,
    //             lineWidth: 0,
    //             order: 4,
    //             fillColor:  "rgba(0, 144, 217, 0.7)"
    //         },
    //         color: "rgba(0, 144, 217, 0.7)"
    //     },
    //
    // ];
    //
    // $.plot($("#placeholder-bar-chart"), data1, {
    //     xaxis: {
    //         min: (new Date(2011, 11, 15)).getTime(),
    //         max: (new Date(2012, 4, 18)).getTime(),
    //         mode: "time",
    //         timeformat: "%b",
    //         tickSize: [1, "month"],
    //         monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    //         tickLength: 0, // hide gridlines
    //         axisLabel: 'Month',
    //         axisLabelUseCanvas: true,
    //         axisLabelFontSizePixels: 12,
    //         axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
    //         axisLabelPadding: 5,
    //     },
    //     yaxis: {
    //         axisLabel: 'Value',
    //         axisLabelUseCanvas: true,
    //         axisLabelFontSizePixels: 12,
    //         axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
    //         axisLabelPadding: 5
    //     },
    //     grid: {
    //         hoverable: true,
    //         clickable: false,
    //         borderWidth: 1,
    //         borderColor:'#f0f0f0',
    //         labelMargin:8,
    //     },
    //     series: {
    //         shadowSize: 1
    //     }
    // });

    // $.plot($("#placeholder-bar-chart"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });

    let $stackedChart = document.getElementById("stacked-chart"),
        stackedChart = new Chart($stackedChart, {
        type: 'bar',
        data: {
            labels: ["Konrad D.", "Jacek R.", "Wioletta N.", "Radosław R.", "Małgorzata L.", "Izabela B.", "Piotr M."],
            datasets: [
                {
                    label: 'Email komunikator',
                    data: [219, 303, 238, 199, 230, 248, 138],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1
                },
                {
                    label: 'Telefon',
                    data: [220, 117, 84, 72, 66, 30, 45],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Spotkanie w biurze',
                    data: [45, 12, 57, 88, 59, 2, 2],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Wyjazd do klienta',
                    data: [65, 18, 10, 8, 22, 2, 1],
                    backgroundColor: 'rgba(90, 86, 255, 0.2)',
                    borderColor: 'rgba(90, 86, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Montaż',
                    data: [3, 4, 7, 5, 0, 1, 1],
                    backgroundColor: 'rgba(230, 86, 255, 0.2)',
                    borderColor: 'rgba(230, 86, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: false
                }],
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });








    let $lineChart = document.getElementById("line-chart"),
        lineChart = new Chart($lineChart, {
        type: 'line',
        data: {
            labels: ["Okno 1", "Okno 2", "Okno 3", "Okno 4", "Okno 5", "Okno 6", "Okno 7"],
            datasets: [
                {
                    label: 'NETTO',
                    data: [219, 303, 238, 199, 230, 248, 138],
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    lineTension: 0
                },
                {
                    label: 'NETTO po rabatach',
                    data: [199, 287, 221, 187, 218, 216, 111],
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    lineTension: 0
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: false
                }],
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    // let $miniBarChart = document.getElementById("mini-chart-balance"),
    //     miniBarChart = new Chart($miniBarChart, {
    //     type: 'bar',
    //     data: {
    //         labels: ["Okno 1", "Okno 2", "Okno 3", "Okno 4", "Okno 5", "Okno 6", "Okno 7"],
    //         datasets: [
    //             {
    //                 label: 'Balance',
    //                 data: [20, 16, 17, 12, 12, 32, 27],
    //                 backgroundColor: 'transparent',
    //                 borderColor: 'rgba(255,99,132,1)',
    //                 borderWidth: 1,
    //                 lineTension: 0
    //             },
    //
    //             // {
    //             //     label: 'NETTO po rabatach',
    //             //     data: [199, 287, 221, 187, 218, 216, 111],
    //             //     backgroundColor: 'rgba(255,99,132,0.2)',
    //             //     borderColor: 'rgba(255,99,132,1)',
    //             //     borderWidth: 1
    //             // }
    //         ]
    //     },
    //     options: {
    //         scales: {
    //             xAxes: [{
    //                 stacked: false
    //             }],
    //             yAxes: [{
    //                 display: false,
    //                 stacked: false,
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // });

    $("#mini-chart-balance2").sparkline([1, 4, 6, 2, 0, 5, 6, 4], {
        type: 'bar',
        height: '30px',
        barWidth: 6,
        barSpacing: 2,
        barColor: 'rgba(255,99,132,0.7)',
        negBarColor: '#0aa699'
    });








    //Ricksaw Chart for Server Load - Autoupdate
    function loadServerChart() {
        let seriesData = [[], []];
        let random = new Rickshaw.Fixtures.RandomData(50);

        for (let i = 0; i < 50; i++) {
            random.addData(seriesData);
        }

        const graph = new Rickshaw.Graph({
            element: document.getElementById("chart"),
            height: 200,
            renderer: 'area',
            series: [
                {
                    data: seriesData[0],
                    color: 'rgba(0,144,217,0.51)',
                    name: 'DB Server'
                }, {
                    data: seriesData[1],
                    color: '#eceff1',
                    name: 'Web Server'
                }
            ]
        });
        new Rickshaw.Graph.HoverDetail({
            graph: graph
        });

        setInterval(function () {
            random.removeData(seriesData);
            random.addData(seriesData);
            graph.update();

        }, 1000);
    }

    loadServerChart();

    // Ricksaw Chart Sample
    function loadSampleChart() {
        let seriesData = [[], [], []];
        let random = new Rickshaw.Fixtures.RandomData(50);

        for (let i = 0; i < 50; i++) {
            random.addData(seriesData);
        }

        const rick = new Rickshaw.Graph({
            element: document.getElementById("ricksaw"),
            height: 200,
            renderer: 'area',
            series: [
                {
                    data: seriesData[0],
                    color: '#736086',
                    name: 'Downloads'
                }, {
                    data: seriesData[1],
                    color: '#f8a4a3',
                    name: 'Uploads'
                },
                {
                    data: seriesData[2],
                    color: '#eceff1',
                    name: 'All'
                }
            ]
        });
        new Rickshaw.Graph.HoverDetail({
            graph: rick
        });

        random.addData(seriesData);
        rick.update();

        const ticksTreatment = 'glow';

        const xAxis = new Rickshaw.Graph.Axis.Time({
            graph: rick,
            ticksTreatment: ticksTreatment,
            timeFixture: new Rickshaw.Fixtures.Time.Local()
        });

        xAxis.render();

        const yAxis = new Rickshaw.Graph.Axis.Y({
            graph: rick,
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            ticksTreatment: ticksTreatment
        });

        const legend = new Rickshaw.Graph.Legend({
            graph: rick,
            element: document.getElementById('legend')
        });

        yAxis.render();

        new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: rick,
            legend: legend
        });

        new Rickshaw.Graph.Behavior.Series.Order({
            graph: rick,
            legend: legend
        });

        new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: rick,
            legend: legend
        });
    }

    loadSampleChart();


    //Weahter Icons
    const loadAnimatedWeatherIcons = function () {
        /*** Animated Weather Icon **/
        const icons = new Skycons({"color": "white"});
        icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        icons.set("wind", Skycons.WIND);
        icons.play();
    };
    loadAnimatedWeatherIcons();
});
