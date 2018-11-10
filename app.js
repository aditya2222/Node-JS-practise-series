const http = require('http')


const server = http.createServer((req, res) => {
    console.log(req, res)
    // Process.exit() is used to terminate the process
    process.exit()
})


server.listen(3000)