module.exports=teacher;
var user=require('./User');

function teacher(id,name,age)
{	
	user.apply(this,[id,name,age]);
	this.teach =function(res)
	{
		res.write('aslkdfj');
	}
	/*function teach(res)
	{
		res.write(this.name+'讲课');
	}
	*/
	
}