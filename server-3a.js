const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
    let path = './views/'
    let statusCode = 200;

    switch(req.url){
        case '/':
            path += 'welcome.html';
            break;
        case '/about':
            path += 'about.html';
            break;
        case '/users':
            path += 'users.html';
            break;
        default: 
            statusCode = 404;
            path += 'notFound.html';
            break;
        
    }

    // with the use of callbacks
    fs.readFile(path, (err, data) => {
        if(err){
            statusCode= 500;
            console.log(err);
            res.writeHead(statusCode, {'Content-Type': 'text/html'});
            res.end('<h1>Internal server error</h1>')

        }else {
            res.writeHead(statusCode, {'Content-Type': 'text/html'});
            res.end(data);
        }
    })
});

server.listen(port, ()=> {
    console.log( `✅ server is listening on port ${port}`)
})