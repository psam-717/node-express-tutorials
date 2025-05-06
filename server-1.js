const http = require('http');


const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        success: true,
        message: 'Our message in a json format'
    }));
})


server.listen(3000, () => {
    console.log(`server is listening on port 3000`);
})