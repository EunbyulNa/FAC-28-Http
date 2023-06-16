//API key (We need to hide it later!)
const  dayLength =[];
const ApiKey = '666dbb9c6137456690cfd79fe7ac0563';
const errMsg = document.querySelector('#err-msg');

const autocompleteInput = new autocomplete.GeocoderAutocomplete(
  document.getElementById("autocomplete"),
  ApiKey,
  { /* Geocoder options */ }
);


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
      const todayResult = today.results.day_length;
      console.log("Today is " + todayResult);
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
          dayLength.push(days);

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
