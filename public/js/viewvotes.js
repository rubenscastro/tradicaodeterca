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

        function compare(a, b) { 
            if (a[1].userAverage < b[1].userAverage) 
                return 1; 
            if (a[1].userAverage > b[1].userAverage) 
                return -1; 
            return 0; 
        }

        evaluationsArr.sort(compare); 

        var restaurant = snapshot.val().restaurant;
        var date = formatDate(snapshot.val().date);
        var userPick = snapshot.val().user;
        var currentUser = window.user.displayName;
        var evaluationsSum = 0;
        var rank = snapshot.val().rank;
        var rank2 = rank.toFixed(2);
                
        $("h1#restaurant").html(restaurant);
        $("pre#meta").html("Escolha de " + userPick + " em " + date);
        $("#restaurantAverage").append(rank2);

        var i;
        for (i = 1; i < evaluationsArr.length; ++i) {

            var eUser = evaluationsArr[i][1].user;
            var eUserAverage = evaluationsArr[i][1].userAverage;
            var eUserAverage2 = eUserAverage.toFixed(2);

            var eAtendimento = evaluationsArr[i][1].atendimento;
            var eComida = evaluationsArr[i][1].comida;
            var eCusto = evaluationsArr[i][1].custo;
            var eTempo = evaluationsArr[i][1].tempo;
            var eLimonada = evaluationsArr[i][1].limonada;

            if(!eLimonada) {
                eLimonada = "-";
            }

            var userEvaluation = "<li><div class='user'>" + eUser + "</div>" +
                                 "<div class='average'><span class='small'>média </span>" + eUserAverage2 + 
                                 " <span class='viewMore' data-evaluation='" + i + "'>+</span></div>" +
                                 "<div class='evaluationMore' data-evaluation='" + i + "'>" + 
                                    "<div class='evaluationMoreHeader'>" + 
                                        "<div>A</div>" +
                                        "<div>C</div>" +
                                        "<div>C/B</div>" +
                                        "<div>T</div>" +
                                        "<div>LS</div>" +
                                    "</div>" + 
                                    "<div class='evaluationMoreContent'>" + 
                                        "<div>" + eAtendimento + "</div>" +
                                        "<div>" + eComida + "</div>" +
                                        "<div>" + eCusto + "</div>" +
                                        "<div>" + eTempo + "</div>" +
                                        "<div>" + eLimonada + "</div>" +
                                    "</div>" + 
                                 "</div>" +
                                 "</li>";

            $("#usersEvaluations").append(userEvaluation);

        }
        

        $(".viewMore").on('click', function(){
            var evaluationNumber = $(this).data("evaluation");
            var content = $(this).html();

            if(content == "+") {
                $(".evaluationMore[data-evaluation=" + evaluationNumber + "]").css("display", "block");
                $(this).html("-");
            } else {
                $(".evaluationMore[data-evaluation=" + evaluationNumber + "]").css("display", "none");
                $(this).html("+");
            }
        });

        $(".loader").css("display", "none");
        $(".conteudo").css("display", "flex");

    });

    

}