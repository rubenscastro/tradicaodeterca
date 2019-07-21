var query = window.location.search.substring(1);
var qs = parse_query_string(query);
var tradition = qs.tradition;

listTraditionVotes(tradition);

function listTraditionVotes(tradition) {
    var query = firebase.database().ref('traditions').child(tradition);
    query.once("value")
    .then(function(snapshot) {

        evaluations = snapshot.val().evaluations;
        
        var evaluationsArr = Object.keys(evaluations).map(function(key) {
            return [(key), evaluations[key]];
        });
        var restaurant = snapshot.val().restaurant;
        var date = formatDate(snapshot.val().date);
        var userPick = snapshot.val().user;
        var currentUser = window.user.displayName;
        var evaluationsSum = 0;
        var rank = snapshot.val().rank;
                
        $("h1#restaurant").html(restaurant);
        $("pre#meta").html("Escolha de " + userPick + " em " + date);
        $("#restaurantAverage").append(rank);

        var i;
        for (i = 1; i < evaluationsArr.length; ++i) {

            var eUser = evaluationsArr[i][1].user;
            var eUserAverage = evaluationsArr[i][1].userAverage;
            evaluationsSum = evaluationsSum + eUserAverage;

            var userEvaluation = "<li><div class='user'>" + eUser + "</div>" +
                                 "<div class='average'><span class='small'>média </span>" + eUserAverage + "</div>" +
                                 "</li>";

            $("#usersEvaluations").append(userEvaluation);

        }

        // var evaluationsCount = evaluationsArr.length - 1;
        // var evaluationAverage = evaluationsSum / evaluationsCount;
        // var finalEvaluation = Math.round(evaluationAverage * 100) / 100

        // $("#restaurantAverage").append(finalEvaluation);

    });

}