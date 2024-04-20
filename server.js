import express, { response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';
import axios from 'axios';
import * as path from 'path';

let __dirname = path.resolve();

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());


app.get("/filteredimage", async (request, response) => {
    let image_url = request?.query?.image_url;
    if (!image_url) {
        response.status(400).send("\nPlease provide the image_url as an URL parameter.\n\n")
    }
    else {
        let [status, content] = await filterImageFromURL(image_url)
        if (status === 200) {
            response.status(status).sendFile(content)
            response.on('finish', function() {
                try {
                    deleteLocalFiles([content])
                } catch(e) {
                  console.log("error removing ", content); 
                }
            });
        }
        else {
            response.status(status).send(content)
        }
    }
})

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
    res.status(200).sendFile("open-api-doc.yaml", { root: __dirname })
});

async function health_check() {
    let response;
    response = await axios.get(`http://localhost:${port}`, {
        validateStatus: (status) =>
            status === 404
    })
    console.assert(response.data.includes("filteredimage"), "The root URL should indicate which endpoint to call")
   
    await axios.get(`http://localhost:${port}/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/a/file/that/does/not/exist.jpg`
        , {
            validateStatus: (status) =>
                status === 404
        })
    response = await axios.get(`http://localhost:${port}/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg`)
    //console.log(response)
}

// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    health_check().then(_ =>
        console.log(`Health check succeeded, server running, press CTRL+C to terminate\n`)
    );


});