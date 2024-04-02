const os = require('os')
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const networkInterfaces = os.networkInterfaces();

// Find the first IPv4 address
const ipv4Addresses = Object.keys(networkInterfaces)
    .reduce((result, interfaceName) => {
        const interfaceData = networkInterfaces[interfaceName];
        const ipv4 = interfaceData.find(({ family }) => family === 'IPv4');
        if (ipv4) {
            result.push(ipv4.address);
        }
        return result;
    }, []);

// Define the port number
const port = 8080;

// Log the first IPv4 address followed by the port to the console
// console.log(`Server is hosted at: http${ipv4Address}:${port}`);
console.log(`Server is hosted at:, http://${ipv4Addresses[0]}:${port}`);
function time(req, res, next) {
    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let hours = ("0" + date_time.getHours()).slice(-2);
    let minutes = ("0" + date_time.getMinutes()).slice(-2);
    let seconds = ("0" + date_time.getSeconds()).slice(-2);
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    next();
}

function _time() {
    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let hours = ("0" + date_time.getHours()).slice(-2);
    let minutes = ("0" + date_time.getMinutes()).slice(-2);
    let seconds = ("0" + date_time.getSeconds()).slice(-2);
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

console.log("Server Started at ", _time());


app.get('/', time, (req, res) => {
    console.log("Server is Up and running!");
    
    
});

app.get('/test', time, (req, res) => {
    console.log("Test is called!");
    
    res.sendFile('index.html', { root: __dirname });
});

app.get('/files', time, (req, res) => {
    fs.readdir(path.join(__dirname, '/files'), (err, files) => {
        if (err) {
            console.log("error: 'Failed to retrieve'" );
            return res.status(500).json({ error: 'Failed to retrieve' });
        }
        console.log("directory sent: ", files);
        res.json(files);
    });
});

app.get('/files/:filename', time, (req, res) => {
    const filePath = path.join(__dirname, '/files/');
    console.log("File sent on path : ", filePath,"/",req.params.filename);
    res.sendFile(req.params.filename, { root: filePath }, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).json({ error: 'Failed to retrieve file' });
        }
    });
});

app.all('*', (req, res) => {
    return res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Error somewhere!" });
});

app.listen(port);
