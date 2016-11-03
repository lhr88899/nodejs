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
            response.write('hello');
            archive();
            unarchive();
            response.end();
        }
    }
).listen(8000);
console.log('start http server at port 8000');

//打包
function archive(){
    var AdmZip = require('adm-zip');
    var zip = new AdmZip();
    //zip.addLocalFile("./app.js");
    zip.addLocalFolder('../../dip/etc');
    zip.writeZip("../../dip/impexe.zip");
}

//解包
function unarchive(){	
    var dir = require('node-dir');
		var AdmZip = require('adm-zip');
    var unzip = new AdmZip('../../dip/impexe.zip');
   // var fs = require('fs-extra');
		//var mkdirp=require('mkdirp');
		var fs = require('fs');
    
    var	dir1=['data','log','dict','errsql'];
		unzip.extractAllTo("../../dip/etc", /*overwrite*/false);
	  dir.subdirs("../../dip/etc", function(err, subdirs) {
	    if (err) throw err;
		  console.log(subdirs);
	 	  for(var i=0; i<subdirs.length;i++)
				{
				for(var j=0;j<4;j++)
					{
					var aa='../../dip/'+dir1[j]+'/'+subdirs[i].substring(14);
				  fs.mkdir(aa);
					}
				}
		});
}


