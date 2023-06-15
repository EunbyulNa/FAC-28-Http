


//API key (We need to hide it later!)
const ApiKey = '666dbb9c6137456690cfd79fe7ac0563';

const autocompleteInput = new autocomplete.GeocoderAutocomplete(
    document.getElementById("autocomplete"),
    ApiKey,
    { /* Geocoder options */ });

autocompleteInput.on('select', async (location) => {
  
    // latitude, longitude value
    const { properties: { lat, lon } } = location
    console.log(lat,lon)

    //Show loader 
    let loader = document.querySelector('.loader')
    loader.style.display = 'block'

     try {
       const staticmap = await fetch(`https://maps.geoapify.com/v1/staticmap?style=osm-carto&center=lonlat:${lon},${lat}&zoom=14&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${ApiKey}`)
       if (!staticmap.ok) throw new Error(staticmap.status)
     
       let mapUrl = staticmap.url

      let mapImg = document.querySelector('#mapImg')
       mapImg.src = mapUrl
       //Hide loader display
      loader.style.display = 'none'

      try {
        const sunApiToday = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`);  
        if(!sunApiToday.ok) throw new Error(sunApiToday.status)
        const today = await sunApiToday.json()
        console.log(today)

      } catch (error) {
        
      }

      for(day=1; day<=31; day++){
        let dayString = day.toString().padStart(2, '0')

        try {
        
        const sunApiAverage = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&timezone=UTC&date=2023-06-${dayString}`);  
        if(!sunApi.ok) throw new Error(sunApi.status)
        const result = await sunApi.json()
        //console.log(result)
    
       } catch (error) {
            
        }
      }

     } 
     
     
     catch (error) {
        console.log(error)
     }


});



autocompleteInput.on('suggestions', (suggestions) => {
    // process suggestions here

});






