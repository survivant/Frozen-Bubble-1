/*
 * 
 * Fichier config.js definissant toutes les configurations nécessaire pour
 * le jeu Frozen Bubble.
 * 
 */


var config = {
    debug: false,
    // La configuration de la fenetre de base
    windowConf: {
        width: 640,
        height: 480
    },
    // La configuration du Game_Controller 
    game: {
        totalLevels: 7
    },
    // id du main canvas
    gameCanvas: {
        id: 'main_canvas'
    },
    // Coordonnees des coins du terrain de jeu
    ballsField: {
        topLeft: {
            x: 197,
            y: 12
        },
        topRight: {
            x: 455,
            y: 10
        },
        bottLeft: {
            x: 197,
            y: 390
        },
        bottRight: {
            x: 455,
            y: 390
        }
    },
    // La taille et les coordonnées du shooter
    shooter: {
        top: 364,
        left: 275,
        width: 100,
        height: 100,
        maxRotationDegLeft: -70,
        maxRotationDegRight: 70
    },
    // La configuration du Player_Controller
    player: {
        constrols: {
            left: 37,
            right: 39,
            trigger: 38,
            secondTrigger: 32
        },
        // position du player
        top: 428,
        left: 412,
        // temps maximum pour les shoots
        timeToShoot: 5000,
        // vitesse angulaire du shooter
        rotationSpeedLoop: 8
    },
    // Les paramètres de configuration du Bubble_Controller
    bubbles: {
        // Nombre total de couleures differentes des bubbles
        totalTypes: 8,
        width: 32,
        height: 32,
        loopTime: 3,
        steepPx: 3
    },
    // Les paramètres de configuration du Compressor_Controller
    compressor: {
        // Position de l'axe X
        x: 200,
        // Position initiale de l'axe Y
        initY: -3,
        // Time in ms between compresor movements
        baseLoopTime: 30000,
        // temps de ms entre chaques tirs en fonction du lvl
        timeToDecreaseByLevel: 1500,
        width: 252,
        height: 51,
        // Les paramètres de configuration de l'extensor
        extensor: {
            x: 233,
            width: 188,
            height: 28
        }
    },
    // Les paramètres de configuration du BubblesGrid_Controller
    bubblesGrid: {
        // animation crash
        moveDestroyAnimation: 40,
        x: 198,
        heightCorrection: 4,
        minBubblesToBeConsideredAsGroup: 3,
    },
    // Configuration du score
    scoreBoard: {
        pointsByLevel: 100,
        pointsByBubble: 5,
        // positionnement du score
        x: 15,
        y: 100
    }
};
