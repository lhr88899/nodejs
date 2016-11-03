var  http  =  require('http');
var  optfile  =  require('./modules/optfile');
http.createServer(function  (request,  response)  {
    response.writeHead(200,  {'Content-Type':  'text/html;  charset=utf-8'});
    if(request.url!=="/favicon.ico"){  
        console.log('访问');
        function recall(data){
        	response.write(data);
        	response.end('');
        }
        response.write('hello,world');
        optfile.readfile("./view/a.html",recall);
        console.log('结束');
     
    }
}).listen(8000);
console.log('Server  running  at  http://127.0.0.1:8000/');