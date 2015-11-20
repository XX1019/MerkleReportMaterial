//load the username in nav
$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
	var user_current = null;
	user_current = AV.User.current();
	document.getElementById("user").innerHTML = "Hi~ " + user_current.get('username') + ", Welcome!";

	addProject_linkmanager();
	//load_Projectinfo();
});

function logoff() {
		AV.User.logOut();
		window.location.href = "index.html";
	}
	/*---------------------------------------------change password-----------------------------------------------------------------------------------*/
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

/*-----------------------------------------create project-----------------------------------------------------------------------------------*/
function hiddenCreateProject() {
	$("#addProject").addClass('hide');
}

function showAddProject() {
		$('.showorhidden').addClass('hide');
		$("#addProject").removeClass('hide');
		$('#projectN').val("");
		$('#sm').val("");
		$("#choose_manager").val("");
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
				//console.log(manager01);
			}
			console.log('manager load successfully');
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
				Materialize.toast('successfully', 3000, 'round');
				$('#projectN').val("");
				$('#sm').val("");
				$("#choose_manager").val("");

			},
			error: function(error) {
				console.log(error);
				alert('Project has been in existence!')
			}
		});
	}
}

/*---------------------------------------------delete project-----------------------------------------------------------------------------------*/

function hiddenDeleteProject() {
	$('#deleteProject').addClass('hide');
}

function showDeleteProject() {
	//delete the option then load the option
	$('.showorhidden').addClass('hide');
	$('#deleteProject').removeClass('hide');
	$('#choose_project_to_delete option:eq(0)').nextAll().remove();
	load_deleteProjectinfo();
	$("#deleteproject_sm").text("DEL/SM:");
	$("#deleteproject_gdcm").text("GDC Manager:");
}


function load_deleteProjectinfo() {
	var Project = AV.Object.extend('Project');
	var query_project = new AV.Query(Project);
	var project = null;
	var ProjectinfoString = "";
	query_project.find({
		success: function(result) {
			for (var i = 0; i < result.length; ++i) {
				project = result[i].get('projectName');

				ProjectinfoString += '<option value=' + i + '>' + project + '</option>';
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

	var Project = AV.Object.extend('Project');
	var query_P_info = new AV.Query(Project);
	query_P_info.equalTo("projectName", m);
	query_P_info.find({
		success: function(result) {
			//result.get("DELSM");
			console.log(result[0].get("DELSM"));
			console.log(result[0].get("manager"));
			$("#deleteproject_sm").html("DEL/SM:" + " " + result[0].get("DELSM"));
			$("#deleteproject_gdcm").html("GDC Manager:" + " " + result[0].get("manager"));
		},
		error: function(error) {
			console.dir(error);
		}
	});

}

function deleteProject() {

	var m = $("#choose_project_to_delete").find("option:selected").text();
	console.log(m);

	var Project = AV.Object.extend('Project');
	var query_P_info = new AV.Query(Project);
	query_P_info.equalTo("projectName", m);
	query_P_info.find({
		success: function(result) {

			var rs = result[0];
			//			console.log(rs.get("DELSM"));
			//			console.log(rs.get("manager"));
			console.log(result.length);
			AV.Object.destroyAll(result).then(function(object) {
				console.log("在Project中删除成功");
				Materialize.toast('Delete successfully', 3000, 'round');
				$("#deleteproject_sm").text("DEL/SM:");
				$("#deleteproject_gdcm").text("GDC Manager:");
				$("#choose_project_to_delete").val("");
				//location.reload();
				$('#choose_project_to_delete option:eq(0)').nextAll().remove();
				load_deleteProjectinfo();
			}, function(error) {});

		},
		error: function(error) {
			console.dir(error);
		}
	});


	var Member = AV.Object.extend('Member');
	var query_mp_info = new AV.Query(Member);
	query_mp_info.equalTo('project', m);
	query_mp_info.find({
		success: function(result) {
			if (result.length > 0) {
				AV.Object.destroyAll(result).then(function(object) {
					console.log("在Member中删除成功");
					//alert("删除成功");
					//location.reload();
				}, function(error) {});
			}
		},
		error: function(error) {

		}
	});

}

/*---------------------------------------------assign project-----------------------------------------------------------------------------------*/
function hiddenAssignProject() {
	$("#assignproject_sm").text("DEL/SM: ");
	$("#assignproject_gdcm").text("GDC Manager:　");
	$('#assignproject_member').text('Team Member(s):');
	$('#showmember div').remove();
	$('#delete_member option:eq(0)').nextAll().remove();
	$('#assignProject').addClass('hide');
}


function showAssignProject() {
	$('.showorhidden').addClass('hide');
	$('#assignProject').removeClass('hide');
	$('#choose_project_to_assign option:eq(0)').nextAll().remove();
	load_assignProjectinfo();
	$('#add_member option:eq(0)').nextAll().remove();
	link_assignmember();
}




function load_assignProjectinfo() {
	var Project = AV.Object.extend('Project');
	var query_project = new AV.Query(Project);
	var project = null;
	var ProjectinfoString = "";
	query_project.find({
		success: function(result) {
			for (var i = 0; i < result.length; ++i) {
				project = result[i].get('projectName');

				ProjectinfoString += '<option value=' + i + '>' + project + '</option>';
			}
			//	console.log(ProjectinfoString);
			$("#choose_project_to_assign").append(ProjectinfoString);
			$('#choose_project_to_assign').material_select('update');
		},
		error: function(error) {
			console.log(error);
		}

	});

}


function linkassignProjectinfo() {
	//$('#showmember div').remove();
	var m = $("#choose_project_to_assign").find("option:selected").text();
	console.log(m);
	link_project(m);
	link_deleteM();

}


function link_deleteM() {
	$('#showmember div').remove();
	var m = $("#choose_project_to_assign").find("option:selected").text();
	$('#assignproject_member').html('Team Member(s):');
	$('#delete_member option:eq(0)').nextAll().remove();

	var Member = AV.Object.extend('Member');
	var query_M_info = new AV.Query(Member);
	query_M_info.equalTo('project', m)
	query_M_info.find({
		success: function(result) {
			console.log(result.length);
			if (result.length == 0) {
				$('#assignproject_member').html('Team members: None , Please add.');
			} else {

				for (var i = 0; i < result.length; ++i) {

					$('#showmember').append('<div class="chip">' + result[i].get('name') + "</div>");
					var m_name = result[i].get('name');

					var HtmlString = '<option>' + m_name + '</option>';
					$("#delete_member").append(HtmlString);
				}
			}

		},
		error: function(error) {
			console.dir(error);
		}
	});
}


function link_project(m) {
	var Project = AV.Object.extend('Project');
	var query_P_info = new AV.Query(Project);
	query_P_info.equalTo("projectName", m);
	query_P_info.find({
		success: function(result) {
			//result.get("DELSM");
			console.log(result[0].get("DELSM"));
			console.log(result[0].get("manager"));
			$("#assignproject_sm").html("DEL/SM:  " + result[0].get("DELSM"));
			$("#assignproject_gdcm").html("GDC Manager:  " + result[0].get("manager"));
		},
		error: function(error) {
			console.dir(error);
		}
	});
}

function link_assignmember() {

	var User = AV.Object.extend('User');
	var query_user = new AV.Query(User);
	var user = null;
	var HtmlString = "";
	query_user.find({
		success: function(result) {
			//	console.log($('.add_member').length);

			for (var i = 0; i < result.length; ++i) {
				user = result[i].get('username');
				//console.log(manager01);
				HtmlString += '<option>' + user + '</option>';
			}
			//console.log(HtmlString);
			$("#add_member").append(HtmlString);

		},
		error: function(error) {
			console.log(error);
		}

	});
}


function add_member() {
	var m = $('#choose_project_to_assign').find("option:selected").text();
	var mm = $('#add_member').find("option:selected").text();
	console.log(mm + m);
	//将添加的member存入leancloud
	if (mm != 'Choose member' & m != 'Choose project') {
		var Member = AV.Object.extend("Member");
		var member = new Member();
		member.set('name', mm);
		member.set('project', m);
		member.save(null, {
			success: function() {
				Materialize.toast('Add member successfully!', 3000, 'round');
			//	console.log($('.member_has').html());
				if ($('#assignproject_member').html() == 'Team members:None,Please add.') {
					$('#assignproject_member').html('Team members:');
				}

				$("#delete_member").append('<option >' + mm + '</option>');
				$('#showmember').append('<div class="chip">' + mm + "</div>");
				$('#add_member').find("option[text='Choose member']").attr('selected','selected');
				$('#add_member').val('');
			},
			error: function() {
				Materialize.toast('Member has been in existence!', 3000, 'round');
				//	alert('Member has been in existence!');
			}


		});
	} else {
		Materialize.toast('Select none!', 3000, 'round');
		//	alert('Select none!');
	}
}


function delete_member() {
	var me = $("#delete_member").find("option:selected").text();
	var p = $("#choose_project_to_assign").find("option:selected").text();

	if (me != 'Choose member' & p != 'Choose project') {
		var Member = AV.Object.extend("Member");
		var query_me = new AV.Query(Member);
		query_me.equalTo('project', p);
		query_me.find({
			success: function(result) {
				for (var i = 0; i < result.length; ++i) {
					console.log(result.length);
					var rs = result[i];
					if (rs.get('name') == me) {
						console.log(rs.get('name'));
						rs.destroy({

							success: function(rs) {
								// 对象的实例已经被删除了.
								console.log('success');
								Materialize.toast('Delete member successfully!', 3000, 'round');
								//alert("Delete member successfully!");

								link_deleteM();
						
							},
							error: function(rs, error) {
								// 出错了.
								console.log('delete error');
								alert("Delete failed");
							}
						});
					}
				}

			},
			error: function(error) {
				console.log(error);
			}
		});
	} else {
		alert('Select None!');
	}
}