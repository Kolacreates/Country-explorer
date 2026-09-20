#  Country Explorer

A simple Express + EJS + Axios web app for exploring country data using the
[REST Countries API](https://restcountries.com/) — no API key required.

## Features

- Search any country by name
- View flag, capital, region, population, currencies, languages
- See bordering countries (resolved from country codes to full names)
- Friendly error message if a country isn't found
- Link out to Google Maps for the searched country

## Getting Started

1. Install dependencies:
   npm i

2. Start the server (with auto-restart on file changes):
   nodemon index.js
   or, without nodemon:
   npm start

3. Open your browser to:
   http://localhost:3000

## Project Structure

country-explorer/
├── index.js           # Express server + routes + Axios calls
├── views/
│   └── index.ejs       # Search form + country results template
├── public/
│   └── style.css        # Styling
├── package.json
└── README.md


## How It Works

1. User submits a country name via the search form (`POST /search`).
2. The server calls `GET /name/{countryName}` on the REST Countries API.
3. If the country has bordering countries, a second call is made to
   `GET /alpha?codes=...` to resolve border country codes into full names.
4. The relevant fields are packaged into a clean `country` object and passed
   to the EJS template for rendering.
5. If the API call fails (e.g. country not found), a friendly error message
   is shown instead of a crash.

## Planned Next Step: OpenUV Integration

A future enhancement will add a "Check UV Index" feature using the
[OpenUV API](https://www.openuv.io/), showing the current UV index for the
searched country's capital city — a nice example of combining two different
APIs in one app (REST Countries for location/coordinates, OpenUV for
UV data based on lat/lng).
