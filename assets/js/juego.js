const modulo = (() => {
    'use strict'
    /*
 * 2C = 2 de trebol
 * 2D = 2 de diamantes
 * 2H = 2 de corazones
 * 2S = 2 de pica
 */

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K']  
    let puntosJugadores = [];

    //Referencias de HTML
    const btnPedir = document.querySelector('#btnPedir'),   
         btnDetener = document.querySelector('#btnDetener'),
         btnNuevo = document.querySelector('#btnNuevo'),
         divJugadorCartas = document.querySelectorAll('.divCartas'),
         puntosHTML = document.querySelectorAll('small');


    //esta funcion inicializa el juego
    const inicializarJuego = ( numJugadores = 2 ) => {       
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i < numJugadores; i++ ) {
            puntosJugadores.push(0);
        };
        puntosHTML.forEach( elem => elem.textContent = 0 );
        divJugadorCartas.forEach(elem => elem.textContent = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
    //crear deck
    const crearDeck = () => {
        deck = [];
        for( let i = 2; i <= 10; i++ ){
            for( let tipo of tipos) {
                deck.push( i + tipo );
            }
        };
        for( let tipo of tipos) {
            for( let especial of especiales) {
                deck.push( especial + tipo)
            }
        };   
        return _.shuffle( deck );
    }

    //Esta función me permite tomar una carta

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'no hay cartas en el deck';
        }             
        return deck.pop();
    }

    //Esta funcioón nos permite saber el valor de la carta

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ?
                ( valor === 'A' ) ? 11 :10
                : valor * 1;
    };

    //esta funcion nos indica el turno de la computadora

    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].textContent = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = ( carta, turno ) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `/assets/cartas/${carta}.png`;
        divJugadorCartas[turno].append( imgCarta );
    };

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {

            if( puntosMinimos === 21 || puntosComputadora > 21 ){
                window.alert("Ganaste!");
            }else if(puntosComputadora === puntosMinimos) {
                window.alert("Nadie gana");
            }else if(puntosComputadora === 21 || puntosComputadora > puntosMinimos && puntosComputadora <= 21 || puntosMinimos > 21) {
                window.alert("Perdiste!");
            }

        }, 55);
    }

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos( carta, puntosJugadores.length - 1 );       
            crearCarta( carta, puntosJugadores.length - 1 );
           

            if(puntosMinimos > 21) {
                break;
            }
            
        } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );
        
        determinarGanador();
        
        
    };

    //Eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );

        crearCarta( carta, 0 );

        if(puntosJugador > 21){
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }else if( puntosJugador === 21) {
            console.warn('21, genial!');
            turnoComputadora( puntosJugador );
            btnPedir.disabled = true;
            btnDetener.disabled = true;
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    
    })

    // ganaste o perdiste

    return {
        nuevoJuego: inicializarJuego
    }

})();


