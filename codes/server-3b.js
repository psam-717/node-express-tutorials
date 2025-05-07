const http = require('http');
const fs = require('fs').promises;
const port = 3000;

const server = http.createServer( async (req, res) => {
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

    // using asynchronous function

    try {
        const data = await fs.readFile(path);
        res.writeHead(statusCode, {'Content-Type': 'text/html'});
        res.end(data);
    } catch (error) {
        console.log(error);
    
    }
});

server.listen(port, ()=> {
    console.log( `✅ server is listening on port ${port}`)
})