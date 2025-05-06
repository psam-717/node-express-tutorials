const http = require('http');
const fs = require('fs');
let statusCode = 200;
const port = 3000;

const server = http.createServer((req, res) => {
    fs.readFile('./views/welcome.html', (err, data) => {
        if(err){
            console.log(err);
        }else {
            res.writeHead(statusCode, {'Content-Type': 'text/html'});
            res.end(data);
        }
    })
});

server.listen(port, ()=> {
    console.log( `✅ server is listening on port ${port}`)
})