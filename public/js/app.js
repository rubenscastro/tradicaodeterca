// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAOK-vTAc0-bSXTrGz2GgawKQoW6QsAE5o",
    authDomain: "tradicaodeterca.firebaseapp.com",
    databaseURL: "https://tradicaodeterca.firebaseio.com",
    projectId: "tradicaodeterca",
    storageBucket: "tradicaodeterca.appspot.com",
    messagingSenderId: "200630685993",
    appId: "1:200630685993:web:1965fe51ed189748"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         //$(".batata").show();
//     } else {
//         //window.location.replace('/auth.html');
//     }
// });

var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

var user = firebase.auth().currentUser;
window.user = user;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var name = user.displayName;
    var email = user.email;
    window.user = user;
    $("#nome").text("Bem-vindo, " + name);
    if(sPage == 'auth.html') {
        window.location.replace("/index.html");
    }
  } else {
    if(sPage != 'auth.html' && sPage != "createAccount.html") {
        window.location.replace("/auth.html");
    }
  }
});




if(sPage != 'auth.html') {
    if (!window.user) {
        //window.location.replace('/auth.html');
    }
}

$("#logout").click(function(){
    firebase.auth().signOut()
        .then(function() {
            console.log("logout com sucesso")
            window.location.replace('/auth.html');
        })
        .catch(function(error) {
            alert("Ocorreu um erro ao tentar sair. Você está preso aqui para sempre");
        });
});

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
        query_string[key] = decodeURIComponent(value);
        // If second entry with this name
        } else if (typeof query_string[key] === "string") {
        var arr = [query_string[key], decodeURIComponent(value)];
        query_string[key] = arr;
        // If third or later entry with this name
        } else {
        query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0].substring(2), // get only two digits
    month = datePart[1], day = datePart[2];
  
    return day+'/'+month+'/'+year;
}