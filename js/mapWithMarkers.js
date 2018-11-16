const locationsData = [
    {
        "latLng": [
            50.06465009999999,
            19.9449799
        ],
        "name": "Kraków, Poland",
        "shortName": "Krakow"
    },
    {
        "latLng": [
            50.0406662,
            20.2225326
        ],
        "name": "32-005 Niepołomice, Poland",
        "shortName": "Niepolomice"
    },
    {
        "latLng": [
            49.6174535,
            20.7153325
        ],
        "name": "33-300 Nowy Sacz, Poland",
        "shortName": "Nowy Sącz"
    },
    {
        "latLng": [
            49.70587,
            20.42228
        ],
        "name": "34-600 Limanowa, Poland",
        "shortName": "Limanowa"
    },
    {
        "latLng": [
            49.4774647,
            20.032096
        ],
        "name": "Nowy Targ, Poland",
        "shortName": "Nowy Targ"
    },
    {
        "latLng": [
            49.74127,
            19.58636
        ],
        "name": "34-200 Sucha Beskidzka, Poland",
        "shortName": "Sucha Beskidzka"
    }
];

$(document).ready(function () {
    // todo citiesList is used only for generating lat and longitude from Google API
    let arrayWithGeo = [];
    const citiesList = ['Krakow', 'Niepolomice', 'Nowy Sącz', 'Limanowa', 'Nowy Targ', 'Sucha Beskidzka'];
    const citiesListLength = citiesList.length;

    // todo this can be used later to create input and generate lat and longitude
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
            let locationsData = [];

            for (let i = 0; i < arrayWithGeo.length; i++) {
                // console.log(citiesList[i]);
                const lat = arrayWithGeo[i].results[0].geometry.location.lat,
                    lng = arrayWithGeo[i].results[0].geometry.location.lng,
                    latLng = [],
                    name = arrayWithGeo[i].results[0].formatted_address;

                latLng.push(lat);
                latLng.push(lng);

                locationsData.push({latLng: latLng, name: name, shortName: citiesList[i]});
            }

            // createMapWithMarkers(locationsData);
            // console.log(locationsData);
        }
    }

    createMapWithMarkers(locationsData);
    console.log(locationsData);

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
                    x: 0.6,
                    y: 1,
                    scale: 4
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
