const { log } = require("console");
const http = require("http");
const port = 4000

const proxyPorts = {
  smileapi : 3500
}
const server = http
  .createServer((clientRequest, clientResponsce) => {
    const portTract = clientRequest.url.match(/^\/\w+/)[0]
    const hostPort = proxyPorts[portTract.slice(1)]
    
    if(hostPort){
      const path = clientRequest.url.split(portTract)[1]
          const options = {
      hostname: hostPort,
      port:3500,
      path:path,
      method: clientRequest.method,
      headers:clientRequest.headers
      
    }
    makeRequest(options , clientRequest , clientResponsce)
    }else{
      clientResponsce.writeHead(400 , {'Content-Type':'application/json'})
      clientResponsce.write(JSON.stringify({
        code:1006,
        error:true,
        message: 'Endpoint not found!'
      }))
    }

  })
  
  const makeRequest = (options , clientRequest, clientResponsce) => {
    const proxy = http.request(options , res => {
      clientResponsce.writeHead(res.statusCode , res.headers)
      res.pipe(clientResponsce , {end:true} )
      clientRequest.pipe(proxy , {end:true})
    })
  }
  
  server.listen(port , () => {
    console.log('Proxy server started')
  })
  // .listen(8080); //the server object listens on port 8080
