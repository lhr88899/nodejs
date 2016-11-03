var http = require('http');
var fs = require('fs');
var xml =require('xml2js');
var xmlParser = new xml.Parser({explicitArray : false, ignoreAttrs : true}); // xml -> json
var builder = new xml.Builder();//json ->xml
http.createServer(function(request,response)
  {
     response.writeHead(200, {'Content-Type':  'text/html;  charset=utf-8'});
      if(request.url!=="/favicon.ico")
      {
      	response.write('你好');
        create_store_info('<dip_command><group>123</group><component_name>qwe</component_name></dip_command>sdfsadf');
        response.end();
      }
  }
).listen(8000);
console.log('start http server at port 8000');

/*添加收藏文件*/
function create_store_info(xmldata)
{
    var str = xmldata.toString();
    xmlParser.parseString(str,function (err, result) 
    {
      if(err)  throw err;
      console.log(result);
      var a= {
        dip_command: {
        group:'',
        component:''
        }
      };
      a.dip_command.group= result.dip_command.group;
      a.dip_command.component_name= result.dip_command.component_name;
      console.log('a='+a);
      var xml_data=builder.buildObject(a);
      console.log('xml='+xml_data);

      fs.open('C:/Users/lhr/Desktop/my.xml', 'w+', function opened(err, fd)
      {
	    if (err) { throw err; }
	    var writeBuffer = new Buffer(xml_data),
	    bufferPosition = 0,
	    bufferLength = writeBuffer.length, 
	    filePosition = null;
	    fs.write( fd,
	        writeBuffer,
	        bufferPosition,
	        bufferLength,
	        filePosition,
	        function wrote(err, written) {
	           if (err) { throw err; }
	           console.log('wrote ' + written + ' bytes');
          }
          );
	    });
    });
}

/*查看收藏文件*/
function get_store_info()
{

}




