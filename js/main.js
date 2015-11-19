//load the username in nav
$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
	var user_current = null;
	user_current = AV.User.current();
	document.getElementById("user").innerHTML = "Hi~ " + user_current.get('username') + ", Welcome!";

	addProject_linkmanager();
	load_Projectinfo();
});

function logoff() {
	AV.User.logOut();
	window.location.href = "index.html";
}

//show change password
function showChangePwd() {
	$('.showorhidden').addClass('hide');
	$('#changePwd').removeClass('hide');
	var user_current = null;
	user_current = AV.User.current();
	$('#name_changePwd').html("User Name: " + user_current.get('username'));
}
//hidden change password

function hiddenChangePwd() {
	$('#changePwd').addClass('hide');
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
		//		document.getElementById("old_pwd").style.color = "red";
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
	$("#addProject").addClass('hide');
}

function showAddProject() {
	$('.showorhidden').addClass('hide');
	$("#addProject").removeClass('hide');

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

function createProject() {
	var m = $("#choose_manager").find("option:selected").text();

	var projectn = $('#projectN').val();
	var Sm = $('#sm').val();
	console.log(m + projectn + Sm);
	var Project = AV.Object.extend("Project");
	var project = new Project();
	if (project == "" | Sm == "" | m == "Choose manager") {
		Materialize.toast("Please fill out the complete!", 3000, 'rounded');
	} else {

		project.set("projectName", projectn);
		project.set("DELSM", Sm);
		project.set("manager", m);

		project.save(null, {
			success: function() {
				//将此项目关系与manager绑定

				Materialize.toast('successfully', 3000, 'round');

				//location.reload();
			},
			error: function(error) {
				console.log(error);
				alert('Project has been in existence!')
			}
		});
	}
}

function hiddenDeleteProject() {
	$('#deleteProject').addClass('hide');
}

function showDeleteProject() {
	$('.showorhidden').addClass('hide');
	$('#deleteProject').removeClass('hide');
}


function load_Projectinfo() {
	var Project = AV.Object.extend('Project');
	var query_project = new AV.Query(Project);
	var project = null;
	var ProjectinfoString = "";
	query_project.find({
		success: function(result) {
			for (var i = 0; i < result.length; ++i) {
				project = result[i].get('projectName');
				//console.log(manager01);

				ProjectinfoString += '<option value='+ i +'>' + project + '</option>';
			}
			console.log(ProjectinfoString);
			$("#choose_project_to_delete").append(ProjectinfoString);
			$('#choose_project_to_delete').material_select('update');
		},
		error: function(error) {
			console.log(error);
		}

	});

}

function linkdeletedProjectinfo() {
	var m = $("#choose_project_to_delete").find("option:selected").text();
	console.log(m);
}

function deleteProject() {



}