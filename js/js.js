let start = document.getElementById("start"),
    game = document.getElementById("game"),
    gamecont = document.getElementById("gamecont");
let total = document.getElementById("total"),
    history = document.getElementById("history");
let goBack = document.getElementById("goBack"),
    resetGame = document.getElementById("reset");
let markBack = document.getElementById("markBack"),
    markReset = document.getElementById("markReset"),
    overScore = document.getElementById("overScore"),
    freHistory = document.getElementById("freHistory"),
    wrapmark = document.getElementById("wrapmark");

let startRender = (function () {
    let fourBtn = document.getElementById("fourBtn"),
        fiveBtn = document.getElementById("fiveBtn");
    return {
        init: function () {
            history.innerHTML = localStorage.getItem('coyotescore');
            start.style.display = 'block';
            game.style.display = 'none';
            wrapmark.style.display = 'none';
            fourBtn.ontouchstart = touchstar.bind(fourBtn, createCell.bind(fourBtn, fourBtn.getAttribute('data-cell'), start));
            fiveBtn.ontouchstart = touchstar.bind(fiveBtn, createCell.bind(fiveBtn, fiveBtn.getAttribute('data-cell'), start));
        }
    }
})();
let gameRender = (function () {
    let cell = gamecont.getElementsByClassName("cell");
    return {
        init: function (num = 4) {
            start.style.display = 'none';
            game.style.display = 'block';
            wrapmark.style.display = 'none';
            gamecont.setAttribute('num', num);
            gamecont.ontouchstart = touchstar.bind(gamecont, handleSum);
            goBack.ontouchstart = touchstar.bind(goBack,goMain);
            resetGame.ontouchstart = touchstar.bind(resetGame,resetPlay);
            markReset.ontouchstart = touchstar.bind(markReset,resetPlay);//重新开始
            markBack.ontouchstart = touchstar.bind(markBack,goMain);

        }
    }
})();
startRender.init();
document.ontouchstart = document.ontouchmove = document.ontouchend = (ev) => {
    ev.preventDefalut ? ev.preventDefalut() : ev.returnValue = false;
};