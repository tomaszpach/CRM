const $content = document.getElementById('page-content');

// Animate numbers
const initAnimateNumbers = numbersClass => {
    const numbers = $content.getElementsByClassName(numbersClass);
    Object.values(numbers).forEach(number => {
        const {value, animationDuration} = number.dataset;
        $(number).animateNumbers(value, true, parseInt(animationDuration, 10));
    });
};

// Animate progress bar
const initProgressBars = progressClass => {
    const progress = $content.getElementsByClassName(progressClass);
    Object.values(progress).forEach(bar => {
        const {percentage} = bar.dataset;
        bar.style.width = percentage || "100%";
    });
};

/**
 * Reload numbers and animate them
 * Add [data-value-start] to change default (0) start value
 * Example: data-value-start="2137"
 */
const reloadAnimateNumber = () => {
    const $element = event.path[2],
        $animateNumber = $element.getElementsByClassName('animate-number')[0],
        dataSet = $animateNumber.dataset,
        {valueStart = 0, value, animationDuration} = dataSet;

    $animateNumber.innerText = valueStart;
    $($animateNumber).animateNumbers(value, true, parseInt(animationDuration, 10));
};

$(document).ready(function () {
    let graph, rick;

    initAnimateNumbers('animate-number');
    initProgressBars('animate-progress-bar');

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

        graph = new Rickshaw.Graph({
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

        rick = new Rickshaw.Graph({
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
