const ApiKey =  '666dbb9c6137456690cfd79fe7ac0563';

const autocompleteInput = new autocomplete.GeocoderAutocomplete(
    document.getElementById("autocomplete"), 
    //API key (We need to hide it later!)
    '666dbb9c6137456690cfd79fe7ac0563', 
    { /* Geocoder options */ });

autocompleteInput.on('select', (location) => {
// check selected location here,
console.log(location)
const { properties:{lat,lon} } = location

console.log(lat, lon)



});

autocompleteInput.on('suggestions', (suggestions) => {
// process suggestions here

});






