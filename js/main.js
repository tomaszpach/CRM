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
        console.log($tileWrapper);
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
    // todo mozliwosc dodawania opisu wewnatrz wykresu
    const setupEasyPieChart = (DOMElement, config) => {
        const $element = document.getElementById(DOMElement),
            $pieTextWrapper = $element.getElementsByClassName('easy-pie-percent')[0],
            $pieTextSpan = $pieTextWrapper.getElementsByTagName('span'),
            dataSet = $element.dataset,
            $DOMElement = jQuery('#' + DOMElement);

        const { start, end, barcolor = 'blue', trackcolor = '#e5e9ec' } = dataSet;

        // Oblicz procenty z poczatkowej i koncowej wartosci
        const calculatePercent = parseInt(start, 10) / parseInt(end, 10),
            fixedPercent = (calculatePercent.toFixed(3)) * 100;

        // Ustaw procenty w spanie
        const getSpanText = `${start} / ${end}`;
        $pieTextSpan[0].innerText = fixedPercent;
        $pieTextSpan[1].innerText = getSpanText;

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


    //Jquery vector map
    const cityAreaData = [
        500.70,
        410.16,
        210.69,
        120.17,
        64.31,
        150.35,
        130.22,
        120.71,
        100.32
    ];

    if ($.fn.vectorMap) {
        $('#world-map').vectorMap({
            map: 'us_lcc_en',
            scaleColors: ['#C8EEFF', '#0071A4'],
            normalizeFunction: 'polynomial',
            focusOn: {
                x: 5,
                y: 1,
                scale: 1.8
            },
            zoomOnScroll: false,
            zoomMin: 0.85,
            hoverColor: false,
            regionStyle: {
                initial: {
                    fill: '#a5ded9',
                    "fill-opacity": 1,
                    stroke: '#a5ded9',
                    "stroke-width": 0,
                    "stroke-opacity": 0
                },
                hover: {
                    "fill-opacity": 0.8
                },
                selected: {
                    fill: 'yellow'
                },
                selectedHover: {}
            },
            markerStyle: {
                initial: {
                    fill: '#f35958',
                    stroke: '#f35958',
                    "fill-opacity": 1,
                    "stroke-width": 6,
                    "stroke-opacity": 0.5,
                    r: 3
                },
                hover: {
                    stroke: 'black',
                    "stroke-width": 5
                },
                selected: {
                    fill: 'blue'
                },
                selectedHover: {}
            },
            backgroundColor: '#fff',
            markers: [
                {latLng: [30.22, -81.88], name: 'Cecil,FL'},
                {latLng: [25.8, -80.28], name: 'Miami Intl,FL'},
                {latLng: [32.33, -85.00], name: 'Fort Benning,GA'},
                {latLng: [34.35, -85.17], name: 'Rome/Russell,GA'},
                {latLng: [35.90, -82.82], name: 'Hot Springs,NC'},
                {latLng: [35.85, -77.88], name: 'Rocky Mt,NC'},
                {latLng: [32.90, -97.03], name: 'Dallas/FW,TX'},
                {latLng: [39.37, -75.07], name: 'Millville,NJ'},
                {latLng: [39.37, -60.70], name: 'Goodland,KS'}
            ],
            series: {
                markers: [{
                    attribute: 'r',
                    scale: [3, 7],
                    values: cityAreaData
                }]
            },
        });
    }

    // if ($.fn.vectorMap) {
    //     var plants = [
    //         {name: 'VAK', coords: [50.0091294, 9.0371812], status: 'closed', offsets: [0, 2]},
    //         {name: 'MZFR', coords: [49.0543102, 8.4825862], status: 'closed', offsets: [0, 2]},
    //         {name: 'AVR', coords: [50.9030599, 6.4213693], status: 'closed'},
    //         {name: 'KKR', coords: [53.1472465, 12.9903674], status: 'closed'},
    //         {name: 'KRB', coords: [48.513264, 10.4020357], status: 'activeUntil2018'},
    //         {name: 'KWO', coords: [49.364503, 9.076252], status: 'closed'},
    //         {name: 'KWL', coords: [52.5331853, 7.2505223], status: 'closed', offsets: [0, -2]},
    //         {name: 'HDR', coords: [50.1051446, 8.9348691], status: 'closed', offsets: [0, -2]},
    //         {name: 'KKS', coords: [53.6200685, 9.5306289], status: 'closed'},
    //         {name: 'KKN', coords: [48.6558015, 12.2500848], status: 'closed', offsets: [0, -2]},
    //         {name: 'KGR', coords: [54.1417497, 13.6583877], status: 'closed'},
    //         {name: 'KWB', coords: [49.709331, 8.415865], status: 'closed'},
    //         {name: 'KWW', coords: [51.6396481, 9.3915617], status: 'closed'},
    //         {name: 'GKN', coords: [49.0401151, 9.1721088], status: 'activeUntil2022'},
    //         {name: 'KKB', coords: [53.8913533, 9.2005777], status: 'closed', offsets: [0, -5]},
    //         {name: 'KKI', coords: [48.5544748, 12.3472095], status: 'activeUntil2022', offsets: [0, 2]},
    //         {name: 'KKU', coords: [53.4293465, 8.4774649], status: 'closed'},
    //         {name: 'KNK', coords: [49.1473279, 8.3827739], status: 'closed'},
    //         {name: 'KKP', coords: [49.2513078, 8.4356761], status: 'activeUntil2022', offsets: [0, -2]},
    //         {name: 'KKG', coords: [49.9841308, 10.1846373], status: 'activeUntil2018'},
    //         {name: 'KKK', coords: [53.4104656, 10.4091597], status: 'closed'},
    //         {name: 'KWG', coords: [52.0348748, 9.4097793], status: 'activeUntil2022'},
    //         {name: 'KBR', coords: [53.850666, 9.3457603], status: 'closed', offsets: [0, 5]},
    //         {name: 'KMK', coords: [50.408791, 7.4861956], status: 'closed'},
    //         {name: 'THTR', coords: [51.6786228, 7.9700232], status: 'closed'},
    //         {name: 'KKE', coords: [52.4216974, 7.3706389], status: 'activeUntil2022', offsets: [0, 2]}
    //     ];
    //
    //     new jvm.Map({
    //         container: $('#world-map2'),
    //         map: 'de_merc',
    //         markers: plants.map(function (h) {
    //             return {name: h.name, latLng: h.coords}
    //         }),
    //         labels: {
    //             markers: {
    //                 render: function (index) {
    //                     return plants[index].name;
    //                 },
    //                 offsets: function (index) {
    //                     var offset = plants[index]['offsets'] || [0, 0];
    //
    //                     return [offset[0] - 7, offset[1] + 3];
    //                 }
    //             }
    //         },
    //         series: {
    //             markers: [{
    //                 attribute: 'image',
    //                 scale: {
    //                     'closed': '/img/icon-np-3.png',
    //                     'activeUntil2018': '/img/icon-np-2.png',
    //                     'activeUntil2022': '/img/icon-np-1.png'
    //                 },
    //                 values: plants.reduce(function (p, c, i) {
    //                     p[i] = c.status;
    //                     return p
    //                 }, {}),
    //                 legend: {
    //                     horizontal: true,
    //                     title: 'Nuclear power station status',
    //                     labelRender: function (v) {
    //                         return {
    //                             closed: 'Closed',
    //                             activeUntil2018: 'Scheduled for shut down<br> before 2018',
    //                             activeUntil2022: 'Scheduled for shut down<br> before 2022'
    //                         }[v];
    //                     }
    //                 }
    //             }]
    //         }
    //     });
    //
    //
    //     $('#world-map').vectorMap({})
    // }
});
