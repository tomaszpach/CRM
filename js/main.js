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

});