$(document).ready(function () {
    let arrayWithGeo = [];
    const citiesList = ['Limanowa', 'Korzenna', 'Barcin', 'Bełchatów', 'Będzin', 'Biała Podlaska', 'Białystok', 'Bielsk Podlaski', 'Bielsko-Biała', 'Biłgoraj', 'Bochnia'];
    const citiesListLength = citiesList.length;

    function fetchGeoLocalization(citiesList) {
        for (let i = 0; i < citiesList.length; i++) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDWPhBk96NOVK1gKy40av7BOAcwiAycuS4&address=${citiesList[i]}`)
                .then(response => response.json())
                .then(data => updateArrayWithGeo(data, citiesList));
        }
    }

    fetchGeoLocalization(citiesList);


    function updateArrayWithGeo(data, citiesList) {
        arrayWithGeo.push(data);

        if (citiesListLength === arrayWithGeo.length) {
            let locationData = [];

            for (let i = 0; i < arrayWithGeo.length; i++) {
                const lat = arrayWithGeo[i].results[0].geometry.location.lat,
                    lng = arrayWithGeo[i].results[0].geometry.location.lng,
                    latLng = [],
                    name = arrayWithGeo[i].results[0].formatted_address;

                latLng.push(lat);
                latLng.push(lng);

                locationData.push({latLng: latLng, name: name, shortName: citiesList[i]});
            }

            createMapWithMarkers(locationData, citiesList);
        }
    }

// Create map function

    function createMapWithMarkers(locationData) {
        if ($.fn.vectorMap) {
            $('#pl-map').vectorMap({
                map: 'pl_merc',
                backgroundColor: 'transparent',
                zoomOnScroll: false,
                regionsSelectable: true,
                regionsSelectableOne: true,
                scaleColors: ['#C8EEFF', '#0071A4'],
                normalizeFunction: 'polynomial',
                focusOn: {
                    x: 1,
                    y: 1,
                    scale: 2
                },

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
                markerLabelStyle: {
                    initial: {
                        'font-family': 'Verdana',
                        'font-size': '12',
                        'font-weight': 'bold',
                        cursor: 'default',
                        fill: 'black'
                    },
                    hover: {
                        cursor: 'pointer'
                    }
                },
                markers: locationData,
                labels: {
                    markers: {
                        render: function (index) {
                            return locationData[index].shortName;
                        }
                    }
                },
            });
        }
    }
});
