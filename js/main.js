$(document).ready(function () {
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

    //Ricksaw Chart for Server Load - Autoupdate
    function loadServerChart() {
        let seriesData = [[], []];
        let random = new Rickshaw.Fixtures.RandomData(50);

        for (let i = 0; i < 50; i++) {
            random.addData(seriesData);
        }

        let $chart = document.getElementById("chart");

        if ($chart) {
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

    }

    loadServerChart();

    // Ricksaw Chart Sample
    function loadSampleChart() {
        let seriesData = [[], [], []];
        let random = new Rickshaw.Fixtures.RandomData(50);

        for (let i = 0; i < 50; i++) {
            random.addData(seriesData);
        }

        let $ricksaw = document.getElementById("ricksaw");

        if ($ricksaw !== null) {
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
    }

    loadSampleChart();


    // //Weahter Icons
    // const loadAnimatedWeatherIcons = function () {
    //     /*** Animated Weather Icon **/
    //     const icons = new Skycons({"color": "white"});
    //     icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
    //     icons.set("wind", Skycons.WIND);
    //     icons.play();
    // };
    // loadAnimatedWeatherIcons();


    let arrayWithGeo = [];
    const citiesList = ['Barcin', 'Bełchatów', 'Będzin', 'Biała Podlaska', 'Białystok', 'Bielsk Podlaski', 'Bielsko-Biała', 'Biłgoraj', 'Bochnia'];
    const citiesListLength = citiesList.length;

    function fetchGeoLocalization(citiesList) {
        for (let i = 0; i < citiesList.length; i++) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDWPhBk96NOVK1gKy40av7BOAcwiAycuS4&address=${citiesList[i]}`)
                .then(response => response.json())
                .then(data => updateArrayWithGeo(data));
        }
    }

    fetchGeoLocalization(citiesList);


    function updateArrayWithGeo(data) {
        arrayWithGeo.push(data);

        if (citiesListLength === arrayWithGeo.length) {
            let markers = [];

            for (let i = 0; i < arrayWithGeo.length; i++) {
                const lat = arrayWithGeo[i].results[0].geometry.location.lat,
                    lng = arrayWithGeo[i].results[0].geometry.location.lng,
                    latLng = [],
                    name = arrayWithGeo[i].results[0].formatted_address;

                latLng.push(lat);
                latLng.push(lng);

                markers.push({latLng: latLng, name: name});
            }

            createMapWithMarkers(markers);
        }
    }

    // Create map function

    function createMapWithMarkers(markers) {
        //Jquery vector map
        // Ta czesc odpowiada za wielkosc kropek
        const cityAreaData = [
            'dupa',
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2
        ];

        if ($.fn.vectorMap) {
            $('#pl-map').vectorMap({
                map: 'pl_merc',
                scaleColors: ['#C8EEFF', '#0071A4'],
                normalizeFunction: 'polynomial',
                focusOn: {
                    x: 5,
                    y: 1,
                    scale: 1
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
                    }
                },
                backgroundColor: '#ffffff',
                markers: markers,

            });
        }
    }


});
