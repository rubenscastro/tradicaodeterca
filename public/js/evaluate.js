var query = window.location.search.substring(1);
var qs = parse_query_string(query);
var tradition = qs.tradition;

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

listTradition(tradition);

function listTradition(tradition) {
    var query = firebase.database().ref('traditions').child(tradition);
    query.once("value")
    .then(function(snapshot) {
        renderSingleSnapshot(snapshot.val());
    });

    var renderSingleSnapshot = function(singleSnapshot){
        var restaurant =  singleSnapshot.restaurant;
        var user =  singleSnapshot.user;
        var date = formatDate(singleSnapshot.date);

        function formatDate (input) {
            var datePart = input.match(/\d+/g),
            year = datePart[0].substring(2), // get only two digits
            month = datePart[1], day = datePart[2];
          
            return day+'/'+month+'/'+year;
          }

        $("h1#evaluate").text("Avaliar " + restaurant);
        $("pre#pick").text("Escolha de " + user + " em " + date);
    }
}

$("#sendEvaluation").click(function(e){

    var tTradition = tradition;
    var eAtendimento = parseInt(document.getElementById("eAtendimento").value);
    var eComida = parseInt(document.getElementById("eComida").value);
    var eTempo = parseInt(document.getElementById("eTempo").value);
    var eCusto = parseInt(document.getElementById("eCusto").value);
    var eLimonada = parseInt(document.getElementById("eLimonada").value);

    e.preventDefault();
    sendEvaluation(tTradition, eAtendimento, eComida, eTempo, eCusto, eLimonada);
});

function sendEvaluation(tradition, atendimento, comida, tempo, custo, limonada) {
    var data = {
        user: window.user.displayName,
        atendimento: atendimento,
        comida: comida,
        tempo: tempo,
        custo: custo,
        limonada: limonada,
        userAverage: (atendimento + comida + tempo + custo + limonada)/5
    }
    
    return firebase.database().ref('traditions').child(tradition).child('evaluations').push(data).then(function(){
        window.location.replace('/vote.html');
    }).catch(function (error){
        alert("Houve um problema ao fazer a avaliação. " + error);
    });;
}