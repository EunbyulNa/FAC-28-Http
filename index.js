//API key (We need to hide it later!)
const ApiKey = '666dbb9c6137456690cfd79fe7ac0563';

const autocompleteInput = new autocomplete.GeocoderAutocomplete(
    document.getElementById("autocomplete"),
    ApiKey,
    { /* Geocoder options */ });

// variables to store data each time the API is called
let sunrise, sunset, dayLength, noon;
// number of seconds in a day
const DAY_SECONDS = 24 * 3600;
// grab the divs to show/hide on making a query
const dataText = document.querySelector('.sunset-times');
const barContainer = document.querySelector('.bar-container');
// grab the 3 divs forming the 3-segment bar display
const morningBar = document.querySelector('.morning-bar');
const dayBar = document.querySelector('.day-bar');
const nightBar = document.querySelector('.night-bar');
// grab the span elements to print results in
const sunriseText = document.querySelector('.sunrise-text');
const sunsetText = document.querySelector('.sunset-text');
const noonText = document.querySelector('.noon-text');
const lengthText = document.querySelector('.length-text');

autocompleteInput.on('select', (location) => {

    // latitude, longitude value
    const { properties: { lat, lon } } = location

    //Show loader 
    let loader = document.querySelector('.loader')
    loader.style.display = 'block'


    fetch(`https://maps.geoapify.com/v1/staticmap?style=osm-carto&center=lonlat:${lon},${lat}&zoom=14&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${ApiKey}`)
        .then((res) => {
            if (!res.ok) throw new Error(res.status)
            return res;
        })

        .then((data) => {
            let { url } = data
            let mapImg = document.querySelector('#mapImg')
            mapImg.src = data.url
            //Hide loader display
            loader.style.display = 'none'
        })
        .catch((err) => {
            const errMsg = document.querySelector('#err-msg')
            loader.style.display = 'none';
            errMsg.style.display = 'block'
        })

    // sunrise-sunset API fetch request
    fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lon=${lon}`)
        .then((res) => {
            if (!res.ok) throw new Error(res.status)
            return res.json();
        })
        .then(res => res.results)
        .then(data => {
            sunrise = data.sunrise;
            sunset = data.sunset;
            dayLength = data.day_length;
            noon = data.solar_noon;
            sunriseText.innerHTML = sunrise;
            sunsetText.innerHTML = sunset;
            noonText.innerHTML = noon;
            lengthText.innerHTML = dayLength;
            morningBar.style.width = (toSeconds(sunrise) * 100 / DAY_SECONDS) + '%';
            dayBar.style.width = ((toSeconds(sunset) - toSeconds(sunrise)) * 100 / DAY_SECONDS) + '%';
            nightBar.style.width = ((DAY_SECONDS - toSeconds(sunset)) * 100 / DAY_SECONDS) + '%';
            dataText.style.display = 'block';
            barContainer.style.display = 'flex';
        })

});

autocompleteInput.on('suggestions', (suggestions) => {
    // process suggestions here

});

// function to convert time strings into seconds from 00:00:00 AM
function toSeconds(time) {
    let seconds, minutes, hours;
    const digits = time.replace(/[\D]/g, '').split('');
    let temp = digits.pop();
    seconds = digits.pop() + temp;
    temp = digits.pop();
    minutes = digits.pop() + temp;
    if (digits.length === 2) {
        temp = digits.pop();
        hours = digits.pop() + temp;
    } else {
        hours = digits.pop();
    }
    hours = parseInt(hours) * 3600;
    minutes = parseInt(minutes) * 60;
    seconds = parseInt(seconds);
    let total = /PM/.test(time) ? 12 * 3600 : 0;
    total += hours + minutes + seconds;
    return total;
}