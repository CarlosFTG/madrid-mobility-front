<h3>Madrid mobility front</h3>

This an app that displays on a Leaflet map BiciMad's bike stations info, such as available bikes or parking places in real time.

Information is got through a call to the Back-End that I have running in Heroku. In here I use the API-REST service provided by MobilityLabs Madrid to retrieve BiciMad information to be sent to this app, and, at the shame time, to be stored in a DB in order to make PostGis queries to know the closers bike stations to the user or know the amount of available bikes by district.

More functionalities will be added to this app.

To have a look to the global project, please visit https://carlosftg.github.io/madrid-mobility
