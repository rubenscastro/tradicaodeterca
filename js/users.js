var usersList = '';

if($("#usersList").length > 0) {   
    usersList = document.getElementById("usersList");
}

var username = document.getElementById("usernameInput");
var nameS = document.getElementById("passwordInput2");
var password = document.getElementById("passwordInput");

listUsers();

$("#addButton").click(function(e){
    e.preventDefault();
    createUser(username.value, nameS.value, password.value);
});

function createUser(username, name, password) {
    var data = {
        username: username,
        name: name,
        password: password
    }
    return firebase.database().ref().child('users').push(data);
}

function listUsers() {
    var query = firebase.database().ref('users');
    query.once("value")
    .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
    });

    var renderSingleSnapshot = function(singleSnapshot){
        $("#usersList").append(singleSnapshot);
    }
}

firebase.database().ref('users').on('value', function(snapshot) {
    if($("#usersList").length > 0) { 
        usersList.innerHTML = '';
        snapshot.forEach(function (item){
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(item.val().name))
            usersList.appendChild(li);
        });
    }
});