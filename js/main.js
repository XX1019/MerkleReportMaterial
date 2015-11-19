//load the username in nav
$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
	var user_current = null;
	user_current = AV.User.current();
	document.getElementById("user").innerHTML = "Hi~ " + user_current.get('username') + ", Welcome!";

	addProject_linkmanager();
});

function logoff() {
	AV.User.logOut();
	window.location.href = "index.html";
}

//show change password
function showChangePwd() {
		document.getElementById("changePwd").style.display = 'block';
		var user_current = null;
		user_current = AV.User.current();
		$('#name_changePwd').html("User Name: " + user_current.get('username'));
	}
	//hidden change password

function hiddenChangePwd() {
	document.getElementById("changePwd").style.display = 'none';
}

function confrimChangePwd() {
	var old = $('#old_pwd').val();
	var new1 = $('#new_pwd').val();
	var new2 = $('#new1_pwd').val();
	//	console.log(old);
	//	console.log(new1);
	//	console.log(new2);

	if (new1 != new2) {
		Materialize.toast('New passwords are inconsistent', 3000, 'rounded');
	} else {
		var user = AV.User.current();
		user.updatePassword(old, new1, {
			success: function() {
				//更新成功
				Materialize.toast('Change successfully', 3000, 'rounded');
				setTimeout("AV.User.logOut()", 3000);
				setTimeout("window.location.href = 'index.html'", 3001);
			},
			error: function(user, err) {
				//更新失败
				//console.dir(err.message);
				Materialize.toast(err.message, 3000, 'rounded');
			}
		});
	}

}


function hiddenCreateProject() {
	document.getElementById("addProject").style.display = 'none';
}

function showAddProject() {

		document.getElementById("addProject").style.display = 'block';

	}
	//this function has problem

function addProject_linkmanager() {
	var Manager = AV.Object.extend('Manager');
	var query_manager = new AV.Query(Manager);
	var manager01 = null;
	var addoption = "";
	query_manager.find({
		success: function(result) {
			for (var i = result.length - 1; i >= 0; --i) {
				manager01 = result[i].get('username');
				addoption += '<option>' + manager01 + '</option>';
				console.log(manager01);
			}
			$("#choose_manager").append(addoption);
			$('#choose_manager').material_select('update');
		},
		error: function(error) {
			console.dir(error);
		}

	});

}

function createProject(){
	var m=$("#choose_manager").find("option:selected").text();

	var projectn=$('#projectN').val();
	var Sm=$('#sm').val();
		console.log(m+projectn+Sm);
		var Project = AV.Object.extend("Project");
	var project = new Project();
	if(project==""|Sm==""|m=="Choose manager"){
   	Materialize.toast("Please fill out the complete!", 3000, 'rounded');
   }else{
   	
   	project.set("projectName",projectn);
   	project.set("DELSM",Sm);
   	project.set("manager",m);

   	   	project.save(null,{
   		success:function(){
   			//将此项目关系与manager绑定

   		Materialize.toast('successfully',3000,'round');
		
   				//location.reload();
   		},
   		error:function(error){
   			console.log(error);
   			alert('Project has been in existence!')
   		}
   	});
   }
}
