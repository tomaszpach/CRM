/**
 * Init and reload buttons for animate numbers and progress bars
 */
const $pageContent = document.getElementById('page-content'),
    $tiles = $pageContent.getElementsByClassName('tiles');

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

/**
 * Add event listener to all tiles found and hook reload and remove functions to it
 */
for (let i = 0; i < $tiles.length; i++) {
    $tiles[i].addEventListener('click', (event) => {
        const $target = event.target,
            path = event.path || (event.composedPath && event.composedPath());

        reloadTile($target, path);
        removeTile($target, path);
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
const removeTile = ($target, path) => {
    if ($target.matches('.remove')) {
        let tilesPathIndex = null;
        path.forEach((element, index) => {
            if (element.classList && (element.classList.contains('tiles') || element.classList.contains('widget'))) {
                tilesPathIndex = index;
            }
        });
        path[tilesPathIndex + 1].remove(); // go up one element and delete tiles with wrapper.
    }
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

    $('#ram-usage').easyPieChart({
        lineWidth: 9,
        barColor: '#f35958',
        trackColor: '#e5e9ec',
        scaleColor: false
    });

    $('#disk-usage').easyPieChart({
        lineWidth: 9,
        barColor: '#7dc6ec',
        trackColor: '#e5e9ec',
        scaleColor: false
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
                    "stroke-width": 2
                },
                selected: {
                    fill: 'blue'
                },
                selectedHover: {}
            },
            backgroundColor: '#ffffff',
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
});
