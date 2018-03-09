const arrayPersonajes = [
    {
        nombre: "abra",
        rutaImagen: "img/abra.png"
    },
    {
        nombre: "bullbasaur",
        rutaImagen: "img/bullbasaur.png"
    },
    {
        nombre: "charmander",
        rutaImagen: "img/charmander.png"
    },
    {
        nombre: "dratini",
        rutaImagen: "img/dratini.png"
    },
    {
        nombre: "eevee",
        rutaImagen: "img/eevee.png"
    },
    {
        nombre: "jigglypuff",
        rutaImagen: "img/jigglypuff.png"
    },
    {
        nombre: "mankey",
        rutaImagen: "img/mankey.png"
    },
    {
        nombre: "meowth",
        rutaImagen: "img/meowth.png"
    },
    {
        nombre: "pidgey",
        rutaImagen: "img/pidgey.png"
    },
    {
        nombre: "pikachu-2",
        rutaImagen: "img/pikachu-2.png"
    },
    {
        nombre: "psyduck",
        rutaImagen: "img/psyduck.png"
    },
    {
        nombre: "squirtle",
        rutaImagen: "img/squirtle.png"
    } 
]

const game = document.getElementById("game");
const rejilla = document.createElement("section");
const ganador = document.getElementById("ganador");
var contador = 0;
var primerSeleccionado = "";
var segundoSeleccionado = "";
var selPrevio = null;
var segundos = 120;
const song = document.getElementById("song");
const fail = document.getElementById("fail");
const winner = document.getElementById("winner");
var botonIniciar = document.getElementById("iniciar");
const reloj = document.getElementById("reloj");
const perdedor = document.getElementById("perdedor");
var eliminados = 0;

//Creación de la clase rejilla y un div para cada personaje a partir de un array
rejilla.setAttribute("class","rejilla");
game.appendChild(rejilla);

//
function barajar() {
    document.getElementById("comentario").style.display = "none";

    const doblePersonajes = arrayPersonajes.concat(arrayPersonajes).sort(()=> 0.5 - Math.random());

    doblePersonajes.forEach(personaje => {
        const { nombre, rutaImagen } = personaje;
    
        tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");
        tarjeta.dataset.name = nombre;
        anverso = document.createElement("div");
        anverso.classList.add("anverso");
        reverso = document.createElement("div");
        reverso.classList.add("reverso");
        reverso.style.backgroundImage = `url(${rutaImagen})`;
        rejilla.appendChild(tarjeta);
        tarjeta.appendChild(anverso);
        tarjeta.appendChild(reverso);
    });
    rejilla.classList.remove("fuera");
    botonIniciar.style.display = "none"
    reloj.style.display = "initial"
    perdedor.style.opacity = "0";
    eliminados = 0;
    ganador.classList.remove("open");
    song.currentTime = 0;
    song.play();
}


//Función de reloj cuenta ataras
function cuentaAtras() {
    var s = parseInt(segundos % 60);
    var ss = ("0" + s).slice(-2);
    var m = parseInt(segundos / 60);
    var mm = ("0" + m).slice(-2);

    reloj.innerHTML = mm + ":" + ss;

    if(eliminados === 24) {
        return;
    }

    if (segundos > 0) {
        var t = setTimeout(function(){
            cuentaAtras();    //Recursividad
        },1000);   
    } else {
        gameOver();
    }
    segundos--; 
}

//Función para declarar la lógica de game over
function gameOver() {
    segundos = 120;
    rejilla.classList.add("fuera");
    botonIniciar.style.display = "initial"
    reloj.style.display = "none"
    perdedor.style.opacity = "1";
    setTimeout(function(){
        while(rejilla.firstChild) {
            rejilla.removeChild(rejilla.firstChild);
        }
    },1000);
    song.pause();
    fail.currentTime = 0;
    fail.play();
}

//Logica para el evento click de seleccion de cada personaje
rejilla.addEventListener("click", function(evento){
    var seleccionado = evento.target;

    if (seleccionado.nodeName === "SECTION" || 
        seleccionado.parentNode === selPrevio ||
        seleccionado.parentNode.classList.contains("eliminado")) {
        return;
    }

    if (contador < 2) {
        contador++;
        if (contador === 1) {
            primerSeleccionado = seleccionado.parentNode.dataset.name;
            seleccionado.parentNode.classList.add("seleccionado");
            selPrevio = seleccionado.parentNode;
        } else {
            segundoSeleccionado = seleccionado.parentNode.dataset.name;
            seleccionado.parentNode.classList.add("seleccionado");
        }

        if (primerSeleccionado !== "" && segundoSeleccionado !== "") {
            if (primerSeleccionado === segundoSeleccionado) {
                setTimeout(eliminar, 1200);
                setTimeout(resetSelec, 1200);
                contEliminados();
            } else {
                setTimeout(resetSelec, 1200);
                selPrevio = null;
            }
        } 
        // selPrevio = seleccionado.parentNode;
    }
});

//Función para asignar la clase eliminado cuando exista una coincidencia
var eliminar = function () {
    var eliminados = document.querySelectorAll(".seleccionado");
    eliminados.forEach(eliminado => {
        eliminado.classList.add("eliminado");
    });
}

//Función para resetear los seleccionados cuando no coincidan
var resetSelec = function () {
    primerSeleccionado = "";
    segundoSeleccionado = "";
    contador = 0;

    var seleccionados = document.querySelectorAll(".seleccionado");
    seleccionados.forEach(seleccionado => {
        seleccionado.classList.remove("seleccionado");
    });
}

//Función para contar los eliminados y determinar cuando acaba el juego con exito
var contEliminados = function () {
    eliminados = document.querySelectorAll(".eliminado").length + 2;
    if (eliminados === 24) {
        segundos = 120;    
        rejilla.classList.add("fuera");
        botonIniciar.style.display = "initial";
        reloj.style.display = "none";
        song.pause();
        setTimeout(function(){
            ganador.classList.add("open");
            winner.currentTime = 0;
            winner.play();
        },1500);   
        setTimeout(function(){
            while(rejilla.firstChild) {
                rejilla.removeChild(rejilla.firstChild);
            }
        },1000);
    }
}


