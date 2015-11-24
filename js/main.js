//load the username in nav
$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
	var user_current = null;
	user_current = AV.User.current();
	$('.user').text("Hi~ " + user_current.get('username') + ", Welcome!");

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
	$('#old_pwd').val('');
	$('#new_pwd').val('');
	$('#new1_pwd').val('');
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
	//	$("#assignproject_sm").text("DEL/SM: ");
	//	$("#assignproject_gdcm").text("GDC Manager:　");
	//	$('#assignproject_member').text('Team Member(s):');
	//	$('#showmember div').remove();
	//	$('#delete_member option:eq(0)').nextAll().remove();
	$('#assignProject').addClass('hide');
}


function showAssignProject() {
	$('.showorhidden').addClass('hide');
	$('#assignProject').removeClass('hide');

	$("#assignproject_sm").text("DEL/SM: ");
	$("#assignproject_gdcm").text("GDC Manager:　");
	$('#assignproject_member').text('Team Member(s):');
	$('#showmember div').remove();
	$('#delete_member option:eq(0)').nextAll().remove();

	$('#choose_project_to_assign option:eq(0)').nextAll().remove();
	load_assignProjectinfo();

	$('#add_member option:eq(0)').nextAll().remove();
	link_assignmember();

	$('#choose_project_to_assign').find("option[text='Choose project']").attr('selected', 'selected');
	$('#choose_project_to_assign').val('');
	$('#delete_member').find("option[text='Choose member']").attr('selected', 'selected');
	$('#delete_member').val('');

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
			//console.log('add option');
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
	$('#delete_member').find("option[text='Choose member']").attr('selected', 'selected');
	$('#delete_member').val('');

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
				if ($('#assignproject_member').html() == 'Team members: None , Please add.') {
					$('#assignproject_member').html('Team members:');
				}

				$("#delete_member").append('<option >' + mm + '</option>');
				$('#showmember').append('<div class="chip">' + mm + "</div>");
				$('#add_member').find("option[text='Choose member']").attr('selected', 'selected');
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



/*---------------------------------------------------Fill             Project----------------------------------------------*/
function showFillProject() {

	$('.showorhidden').addClass('hide');
	$('#fillProject').removeClass('hide');
	$('#choose_project_to_fill option:eq(0)').nextAll().remove();
	load_fillProjectinfo();
	$('#choose_project_to_fill').find("option[text='Choose member']").attr('selected', 'selected');
	$('#choose_project_to_fill').val('');
	
	$("#fillproject_sm").text("DEL/SM: ");
	$("#fillproject_gdcm").text("GDC Manager:　");
	$('#allocated').attr('placeholder', '');
	$('#actual').attr('placeholder', '');
	$('#workload').val('auto');
	$('#accomplishment').val('');

}

function hiddenFillProject() {
	$('#fillProject').addClass('hide');
}




function load_fillProjectinfo() {
	var user_current = null;
	user_current = AV.User.current();
	//console.log(user_current);

	var Member = AV.Object.extend('Member');
	var query_project_member = new AV.Query(Member);
	query_project_member.equalTo('name', user_current.get('username'));
	var project_asmember = null;
	var ProjectinfoString = "";
	query_project_member.find({
		success: function(result) {
			console.log("Member" + result.length);
			for (var i = 0; i < result.length; ++i) {
				project_asmember = result[i].get('project');

				ProjectinfoString += '<option value=' + i + '>' + project_asmember + '</option>';
			}
			console.log(ProjectinfoString);
			$("#choose_project_to_fill").append(ProjectinfoString);
			$('#choose_project_to_fill').material_select('update');
		},
		error: function(error) {
			console.log(error);
		}

	});

}


function linkFillProjectinfo() {
	//get the DELSm and GDC Manager from project table
	var pp = $('#choose_project_to_fill').find("option:selected").text();
	console.log(pp);

	var Project = AV.Object.extend('Project');
	var query_P_info = new AV.Query(Project);
	query_P_info.equalTo("projectName", pp);
	query_P_info.find({
		success: function(result) {
			//result.get("DELSM");
			console.log(result[0].get("DELSM"));
			console.log(result[0].get("manager"));
			$("#fillproject_sm").html("DEL/SM:  " + result[0].get("DELSM"));
			$("#fillproject_gdcm").html("GDC Manager:  " + result[0].get("manager"));
		},
		error: function(error) {
			console.dir(error);
		}
	});

	//get Allocated and actual from member
	var user_current = null;
	user_current = AV.User.current();
	var Member = AV.Object.extend('Member');
	var query_memberinfo = new AV.Query(Member);
	query_memberinfo.equalTo('project', pp);
	query_memberinfo.find({
		success: function(result) {
			//console.log(result.length +result[0].get('name')+user_current.get('username'));
			if (result.length > 0) {

				for (var i = 0; i < result.length; ++i) {
					if (result[i].get('name') == user_current.get('username')) {

						var mem = result[i];
						//						console.log(mem.get('allocated'));
						//						console.log(mem.get('actual'));
						//						console.log(mem.get('accom'));

						$('#allocated').attr('placeholder', mem.get('allocated'));
						$('#actual').attr('placeholder', mem.get('actual'));
						$('#workload').val(mem.get('workload'));

						var accom = mem.get('accom');
						var reg = new RegExp("<br/>", "g");
						accom = accom.replace(reg, '\r\n');
						console.log(accom);
						$('#accomplishment').val(accom);
						$('#accomplishment').trigger('autoresize');


					}
				}
			}
		},
		error: function(error) {


		}
	});

}

//set the standard of allocated and actual
function compare() {
	var allocated = $('#allocated').val();
	var actual = $('#actual').val();
	console.log(allocated);
	console.log(actual);

	if (parseInt(actual) / parseInt(allocated) <= 0.5) {
		$('#workload').val('Low');
	}
	if (parseInt(actual) / parseInt(allocated) > 0.5 && parseInt(actual) / parseInt(allocated) <= 1.1) {
		$('#workload').val('Medium');
	}
	if (parseInt(actual) / parseInt(allocated) > 1.1) {
		$('#workload').val('High');
	}

}


function FillProject() {
	var allocated = $('#allocated').val();
	var actual = $('#actual').val();
	var workload = $('#workload').val();
	//to solve accomplishment change line
	var accom = $('#accomplishment').val().replace(/\n/g, '_@').replace(/\r/g, '_#');
	accom = accom.replace(/_@/g, '<br/>');

	console.log(accom);
	var m = $("#choose_project_to_fill").find("option:selected").text();
	console.log(workload + allocated + actual);
	if (m == 'Choose project') {
		Materialize.toast('Please Select Project!', 3000, 'round');
		//alert('Please Select Project!');
	} else {
		if (allocated == "" | actual == "") {
			Materialize.toast('Please fill out!', 3000, 'round');
			//	alert('Please fill out!');
		} else {

			if (allocated.substr(allocated.length - 1, 1) != '%') {
				allocated = allocated + "%";
			}
			if (actual.substr(actual.length - 1, 1) != '%') {
				actual = actual + "%";
			}

			var user_current = null;
			user_current = AV.User.current();
			var user = user_current.get('username');
			var Member = AV.Object.extend('Member');
			var query_member = new AV.Query(Member);
			query_member.equalTo('project', m);
			query_member.find({
				success: function(result) {
					if (result.length > 0) {

						for (var i = 0; i < result.length; ++i) {
							if (result[i].get('name') == user) {

								var mem = result[i];
								mem.set('allocated', allocated);
								mem.set('actual', actual);
								mem.set('workload', workload);
								mem.set('accom', accom);
								mem.save(null, {
									success: function() {
										//alert('Submit successfully!');
										Materialize.toast('Submit successfully!', 3000, 'round');

										fillclear();
									},
									error: function() {
										console.log("Sumbit failed!");
									}
								})
							}
						}
					}
				},
				error: function(error) {


				}
			});
		}
	}

}

function fillclear() {
	$("#fillproject_sm").text("DEL/SM: ");
	$("#fillproject_gdcm").text("GDC Manager:　");
	$('#allocated').attr('placeholder', '');
	$('#actual').attr('placeholder', '');
	$('#allocated').val('');
	$('#actual').val('');
	$('#workload').val('auto');
	$('#accomplishment').val('');
	$('#choose_project_to_fill').find("option[text='Choose project']").attr('selected', 'selected');
	$('#choose_project_to_fill').val('');
}


/*---------------------------------------------query project---------------------------------------------*/
function showQueryProject() {
	$('.showorhidden').addClass('hide');
	$('#queryProject').removeClass('hide');
	$('#hey tr').remove();
	form_accomplish()
	test(); //get which projrct that user belong to 
	get_asManager(); //get which project that user mamnge 
}

function send() {
	//	var sa = $('#hey').html();
	//	console.log(sa);
	$("#href").attr("href", "mailto:?subject=Weekly report &body=");

}


//get all member's accomplishment into project's accomplishments
function form_accomplish() {

	var Project = AV.Object.extend('Project');
	var query_project = new AV.Query('Project');
	query_project.find({
		success: function(result) {
			//console.log(result.length);
			for (var i = 0; i < result.length; ++i) {
				var project = result[i];
				search_member(project, function(pp, acco) {
					console.log(pp.get("projectName") + ": " + acco);
					pp.set('Accomplishments', acco);
					pp.save({
						success: function() {
							//	console.log(pp.get("projectName") + 'successfully');
						},
						error: function() {
							console.log('error');
						}
					});
				});
			}



		},
		error: function(error) {
			console.log("error");
		}
	});


	function search_member(project, callback) {

		var Member = AV.Object.extend('Member');
		var query_member = new AV.Query('Member');
		query_member.equalTo('project', project.get('projectName'));
		query_member.find({
			success: function(result) {
				console.log(project.get('projectName') + " has member is :" + result.length);
				if (result.length > 0) {
					var accomplish = '';
					for (var i = 0; i < result.length; ++i) {
						if (result[i].get('accom') != null) {
							accomplish += result[i].get('name') + ":  <br/>" + result[i].get('accom') + '<br/>';
							//							console.log(accomplish);
						}

					}
					//console.log(accomplish);
					callback(project, accomplish);
				}

			},
			error: function(error) {
				console.log(error);
			}
		});

	}
}

// 显示该用户存在的Project  
function test() {
	//	var project_delsm = null;
	//	var project_gdc = null;
	//	var project_accomplish = null;
	//	var project_delsm = null;
	//	var project_name=null;
	//	var member_count = null;

	var user_current = null;
	user_current = AV.User.current();
	var user = user_current.get('username');
	//console.log("current user name is " + user);


	var Member = AV.Object.extend('Member');
	var query_m_p = new AV.Query(Member);
	query_m_p.equalTo('name', user);
	query_m_p.find({
		success: function(result) {
			console.log("as Member of project is " + result.length + "times");
			if (result.length > 0) {

				for (var i = 0; i < result.length; ++i) {
					var p = result[i].get('project');
					//找出身为member所在的project
					console.log(p);
					//查找project的相关信息

					//查找member中 该project的member个数 及信息；
					search(p, function(JSONObject, project) {
						console.log(JSONObject);
						var members = $.parseJSON(JSONObject);
						console.log(members.member);
						console.log("member.length= " + members.member.length);
						member_count = members.member.length;
						//						console.log(members.member[0].name);
						show(members.member, project, function(p_info, all_member) {
							var all_member_count = all_member.length;
							console.log(p_info.get('DELSM'));
							console.log(p_info.get('manager'));
							console.log(p_info.get('Accomplishments'));
							var project_delsm = p_info.get('DELSM');
							var project_gdc = p_info.get('manager');
							var project_accomplish = p_info.get('Accomplishments');
							var project_name = p_info.get('projectName');
							//							console.log("adjsjaldlasda");
							if (all_member_count == 0) {
								var htmlString = '<tr><td>' + project_name + '</td><td>' + project_delsm + '</td><td>' + project_gdc + '</td><td></td><td></td><td></td><td></td><td></td></tr>';
								//这个project没有member的情况要单独写一个html字符串
								$("#hey").append(htmlString);
							}
							if (all_member_count > 0) {
								var member0 = all_member[0];
								//								console.log(members.member[0].name);
								var htmlstring = '<tr><td name="project" rowspan="' + all_member_count + '">' + project_name + '</td ><td rowspan="' + all_member_count + '">' + project_delsm + '</td><td rowspan="' + all_member_count + '">' + project_gdc + '</td><td>' + member0.name + '</td><td>' + member0.allocated + '</td><td>' + member0.actual + '</td><td>' + member0.workload + '</td><td rowspan="' + all_member_count + '">' + project_accomplish + '</td></tr>';
								//console.log(htmlstring);
								$('#hey').append(htmlstring);


								if (all_member_count > 1) {
									for (var i = 1; i < all_member_count; ++i) {
										var memberi = all_member[i];
										//										console.log(members.member[i].name + members.member[i].allocated);
										var htmlstring = '<tr><td>' + memberi.name + '</td><td>' + memberi.allocated + '</td><td>' + memberi.actual + '</td><td>' + memberi.workload + '</td></tr>'
										console.log(htmlstring);
										$('#hey').append(htmlstring);
									}
								}

							}

							//							var htmlstring = '<tr><td name="project" rowspan="' + member_count + '">' + p + '</td ><td rowspan="' + member_count + '">' + project_delsm + '</td><td rowspan="' + member_count + '">' + project_gdc + '</td><td rowspan="' + member_count + '">' + project_accomplish + '</td></tr>';
							//
							//							console.log(htmlstring);
							//							$('#hey').append(htmlstring);
						});
					});
					//											console.log("member.length= "+member_count);

				}
			}

		},
		error: function(error) {
			console.log('error');
		}

	});

}



function show(members, p, callback) {
	var p_info = null;
	var Project = AV.Object.extend('Project');
	var query_project = new AV.Query("Project");
	query_project.equalTo('projectName', p);
	query_project.find({
		success: function(result) {
			//console.log(result.length);
			if (result.length > 0) {
				p_info = result[0];
				//	console.log(p_info.get('DELSM'));
				//	console.log(p_info.get('manager'));
				//	console.log(p_info.get('Accomplishments'));
			}
			callback(p_info, members);
		},
		error: function(error) {
			console.log(error);
		}
	});

}

function search(p, callback) {
	var member_length = null;
	var member = null;
	//console.log(p);
	var jsonObject = '{"projectName":"' + p + '","member":[';
	var Member = AV.Object.extend('Member');
	var query_member = new AV.Query('Member');
	query_member.equalTo('project', p);
	query_member.find({
		success: function(result) {
			member_length = result.length;
			//console.log(member_length);

			if (member_length > 0) {
				for (var i = 0; i < member_length; i++) {
					member = result[i];
					var memberJSON = '{"name":"' + member.get('name') + '","allocated":"' + member.get('allocated') + '","actual":"' + member.get('actual') + '","workload":"' + member.get('workload') + '"}';
					//					console.log(member.get('name'));
					//					console.log(member.get('allocated'));
					//					console.log(member.get('actual'));
					jsonObject += memberJSON;
					if (i < member_length - 1) {
						jsonObject += ',';
					}
				}
			}
			jsonObject += ']}';
			callback(jsonObject, p);
		},
		error: function(error) {
			console.log(error);
			callback(undefined);
		}
	});


}



function get_asManager() {
	var user_current = null;
	user_current = AV.User.current();
	var user = user_current.get('username');
	//console.log(user);
	var pro = document.getElementsByName('project');
	console.log("has exist project is :" + pro.length);
	//console.log(pro);
	var Project = AV.Object.extend('Project');
	var query_p_m = new AV.Query(Project);
	query_p_m.equalTo('manager', user);
	query_p_m.find({
		success: function(result) {
			console.log("as manger project is :" + result.length);
			if (result.length > 0) {
				for (var i = 0; i < result.length; ++i) {
					var p_name = result[i];
					//as manager has projects
					//	console.log(p_name.get('projectName'));

					lp_member(p_name, user, function(ismember, projName) {
						console.log(projName.get('projectName') + " is member ?:" + ismember);

						if (ismember == false) {
							console.log("Manager project name is " + projName.get('projectName'));
							//present as manager project that not as member.
							//search table Member, get the members of the project
							var Member = AV.Object.extend('Member');
							var query_m = new AV.Query('Member');
							query_m.equalTo('project', projName.get('projectName'));
							query_m.find({
								success: function(result) {
									if (result.length == 0) {
										var htmlstr = '<tr><td>' + projName.get('projectName') + '</td><td>' + projName.get('DELSM') + '</td><td>' + projName.get('manager') + '</td><td></td><td></td><td></td><td></td><td></td></tr>';
										$('#hey').append(htmlstr);
										console.log(result.length);
									}
									if (result.length > 0) {
										var htmlstr = '<tr><td rowspan="' + result.length + '">' + projName.get('projectName') + '</td><td rowspan="' + result.length + '">' + projName.get('DELSM') + '</td><td rowspan="' + result.length + '">' + projName.get('manager') + '</td><td>' + result[0].get('name') + '</td><td>' + result[0].get('allocated') + '</td><td>' + result[0].get('actual') + '</td><td>' + result[0].get('workload') + '</td><td rowspan="' + result.length + '">' + projName.get('Accomplishments') + '</td></tr>';

										$('#hey').append(htmlstr);

										if (result.length > 1) {
											console.log(result.length);
											for (var i = 1; i < result.length; ++i) {
												var htmlstr = '<tr><td>' + result[i].get('name') + '</td><td>' + result[i].get('allocated') + '</td><td>' + result[i].get('actual') + '</td><td>' + result[i].get('workload') + '</td></tr>';
												$('#hey').append(htmlstr);
											}

										}

									}

								},
								error: function(error) {
									console.log(error);
								}
							});

						}



					});

				}
			}
		},
		error: function(error) {
			console.log('error');
		}
	});

}

function lp_member(p_name, user, callback) {

	//console.log(p_name.get('projectName'));
	var Member = AV.Object.extend('Member');
	var look_member = new AV.Query('Member');
	look_member.equalTo("project", p_name.get('projectName'));
	look_member.find({
		success: function(result) {
			var isMember = false;
			if (result.length > 0) {
				console.log(p_name.get('projectName') + "length = " + result.length);

				for (var i = 0; i < result.length; ++i) {
					var msm = result[i];
					if (msm.get('name') == user) {
						console.log("name equals");
						isMember = true;
					}
					console.log(p_name.get('projectName') + msm.get('name'));

				}

			}

			callback(isMember, p_name);


		},
		error: function(error) {
			console.log(error);
		}
	});


}

//if you are manager,if not you have no permission
//search all projects' information
function get_all() {

	var user_current = null;
	user_current = AV.User.current();
	var user = user_current.get('username');
	var Manager = AV.Object.extend('Manager');
	var query_is_mananger = new AV.Query('Manager');
	query_is_mananger.equalTo('username', user);
	query_is_mananger.find({
		success: function(result) {
			console.log(result.length);
			if (result.length == 0) {
				alert("Sorry,You don't have permission!");
			} else {
				$('#hey tr:eq(0)').nextAll().remove();
				var Project = AV.Object.extend('Project');
				var query_project = new AV.Query('Project');
				query_project.find({
					success: function(result) {
						//console.log(result.length);
						for (var i = 0; i < result.length; ++i) {
							var project = result[i];
							get_member(project);
						}
					},
					error: function(error) {
						console.log(error);
					}
				});

				function get_member(project, callback) {

					var Member = AV.Object.extend('Member');
					var query_m = new AV.Query('Member');
					query_m.equalTo('project', project.get('projectName'));
					query_m.find({
						success: function(result) {
							if (result.length == 0) {
								var htmlstr = '<tr><td>' + project.get('projectName') + '</td><td>' + project.get('DELSM') + '</td><td>' + project.get('manager') + '</td><td></td><td></td><td></td><td></td><td></td></tr>';
								$('#hey').append(htmlstr);
								//	console.log(result.length);
							}
							if (result.length > 0) {
								var htmlstr = '<tr><td rowspan="' + result.length + '">' + project.get('projectName') + '</td><td rowspan="' + result.length + '">' + project.get('DELSM') + '</td><td rowspan="' + result.length + '">' + project.get('manager') + '</td><td>' + result[0].get('name') + '</td><td>' + result[0].get('allocated') + '</td><td>' + result[0].get('actual') + '</td><td>' + result[0].get('workload') + '</td><td rowspan="' + result.length + '">' + project.get('Accomplishments') + '</td></tr>';

								$('#hey').append(htmlstr);

								if (result.length > 1) {
									console.log(result.length);
									for (var i = 1; i < result.length; ++i) {
										var htmlstr = '<tr><td>' + result[i].get('name') + '</td><td>' + result[i].get('allocated') + '</td><td>' + result[i].get('actual') + '</td><td>' + result[i].get('workload') + '</td></tr>';
										$('#hey').append(htmlstr);
									}

								}

							}

						},
						error: function(error) {
							console.log(error);
						}
					});
				}
			}
		},
		error: function(error) {
			console.log(error);
		}
	});


}

/*weekly clear  successfully*/
function weeklyclear() {


	var TestObject = AV.Object.extend('TestObject');
	var clearquery = new AV.Query('TestObject');
	clearquery.find({
		success: function(result) {
			console.log(result.length);
			for (var i = 0; i < result.length; ++i) {
				result[i].unset('name');
				console.log('success');
				result[i].save();
			}
		},
		error: function(error) {
			console.log(error);
		}
	});

}