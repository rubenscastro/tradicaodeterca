var tDate = document.getElementById("tDate");
var tRestaurant = document.getElementById("tRestaurant");
var tPick = document.getElementById("tPick");

listTraditions();

function listTraditions() {
    var query = firebase.database().ref('traditions');
    query.once("value")
    .then(function(snapshot) {
    
        snapshot.forEach(renderSingleSnapshot);
        $(".loader").css("display", "none");
        $(".conteudo").css("display", "flex");

        traditionsArr.reverse();

        var k;
        for (k = 0; k < traditionsArr.length; ++k) {

            var id = traditionsArr[k][0];
            var user = traditionsArr[k][1].user;
            var restaurant = traditionsArr[k][1].restaurant;
            var date = formatDate(traditionsArr[k][1].date);

            var absences = traditionsArr[k][1].absences;

            if(absences) {
                var absencesArr = Object.keys(absences).map(function(key) {
                    return [(key), absences[key]];
                });

                var a;
                for (a = 0; a < absencesArr.length; ++a) {
                    var currentUser = window.user.displayName;
                    var abscent = absencesArr[a][1].user;
                    if(currentUser == abscent) {
                        traditionsArr[k][1].hasEvaluated = true;
                    }
                }

            }

            if(traditionsArr[k][1].hasEvaluated) {
                var traditionVoted = "<li class='tradition'> " +
                    "<div class='date'>" + date + "</div>" +
                    "<div class='restaurant'>" + user + " escolheu " + restaurant + "</div>" +
                    "<div class='vote'>"  + 
                    "<a class='btn btn-md btn-info' href='viewTradition.html?tradition=" + id + "'>Ver avaliação</a>" +
                    "</div>" +
                    "</li>";
                    $("#traditionsListVoted").append(traditionVoted);
            } else {
                var traditionsListToVote = "<li class='tradition'> " +
                    "<div class='date'>" + date + "</div>" +
                    "<div class='restaurant'>" + user + " escolheu " + restaurant + "</div>" +
                    "<div class='vote'>"  + 
                    "<a class='btn btn-md btn-success' href='evaluate.html?tradition=" + id + "'>Fazer avaliação</a>" +
                    "</div>" +
                    "</li>";
                    $("#traditionsListToVote").append(traditionsListToVote);
            }

        }


    });

    var traditionsArr;

    var traditions = firebase.database().ref('traditions');
    traditions.on("value", function(snapshot) {
        traditionsArr = Object.keys(snapshot.val()).map(function(key) {
            return [(key), snapshot.val()[key]];
        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    var renderSingleSnapshot = function(singleSnapshot){

        var evaluations = singleSnapshot.val().evaluations;
        var currentUser = firebase.auth().currentUser.displayName;

        console.log(currentUser);

        var evaluationsArr = Object.keys(evaluations).map(function(key) {
            return [(key), evaluations[key]];
        });
          
        var i;
        for (i = 0; i < evaluationsArr.length; ++i) {

            var evaluatedBy = evaluationsArr[i][1].user;
            var evaluationID = evaluationsArr[i][0];

            if(evaluatedBy == currentUser) {                
                var x;
                for (x = 0; x < traditionsArr.length; ++x) {

                    var evaluationsArr2 = Object.keys(traditionsArr[x][1].evaluations).map(function(key) {
                        return [(key), traditionsArr[x][1].evaluations[key]];
                    });

                    var y;
                    for (y = 0; y < evaluationsArr2.length; ++y) {
                        if(evaluationsArr2[y][0] == evaluationID) {
                            traditionsArr[x][1].hasEvaluated = true;
                        }
                    }
                }

            }

        }

    }

}