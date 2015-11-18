$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
});


function cancel() {
	window.location.href = "index.html";
}

function register() {
	//得到注册的用户名 密码
	var username = document.getElementById("icon_name");
	var pwd = document.getElementById("icon_pwd");
	var confirm = document.getElementById("confirm_pwd");
	console.log(username.value);
	console.log(pwd.value);
	console.log(confirm.value);

if(pwd.value!=confirm.value){
	Materialize.toast('Password is not consistent', 3000, 'rounded');
}else{
	var user = new AV.User();
	user.set("username", username.value);
	user.set("password", pwd.value);


	user.signUp(null, {
		success: function(user) {
			// 注册成功，可以使用了.
			alert("注册成功！")
			window.location.href = "index.html";
		},
		error: function(user, error) {
			// 失败了
			alert("Error: " + error.code + " " + error.message);
		}
	});

}

	
}