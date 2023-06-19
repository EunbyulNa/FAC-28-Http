//API key (We need to hide it later!)
const  dayLengthArr =[];
const ApiKey = '666dbb9c6137456690cfd79fe7ac0563';
const errMsg = document.querySelector('#err-msg');

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

autocompleteInput.on('select', async (location) => {
  // latitude, longitude value
  const { properties: { lat, lon } } = location;
 
  // Show loader
  let loader = document.querySelector('.loader');
  loader.style.display = 'block';

  try {
    //fetch static map API
    const staticmap = await fetch(`https://maps.geoapify.com/v1/staticmap?style=osm-carto&center=lonlat:${lon},${lat}&zoom=14&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${ApiKey}`);
    if (!staticmap.ok) throw new Error(staticmap.status);
    
    //Add static map url to img src 
    let mapUrl = staticmap.url;
    let mapImg = document.querySelector('#mapImg');
    mapImg.src = mapUrl;
    
    try {
      // Get today's sunset and sunrise info
      const sunApiToday = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`);
      if (!sunApiToday.ok) throw new Error(sunApiToday.status);
      const today = await sunApiToday.json();
      const data = today.results
       sunrise = data.sunrise;
       console.log(sunrise)
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
      
    } catch (error) {
      errMsg.textContent = "Sorry, we can not update sunrise-sunset"
      errMsg.style.display = 'block'
      loader.style.display = 'none';
      console.log(error);
    }

    // Calculate monthly average
    let monthlyAverages = [];

    for (let month = 1; month <= 12; month++) {
      let monthString = month.toString().padStart(2, '0');

      let sum = 0;
      let daysInMonth = new Date(2023, month, 0).getDate();

      for (let day = 1; day <= 31; day++) {
        let dayString = day.toString().padStart(2, '0');

        try {
          const sunApiAverage = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&timezone=UTC&date=2023-${monthString}-${dayString}`);
          if (!sunApiAverage.ok) throw new Error(sunApiAverage.status);
          const result = await sunApiAverage.json();
          const days = result.results.day_length;
          dayLengthArr.push(days);

          if (days) {
            let hours = Number(days.split(':')[0]);
            sum += hours;
    
          }
        } catch (error) {
            errMsg.textContent = "Sorry, we can not update the monthly average daylight"
            errMsg.style.display = 'block'
            loader.style.display = 'none';
          console.log(error);
        }
      }

      if (daysInMonth > 0) {
        let average = parseInt(sum / daysInMonth);
        monthlyAverages.push({ month: monthString, average });
      }
    }
   
    try {
        //graph api fetch
        const labels = ['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Sep','Oct','Nov','Dec']
        const data = monthlyAverages.map((data) => data.average);
        const graphApi = `https://quickchart.io/chart?c={type:'bar',data:{labels:${JSON.stringify(labels)},datasets:[{label:'Average Hours',data:[${data}]}]}}`;
           
        const graph = await fetch(graphApi);       
        if (!graph.ok) throw new Error(graph.status);

        let graphImg = document.querySelector('#graphImg');
        graphImg.src = graph.url
    } catch (error) {
        errMsg.textContent = "Sorry, we can not update the monthly average daylight graph."
        errMsg.style.display = 'block'
        loader.style.display = 'none';
        console.log(error)
    }

        // Hide loader display
        loader.style.display = 'none';

  } catch (error) {
    errMsg.textContent = "Sorry, we can not update map"
    errMsg.style.display = 'block'
    loader.style.display = 'none';
    console.log(error);
  }
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
