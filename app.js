const http = require('http')
const fs = require('fs')


const server = http.createServer((req, res) => {
    const url = req.url
    const method = req.method
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter a Message</title></head>');
        res.write('<body><form action="/message" method="post"><input name="message" type="text"/><button type="submit">Send</button></form></body>')
        res.write('</html>');
        return res.end()
    }
    if (url === '/message' && method === 'POST') {
        fs.writeFileSync('message.txt', 'DUMMY')
        res.statusCode = 302;
        res.setHeader('Location', '/')
        return res.end()
    }
    // Process.exit() is used to terminate the process
    res.setHeader('CONTENT-TYPE', 'text/html')
    res.write('<html>');
    res.write('<head><title>First Page</title></head>');
    res.write('<body><h1>Hello World from Node JS</h1></body>')
    res.write('</html>');
    res.end()

})


server.listen(3000)