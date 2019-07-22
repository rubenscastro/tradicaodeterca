whoPicks();

function whoPicks() {
    var query = firebase.database().ref('queue').child('currentPosition');
    query.once("value")
    .then(function(snapshot) {
        var currentPosition = snapshot.val().currentPosition;
        var currentPick = firebase.database().ref('queue').child('positions').child(currentPosition);
        currentPick.once("value").then(function(snapshot) {
            var userPick = snapshot.val().user;
            $("#nome").text("Bem-vindo, " + window.user.displayName);

            if(window.user.displayName == userPick) {
                $("#pick").html("Você escolhe a próxima tradição!");
            } else {
                $("#pick").html("A próxima escolha é de " + userPick);
            }

            $(".loader").css("display", "none");
            $(".conteudo").css("display", "flex");
        });
    });
}