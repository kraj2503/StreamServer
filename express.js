const os = require('os')
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { exec } = require('child_process');

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
const port = 3000;

// Log the first IPv4 address followed by the port to the console
// console.log(`Server is hosted at: http${ipv4Address}:${port}`);
console.log(`Server is hosted at:, http://${ipv4Addresses}:${port}`);
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

    res.status(200).json({ msg: "Server is up!" });
});

app.get('/test', time, (req, res) => {
    console.log("Test is called!");
    res.sendFile('intro/index.html', { root: __dirname });
});

app.get('/files', time, (req, res) => {
    fs.readdir(path.join(__dirname, '/files'), (err, files) => {
        if (err) {
            console.log("error: ", err);

        }
        console.log("directory sent: ", files);
        res.json(files);
    });
});

app.get('/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, '/files/')
    // console.log(filePath)
    res.sendFile(req.params.filename, { root: filePath });
});

app.get('/sysdown', (req,res)=>{
    exec('shutdown /s /t 0', (error, stdout, stderr) => {
        if (error) {
          res.send(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
          return;
        }
        res.send(`stdout: ${stdout}`);
      });
})


// app.get('/files/:filename', (req, res) => {
//     const filePath = path.join(__dirname, '/files/', req.params.filename);
//     console.log(filePath);
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             // File does not exist
//             res.status(404).send('File not found');
//             return;
//         }

//         // Create a Readable stream
//         const stream = fs.createReadStream(filePath);

//         // Stream the file to the response
//         stream.pipe(res);

//         // Handle errors
//         stream.on('error', (err) => {
//             console.error('Stream error:', err);
//             res.status(500).send('Internal Server Error');
//         });
//     });
// });



app.all('*', (req, res) => {
    return res.status(404).send("Route doesn't Exists");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Error somewhere!" });
});

app.listen(port);
