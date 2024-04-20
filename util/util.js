import fs from "fs";
import Jimp from "jimp";
import axios from "axios";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    a tuple consisting of status_code, absolute path to a filtered image locally saved file | error description
export async function filterImageFromURL(inputURL) {
    const [status, content] = await axios.get(inputURL, { responseType: "arraybuffer" })
    .then(response => 
        [response.status, response.data]
        )
        .catch(error => {
            return (
                error?.status ?
                    [error.response.status, error.response.data]
                    : [404, "Request to `" + inputURL + "` failed without status"])
        })
    if (status !== 200){
        return [status, content]
    }
    try {
        const photo = await Jimp.read(Buffer.from(content, "binary"));
        const outpath =
            "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
        let _ = await new Promise(resolve => photo
            .resize(256, Jimp.AUTO) // // resize to given width and scale the height accordingly
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(outpath, _ => resolve()));
        return([200, outpath]);
    }
    catch (e) {
        console.error("" + e)
        return [422, "Unable to read an image from response at " + inputURL]
    }


}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}