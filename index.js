//API key (We need to hide it later!)
const ApiKey =  '666dbb9c6137456690cfd79fe7ac0563';

const autocompleteInput = new autocomplete.GeocoderAutocomplete(
    document.getElementById("autocomplete"), 
    ApiKey,
    { /* Geocoder options */ });

autocompleteInput.on('select', (location) => {
// latitude, longitude value
const { properties:{lat,lon} } = location

fetch(`https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${lon},${lat}&zoom=14&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${ApiKey}`)
.then((res)=>{
    if(!res.ok) throw new Error(res.status)
    return res;
})
.then((data)=>{
    let {url} = data
    let mapImg = document.querySelector('#mapImg')
    mapImg.src= data.url
})
.catch((err)=>{
    console.log(err)
})

});

autocompleteInput.on('suggestions', (suggestions) => {
// process suggestions here

});






