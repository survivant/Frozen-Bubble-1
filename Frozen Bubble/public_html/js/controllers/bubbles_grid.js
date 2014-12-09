var BubblesGrid_Controller = (function (inWinFunc, inGameOverFunc, inGameController) {
    // liste des bubbles
    // structure: [bubble.row + '-' + bubble.col]
    var bubbles = {};
    var bubblesTmp = null;
    // nombre de bubbles detectées
    var bubblesInGroup = null;
    // nombre de bubbles à supprimer dans le crash
    var bubblesToRemove = null;
    // The number of pixels for the Y axe that the bubbles will have as top
    var baseY = 0;

    // methode de l'animation de suppression du la zone a supprime 
    var removeBalls = function () {
        var minX = 999999;
        var maxX = 0;

        // retourne le score
        inGameController.addToScore(Object.keys(bubblesToRemove).length * config.scoreBoard.pointsByBubble);

        // création de l'animation
        for (bubble in bubblesToRemove) {
            if (bubblesToRemove.hasOwnProperty(bubble)) {
                var image = bubblesToRemove[bubble].getImage();

                if (image.getX() < minX) {
                    minX = image.getX();
                } else {
                    if (image.getX() > maxX) {
                        maxX = image.getX();
                    }
                }
            }
        }

        for (bubble in bubblesToRemove) {
            if (bubblesToRemove.hasOwnProperty(bubble)) {
                var imageToRemove = bubblesToRemove[bubble].getImage();
                var bubbleObj = bubblesToRemove[bubble];
                var targetX = 0;
                var targetY = imageToRemove.getY() - config.bubblesGrid.moveDestroyAnimation;

                if (imageToRemove.getX() < ((maxX + minX) / 2)) {
                    targetX = imageToRemove.getX() - config.bubblesGrid.moveDestroyAnimation;
                } else {
                    targetX = imageToRemove.getX() + config.bubblesGrid.moveDestroyAnimation;
                }

                bubblesToRemove[bubble].destroy(targetX, targetY);
            }
        }

        // lancement de la fonction win si il n'y a plus de boules
        if (Object.keys(bubbles).length === 0) {
            inWinFunc();
        }
    };

    // methode de vérification de collage des bulles (si elle est supportée par une autre)
    var isBubbleSupported = function (inBubbleInfo, inRightCheck) {
        var bubbleAtLateral = bubbles[(inBubbleInfo.row) + '-' + (inBubbleInfo.col - 1)];
        if (inRightCheck) {
            bubbleAtLateral = bubbles[(inBubbleInfo.row) + '-' + (inBubbleInfo.col + 1)];
        }
        var bubbleTopLeft = bubbles[(inBubbleInfo.row - 1) + '-' + (inBubbleInfo.col - 0.5)];
        var bubbleTopRight = bubbles[(inBubbleInfo.row - 1) + '-' + (inBubbleInfo.col + 0.5)];

        // retourne true si elle est supportée, false sinon
        return (
                (inBubbleInfo.row === 0) ||
                (bubbleTopLeft !== undefined) ||
                (bubbleTopRight !== undefined) ||
                ((bubbleAtLateral !== undefined) && isBubbleSupported(bubbleAtLateral, inRightCheck)));
    };

    //methode de vérification de collage des bulles (si elles est supportée par une autre ou pas)
    var downGroup = function (inParentGroup) {
        var bubblesToAdd = {};

        // Retirer les bubbles dans la grille des bubbles
        for (bubble in inParentGroup) {
            if (inParentGroup.hasOwnProperty(bubble)) {
                bubblesToRemove[bubble] = inParentGroup[bubble].bubble;

                delete bubbles[bubble];
            }
        }

        // Vérifiez si chaque bubbles est prise en charge par une autre en haut ou sur le côté
        for (bubble in bubbles) {
            if (bubbles.hasOwnProperty(bubble)) {
                var bubbleToCheck = bubbles[bubble];

                if (!isBubbleSupported(bubbles[bubble], true) && !isBubbleSupported(bubbles[bubble], false)) {
                    bubblesToAdd[bubble] = bubbleToCheck;
                }
            }
        }

        // recommencer dès qu'on ajoute une bubble
        if (Object.keys(bubblesToAdd).length > 0) {
            downGroup(bubblesToAdd);
        }
    };

    // vérifie si après un crash, un nouveau groupe de bubbles est crée ou pas
    var checkIfExistGroup = function (inBubbleInfo) {
        var currentType = inBubbleInfo.bubble.getType();
        var retBubbles = {};
        for (bubble in bubblesTmp) {
            if (
                    (bubblesTmp[bubble] !== null) &&
                    (bubblesTmp[bubble].bubble.getType() == currentType) &&
                    (Math.abs(bubblesTmp[bubble].col - inBubbleInfo.col) <= 1) &&
                    (Math.abs(bubblesTmp[bubble].row - inBubbleInfo.row) <= 1)) {

                retBubbles[bubble] = bubblesTmp[bubble];
                bubblesTmp[bubble] = null;

                var deepBubbles = checkIfExistGroup(retBubbles[bubble]);

                for (deepBubble in deepBubbles) {
                    if (deepBubbles.hasOwnProperty(deepBubble)) {
                        retBubbles[deepBubble] = deepBubbles[deepBubble];
                    }
                }
            }
        }

        return retBubbles;
    };

    var checkBallOutOfLimits = function (inBubbleInfo) {
        return ((inBubbleInfo.bubble.getImage().getY() + config.bubbles.height) > config.ballsField.bottLeft.y);
    };

    var moveToCell = function (inBubbleInfo, inSlice, inCheckGroup) {
        if (config.debug) {
            inBubbleInfo.bubble.getImage().setText(inBubbleInfo.col + ' - ' + inBubbleInfo.row);
        }

        // calcul la position et le déplacement de la bubble
        if (inSlice) {
            inBubbleInfo.bubble.getImage().moveTo(
                    (inBubbleInfo.col * config.bubbles.width) + config.bubblesGrid.x,
                    (inBubbleInfo.row * (config.bubbles.height - config.bubblesGrid.heightCorrection)) + baseY,
                    config.bubbles.loopTime,
                    null,
                    config.bubbles.steepPx);
        } else {
            inBubbleInfo.bubble.getImage().setPos(
                    (inBubbleInfo.col * config.bubbles.width) + config.bubblesGrid.x,
                    (inBubbleInfo.row * (config.bubbles.height - config.bubblesGrid.heightCorrection)) + baseY);
        }

        bubblesTmp = {};
        for (bubble in bubbles) {
            if (bubbles.hasOwnProperty(bubble)) {
                bubblesTmp[bubble] = bubbles[bubble];
            }
        }

        if (inCheckGroup) {
            // prend la liste des bubbles dans le groupe de bubbles
            bubblesInGroup = checkIfExistGroup(inBubbleInfo);

            if (Object.keys(bubblesInGroup).length >= config.bubblesGrid.minBubblesToBeConsideredAsGroup) {
                bubblesToRemove = {};
                downGroup(bubblesInGroup);
                removeBalls();
            } else {
                SoundManager_Tool.play(config.bubblesGrid.stickBubbleSnd);

                if (checkBallOutOfLimits(inBubbleInfo)) {
                    inGameOverFunc();
                }
            }
        }
    };

    var my = {
        // regarde si une collision est apparue
        checkCollision: function (inBubble) {
            for (bubble in bubbles) {
                if (bubbles[bubble].bubble.getImage().checkCollision(inBubble.getImage(), 'circle')) {
                    return bubbles[bubble];
                }
            }
            return false;
        },
        // ajout de la bubble lors de la collision
        addBubble: function (inBubble, inParentBubble) {
            var col = 0;
            var row = 0;
            var xDesp = 1;

            if (inParentBubble !== false) {
                var desp = 1;
                if (Math.abs(inParentBubble.bubble.getImage().getY() - inBubble.getImage().getY()) < (config.bubbles.height / 3)) {
                    row = inParentBubble.row;
                } else {
                    desp = 0.5;
                    if (inParentBubble.bubble.getImage().getY() < inBubble.getImage().getY()) {
                        row = inParentBubble.row + 1;
                    } else {
                        row = inParentBubble.row - 1;
                    }
                }

                if (inParentBubble.bubble.getImage().getX() > inBubble.getImage().getX()) {
                    col = inParentBubble.col - desp;
                } else {
                    col = inParentBubble.col + desp;
                }
            } else {
                col = Math.round((inBubble.getImage().getX() - config.bubblesGrid.x) / config.bubbles.width);
            }

            var bubble = {
                row: row,
                col: col,
                bubble: inBubble};

            bubbles[row + '-' + col] = bubble;
            moveToCell(bubble, false, true);
        },
        // deplacement de toutes les boules quand le compresseur bouge
        setBaseY: function (inY) {
            baseY = inY;

            for (bubble in bubbles) {
                if (bubbles.hasOwnProperty(bubble)) {
                    moveToCell(bubbles[bubble], false, false);
                }
            }
        },
        // regarde si après une compression des boules ont dépassé la limite du bas
        checkIfOutOfLimits: function () {
            for (bubble in bubbles) {
                if (bubbles.hasOwnProperty(bubble) && (checkBallOutOfLimits(bubbles[bubble]))) {
                    inGameOverFunc();
                    break;
                }
            }
        },
        //retourne la liste des couleurs dispo
        getBubbleColours: function () {
            colours = {};
            for (bubble in bubbles) {
                if (bubbles.hasOwnProperty(bubble)) {
                    var type = bubbles[bubble].bubble.getType();
                    colours[type] = true;
                }
            }

            return Object.keys(colours);
        },
        
        frozeAllTheBubbles: function () {
            for (bubble in bubbles) {
                if (bubbles.hasOwnProperty(bubble)) {
                    bubbles[bubble].bubble.froze();
                }
            }
        },
        
        init: function (initBubbles) {
            for (bubble in initBubbles) {
                if (initBubbles.hasOwnProperty(bubble)) {
                    initBubbles[bubble].bubble.init();
                    moveToCell(initBubbles[bubble], true, false);
                }
            }

            for (bubble in initBubbles) {
                if (initBubbles.hasOwnProperty(bubble)) {
                    bubbles[initBubbles[bubble].row + '-' + initBubbles[bubble].col] = initBubbles[bubble];
                }
            }
        }
    };

    return my;
});
