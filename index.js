import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
const API_URL  = "https://api.restcountries.com";
const API_KEY = process.env.API_KEY;
const authHeader = {
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    },
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res)=>{
    res.render("index.ejs", {
        country: null,
        error: null,
    });
});

app.post("/search", async(req, res)=>{
    const countryName = req.body.countryName.trim();
    try{
        const result = await axios.get(`${API_URL}/countries/v5`, {
            params: { q: countryName , limit: 1 },
            ...authHeader,
        });
        const data = result.data.data.objects[0];

        if (!data){
            throw new Error("No matching country found");
        };

        let borderNames = [];

        if(data.borders && data.borders.length > 0){
         const borderRequests = data.borders.map((code)=>
            axios.get(`${API_URL}/countries/v5/codes.alpha_3/${code}`, authHeader)
         );

         const borderResponses = await Promise.all(borderRequests);
        
         borderNames = borderResponses
        .map((res) => res.data.data.objects[0])
        .filter(Boolean)
        .map((borderCountry) => borderCountry.names.common);
        }


         const country = {
            name: data.names.common,
            officialName: data.names.official,
            flag: data.flag.url_svg,
            capital: data.capitals && data.capitals.length > 0 ? data.capitals[0].name : "N/A",
            region: data.region,
            subregion: data.subregion || "N/A",
            population: data.population.toLocaleString(),
            currencies: data.currencies && data.currencies.length > 0
            ? data.currencies
            .map((currency) => `${currency.name} (${currency.symbol || "N/A"})`)
            .join(", ")
            : "N/A",
            languages: data.languages && data.languages.length > 0
            ? data.languages.map((language) => language.name).join(", ")
            : "N/A",
            borders: borderNames,
            maps: data.links && data.links.google_maps ? data.links.google_maps : "#",
    };

    res.render("index.ejs", {
        country: country,
        error: null,
    });
     
    } catch(error){
        console.log(error.response ? error.response.data : error.message);
        res.render("index.ejs", {
            country: null,
            error: `Sorry, we couldn't find a country matching "${countryName}". Please check the spelling and try again.`,
        });
    }
});


app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
}) 