const express = require("express");
const app = express();

// import file system (fs) and path modules
const fs = require("fs");
const path = require("path");


// --- Painting Handler Functions ---

const getAllPaintings = (req, resp) => {
    const fileName = "paintings-nested.json";

    const jsonPath = path.join(__dirname, "data", fileName); // make path to the file described by fileName

    // read the file
    fs.readFile(jsonPath, (err, contents) => {
        err ? resp.status(500).send("Error reading the data file.") : resp.json(JSON.parse(contents));
    })
}

const getPaintingById = (req, resp) => {
    const fileName = "paintings-nested.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, contents) => {
        if (err){
            resp.status(500).send("Error reading data file.")
        } else {
            const paintings = JSON.parse(contents);
            const matches = paintings.find(p => p.paintingID == req.params.id);

            if (matches){
                resp.json(matches);
            } else {
                resp.status(404).json({message: "Painting not found :("})
            }
        }
    });
}

const getPaintingsByGalleryId = (req, resp) => {
    const fileName = "paintings-nested.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, contents) => {
        if (err){
            resp.status(500).send("Error reading data file.");
        } else {
            const paintings = JSON.parse(contents);
            const matches = paintings.filter(p => p.gallery.galleryID == req.params.id);

            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(404).json({message: "No paintings found in this gallery :("})
            }
        }
    });
}

const getPaintingsByArtistId = (req, resp) => {
    const fileName = "paintings-nested.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, contents) => {
        if (err){
            resp.status(500).send("Error reading data file.")
        } else {
            const paintings = JSON.parse(contents);
            const matches = paintings.filter(p => p.artist.artistID == req.params.id);

            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(404).json({message: "No paintings by this artist have been found :("});
            }
        }
    });
}

const getPaintingsByYearRange = (req, resp) => {
    const fileName = "paintings-nested.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err){
            resp.status(500).send("Error reading data file.")
        } else {
            const paintings = JSON.parse(content);
            const matches = paintings.filter(p => p.yearOfWork <= req.params.max && p.yearOfWork >= req.params.min)

            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(404).json({message: `No paintings made in the range ${resp.params.min} - ${resp.params.max}`});
            }
        }
    });
}

const getPaintingsBySubstring = (req, resp) => {
    const fileName = "paintings-nested.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err) {
            resp.status(500).send("Error reading data file.");
        } else {
            const paintings = JSON.parse(content);
            const matches = paintings.filter(p => p.title.toLowerCase().includes(req.params.text.toLowerCase()));

            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(400).json({message: `No paintings with the substring '${req.params.text}' in the title :(`})
            }
        }
    })
}

const getPaintingsByColor = (req, resp) => {
    const fileName = "paintings-nested.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err) {
            resp.status(500).send("Error reading data file.");
        } else {
            const paintings = JSON.parse(content);
            const searchTerm = req.params.name.toLowerCase();

            const matches = paintings.filter(p => {
                const colors = p.details.annotation.dominantColors;
                return colors.some(c => c.name.toLowerCase().includes(searchTerm));
            });

            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(400).json({message: `No paintings with the substring '${req.params.text}' in the title :(`})
            }
        }
    })
}

// --- Artist Handler Functions ---
const getArtists = (req, resp) =>{
    const fileName = "artists.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err){
            resp.status(500).send("Error reading data file");
        } else {
            resp.json(JSON.parse(content));
        }
    })
}

const getArtistsByCountry = (req, resp) => {
    const fileName = "artists.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err){
            resp.status(500).send("Error reading data file");
        } else {
            const artists = JSON.parse(content);
            const matches = artists.filter(p => p.Nationality.toLowerCase() == req.params.country.toLowerCase());
            
            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(400).json({message: `There are no artists from the country ${req.params.country}`});
            }
        }
    })
}

// --- Gallery Handler Functions ---
const getGalleries = (req, resp) =>{
    const fileName = "galleries.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err){
            resp.status(500).send("Error reading data file");
        } else {
            resp.json(JSON.parse(content));
        }
    })
}

const getGalleriesByCountry = (req, resp) => {
    const fileName = "galleries.json";
    const jsonPath = path.join(__dirname, "data", fileName);

    fs.readFile(jsonPath, (err, content) => {
        if (err){
            resp.status(500).send("Error reading data file");
        } else {
            const galleries = JSON.parse(content);
            const matches = galleries.filter(p => p.GalleryCountry.toLowerCase() == req.params.country.toLowerCase());
            
            if (matches.length > 0){
                resp.json(matches);
            } else {
                resp.status(400).json({message: `There are no galleries from the country ${req.params.country}`});
            }
        }
    })
} 

// --- Route Registration ---
app.get("/api/paintings", getAllPaintings);
app.get("/api/paintings/:id", getPaintingById); // :id means that "id is a parameter". eg "invocation" http://localhost:3000/api/paintings/441
app.get("/api/paintings/gallery/:id", getPaintingsByGalleryId);
app.get("/api/paintings/artist/:id", getPaintingsByArtistId);
app.get("/api/paintings/year/:min/:max", getPaintingsByYearRange);
app.get("/api/paintings/title/:text", getPaintingsBySubstring);
app.get("/api/paintings/color/:name", getPaintingsByColor);
app.get("/api/artists", getArtists);
app.get("/api/artists/:country", getArtistsByCountry);
app.get("/api/galleries", getGalleries);
app.get("/api/galleries/:country", getGalleriesByCountry);

// --- Server Spin-up ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});