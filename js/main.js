$(document).ready(function() {
	AV.initialize('LxpfQik9wwJivKv9dygidXCM', 'uHVT6193PNbwx6Wf5NnExCF5');
	var user_current = null;
user_current = AV.User.current();
document.getElementById("user").innerHTML = user_current.get('username');
});

