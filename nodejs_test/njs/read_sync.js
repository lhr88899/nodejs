var  http  =  require('http');
var  optfile  =  require('./modules/optfile');
http.createServer(function  (request,  response)  {
    response.writeHead(200,  {'Content-Type':  'text/html;  charset=utf-8'});
    if(request.url!=="/favicon.ico"){  //清除第2此访问
        console.log('访问');
        response.write('hello,world');
        //optfile.readfile("G:\\www\\nodejs\\one\\models\\aa.txt");
        optfile.readfileSync("./view/a.html");
        response.end('');//不写则没有http协议尾
    }
}).listen(8000);
console.log('Server  running  at  http://127.0.0.1:8000/');