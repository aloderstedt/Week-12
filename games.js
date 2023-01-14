class Game {
    constructor(title, genre, platform) {
        this.title = title;
        this.genre = genre;
        this.platform = platform;
    }
}

class GameService {
    static url = "https://63bf8262a177ed68abb24750.mockapi.io/api/CRUD/game"

    static getAllGames() {
        return $.get(this.url);
    }

    static getGame(id) {
        return $.get(this.url + `/${id}`)
    }

    static deleteGame(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: `DELETE`
        })
    }

    static createGame(game) {
        return $.post(this.url, game);
    }

    static updateGame(game) {
        return $.ajax({
            url: this.url + `/${game.id}`,
            dataType: `json`,
            data: JSON.stringify(game),
            contentType: `application/json`,
            type: `PUT`
        })

    }
}

class DOMManager {
    static games;

    static getAllGames() {
        return GameService.getAllGames().then(games => this.render(games));
    }

    static createGame(title, genre, platform) {
        GameService.createGame(new Game(title, genre, platform))
            .then(() => {
                return GameService.getAllGames();
            })
            .then((games) => this.render(games));
    }

    static deleteGame(id) {
        GameService.deleteGame(id)
            .then(() => {
                return GameService.getAllGames();
            })
            .then((games) => this.render(games));
    }
    static render(games) {
        console.log(games);
        this.games = games;
        $('#app').empty();
        for (let game of games) {
            $('#app').prepend(
                `<div id="${game.id}" class="col-12"> <br> <hr>
                    <div class="card-header col">
                        <h6>Title : ${game.title} <br>Genre : ${game.genre} <br>Platform(s) : ${game.platform}</h6>
                        <button class="btn btn-warning" onclick="DOMManager.deleteGame('${game.id}')">Delete</button>
                    </div>
                </div>
                `
            );
        }
    }
}

$('#create-new-game').click(() => {
    DOMManager.createGame($('#new-game-title').val(), $('#new-game-genre').val(), $('#new-game-platform').val());
    $('#new-game-title').val(''), $('#new-game-genre').val(''), $('#new-game-platform').val('');
});

DOMManager.getAllGames();