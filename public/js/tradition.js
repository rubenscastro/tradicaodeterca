var tDate = document.getElementById("tDate");
var tRestaurant = document.getElementById("tRestaurant");
var tPick = document.getElementById("tPick");

listUsers();
listRestaurants();

$("#addButton").click(function(e){
    e.preventDefault();
    createTradition(tDate.value, tRestaurant.value, tPick.value);
});

function createTradition(date, restaurant, pick) {
    var data = {
        date: date,
        restaurant: restaurant,
        user: pick,
        evaluations: [''],
        rank: 0
    }
    return firebase.database().ref().child('traditions').push(data).then(function(){
        window.location.replace('/vote.html');
    }).catch(function (error){
        alert("Houve um problema ao criar a tradição. " + error);
    });;
}

function listUsers() {
    var query = firebase.database().ref('users');
    query.once("value")
    .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
        $("#tPick").append('<option value="Tradição">Tradição - Escolha Extraordinária</option>');
        $(".loader").css("display", "none");
        $(".conteudo").css("display", "flex");
    });

    var renderSingleSnapshot = function(singleSnapshot){
        $("#tPick").append('<option value="' + singleSnapshot.val().name + '">' + singleSnapshot.val().name + '</option>');
    }
}

function listRestaurants() {
    var query = firebase.database().ref('restaurants');
    query.once("value")
    .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
        $(".loader").css("display", "none");
        $(".conteudo").css("display", "flex");
    });

    var renderSingleSnapshot = function(singleSnapshot){
        $("#tRestaurant").append('<option value="' + singleSnapshot.val().name + '">' + singleSnapshot.val().name + '</option>');
    }
}