listRanking();

function listRanking() {
    var query = firebase.database().ref('traditions');
    query.once("value")
    .then(function(snapshot) {

        var traditions = snapshot.val();
        var traditionsArr = Object.keys(traditions).map(function(key) {
            return [(key), traditions[key]];
        });

        function compare(a, b) { 
            if (a[1].rank < b[1].rank) 
                return 1; 
            if (a[1].rank > b[1].rank) 
                return -1; 
            return 0; 
        } 

        traditionsArr.sort(compare); 

        var i;
        for (i = 0; i < traditionsArr.length; ++i) {

            var tRestaurant = traditionsArr[i][1].restaurant;
            var tRank = traditionsArr[i][1].rank;
            var tPick = traditionsArr[i][1].user;
            var tDate = traditionsArr[i][1].date;

            var rankItem = "<li><div class='user'>" + tRestaurant + "</div>" +
                           "<div class='average'><span class='small'>média </span>" + tRank + "</div>" +
                           "</li>";

            $("#traditionRanking").append(rankItem);

        }

        $(".loader").css("display", "none");
        $(".conteudo").css("display", "flex");

    });

}