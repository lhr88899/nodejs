module.exports=student;
var user=require('./User');
function student(id,name,age)
{
	user.apply(this,[id,name,age]);
	function study(res)
	{
		res.write(this.name+'学习');
	}
	console.log('sadf');
}