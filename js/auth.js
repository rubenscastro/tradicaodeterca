var email = document.getElementById("emailInput");
var password = document.getElementById("passwordInput");
var nameS = document.getElementById("nameInput");

$("#createAccount").click(function(e){
    e.preventDefault();
    createAccount(email.value, nameS.value, password.value);
});

function createAccount(email, name, password) {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function () {
            alert("Conta criada com sucesso!");
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: name
            }).then(function(){
                createUser(email, name);
            });
            
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert("Falha ao criar conta");
        });
}

function createUser(email, name) {
    var data = {
        email: email,
        name: name,
        displayName: name
    }
    firebase.database().ref().child('users').push(data).then(function(){
        window.location.replace('/index.html');
    });
}

$("#loginButton").click(function(e){
    e.preventDefault();
    login(email.value, password.value);
});

function login(email, password) {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function () {
            window.location.replace('/index.html');
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert("Falha ao logar. Tente novamente.");
        });
}