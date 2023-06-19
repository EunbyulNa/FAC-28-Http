# FAC-28-Http

# Sunrise-Sunset

This is a web application that allows you to check sunrise, sunset, and daylight information for any location in the world.

## How to Use

1. Open the `index.html` file in a web browser.

2. In the search box labeled "Location", start typing the name of a location you want to search for.

3. As you type, the autocomplete feature will suggest locations based on your input.

4. Select the desired location from the suggestions.

5. The application will retrieve and display information about the sunrise, sunset, solar noon, and hours of sunlight for the selected location.

6. A map image of the location will be displayed along with a graph showing the average daylight hours for each month.

## Dependencies

This application uses the following external libraries:

- Font Awesome: Used for displaying icons.
- Geoapify Geocoder Autocomplete: Provides the location autocomplete feature.
- Geoapify Static Map API: Retrieves and displays a static map image.
- Sunrise-Sunset API: Retrieves sunrise, sunset, and daylight information.

## API Key

Note that the application currently uses a hard-coded API key (`666dbb9c6137456690cfd79fe7ac0563`). It is recommended to hide this API key for security reasons. In a production environment, you should use appropriate measures to protect sensitive information.

## File Structure

- `index.html`: The main HTML file that contains the structure and content of the web page.
- `style.css`: The CSS file that defines the styles for the web page.
- `index.js`: The JavaScript file that contains the functionality of the web application.


