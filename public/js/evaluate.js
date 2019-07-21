var query = window.location.search.substring(1);
var qs = parse_query_string(query);
var tradition = qs.tradition;
var date;
var restaurant;

listTradition(tradition);

function listTradition(tradition) {
    var query = firebase.database().ref('traditions').child(tradition);
    query.once("value")
    .then(function(snapshot) {
        renderSingleSnapshot(snapshot.val());
    });

    var renderSingleSnapshot = function(singleSnapshot){
        var user =  singleSnapshot.user;
        restaurant =  singleSnapshot.restaurant;
        date = formatDate(singleSnapshot.date);

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
    sendEvaluation(tTradition, date, restaurant, eAtendimento, eComida, eTempo, eCusto, eLimonada);
});

function sendEvaluation(tradition, date, restaurant, atendimento, comida, tempo, custo, limonada) {

    var userAverage;

    if(limonada) {
        userAverage = (atendimento + comida + tempo + custo + limonada)/5;
    } else {
        userAverage = (atendimento + comida + tempo + custo)/4;
        limonada = 0;
    }

    var data = {
        tradition: tradition,
        date: date,
        restaurant: restaurant,
        user: window.user.displayName,
        atendimento: atendimento,
        comida: comida,
        tempo: tempo,
        custo: custo,
        limonada: limonada,
        userAverage: userAverage
    }
    
    firebase.database().ref('traditions').child(tradition).child('evaluations').push(data).then(function(){
        updateRank(tradition, userAverage);
    }).catch(function (error){
        alert("Houve um problema ao fazer a avaliação. " + error);
    });;

}

function updateRank(tradition, evaluation) {

    var rankSum = 0;
    var tEvaluations = firebase.database().ref('traditions').child(tradition);
    tEvaluations.once("value")
    .then(function(snapshot) {
        var evaluationsArr = Object.keys(snapshot.val().evaluations).map(function(key) {
            return [(key), snapshot.val().evaluations[key]];
        });
        
        var i;
        for (i = 1; i < evaluationsArr.length; ++i) {
            var userAverage = evaluationsArr[i][1].userAverage;
            rankSum = rankSum + userAverage;
        }

        var evaluationsCount = evaluationsArr.length - 1;
        rankSum = rankSum / evaluationsCount;

        var data = {
            rank: rankSum
        }

        firebase.database().ref('traditions').child(tradition).update(data).then(function(){
            console.log("ranking atualizado com sucesso");
            window.location.replace('/viewTradition.html?tradition=' + tradition);
        }).catch(function(error){
            console.log("Ocorreu um erro ao atualizar o ranking" + error);
        });
    });

}

$(".slider").slider({
    min: 0,
    max: 5,
    create: function() {
        $(this).closest('.input').find('.ui-slider-handle').text('0');
    },
    slide: function( event, ui ) {
        $(this).closest('.input').find('.ui-slider-handle').text(ui.value);
        $(this).closest('.input').find('input').val(ui.value);
    }
});