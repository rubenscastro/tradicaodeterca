var restaurantsList;

if($("#restaurantsList").length > 0) {    
    restaurantsList = document.getElementById("restaurantsList");
}

var restaurant = document.getElementById("restaurantName");

listRestaurants();

$("#addButton").click(function(e){
    e.preventDefault();
    createRestaurant(restaurant.value);
});

function createRestaurant(restaurant) {
    var data = {
        name: restaurant
    }
    return firebase.database().ref().child('restaurants').push(data).then(function(){
        window.location.replace('/restaurants.html');
    }).catch(function (error){
        alert("Houve um problema ao criar o restaurante. " + error);
    });
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
        $("#restaurantsList").append(singleSnapshot);
    }
}

firebase.database().ref('restaurants').on('value', function(snapshot) {
    if($("#restaurantsList").length > 0) {    
        restaurantsList.innerHTML = '';
        snapshot.forEach(function (item){
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(item.val().name))
            restaurantsList.appendChild(li);
        });
    }
});