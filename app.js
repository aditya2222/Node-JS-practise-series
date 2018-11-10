const http = require('http')


const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers)
    // Process.exit() is used to terminate the process
    res.setHeader('CONTENT-TYPE', 'text/html')
    res.write('<html>');
    res.write('<head><title>My FIrst Page</title></head>');
    res.write('<body><h1>Hello from my Node JS</h1></body>');
    res.write('</html>');
    res.end()

})


server.listen(3000)