$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
});

function login() {


	var username = document.getElementById("icon_name");
	var pwd = document.getElementById("icon_pwd");

	var myname = username.value;
	var mypass = pwd.value;
	console.log(myname);
	console.log(mypass);

	AV.User.logIn(myname, mypass, {
		success: function(user) {
			// 成功了，现在可以做其他事情了.
			console.log("successed");

			window.location.href = "Main.html";
		},
		error: function(user, error) {
			// 失败了.
			alert("密码或用户名不正确！");
		}
	});


}