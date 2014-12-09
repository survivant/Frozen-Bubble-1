/**

  *Classe utilisé pour controler les bulles(collision,mouvement,image,etc)
  *
  * @param inX <int>: Axe X où la bulle va etre creer
  * @param inY <int>: Axe Y où la bulle va etre creer
  * @param inType <int>: Type de la bulle
  *
  */
 

 
var Bubble_Controller = (function(inX, inY, inType) {
	// Contient l'image
	var image = null;
        //Type  de la bulle (int)(couleur)
	var type = inType;

	/**
          *Retourne le point où la bulle va rebondir en accord avec le degree et le terrain

	  * @param inAngle <int>: The degrees that the bubble have taking the
	  *	Y axe as referenceLe degrees
	  *
	  * @return <object>: retourne les coordonnées  du point où la balle va rebondir
	  *		{
	  *			x: <int>,
	  *			y: <int>}
	  *
	  */
         
	var calcBounce = function(inAngle) {
		var point, b, a, y = null;
		// Convertit l'angle en radians
		var angle = (90 - Math.abs(inAngle)) * Math.PI / 180;

		// axis Regarde si la bulle va à droite afin de calcuer la distance de l'axe X
		if (inAngle > 0) {
			b = config.ballsField.topRight.x - image.getX() - config.bubbles.width;
			a = b * Math.tan(angle);
			y = image.getY() - a;

			point = {
				x: config.ballsField.topRight.x - config.bubbles.width,
				y: y};
		} else {
			b = image.getX() - config.ballsField.topLeft.x;
			a = b * Math.tan(angle);
			y = image.getY() - a;

			point = {
				x: config.ballsField.topLeft.x,
				y: y};
		}

		return point;
	};

	// Public scope
        
        
	var my = {
		/**
		  * Detache la bulle de ses coordonnées et la supprime une fois arrivé en bas de la fenetre.
		  * @param inJumpX <int>: point X où la bulle va parcourir
		  * @param inJumpY <int>: point Y où la bulle va parcourir
		  *
		  */
		destroy: function(inJumpX, inJumpY) {
			// Premier saut
			my.moveTo(inJumpX, inJumpY, function() {
				// Descend en bas de la fenetre
				my.moveTo(inJumpX, config.windowConf.height, function() {
					// Destruction de la bulle
					image.hide();
					image = null;
				});
			});
		},

		/**		  
		  * Lance une bulle du lanceur avec un angle determiné
		  * @param inAngle <int>: L'angle initial que le lanceur a au moment du tir
		  * @param inAngle <object Compressor_Controller>: The object of the main compressor
		  *
		  */
		shoot: function(inAngle, inCompressor) {
			var targetPoint = calcBounce(inAngle);

			this.moveTo(targetPoint.x, targetPoint.y, function() {
				my.shoot(inAngle * -1, inCompressor);
			}, inCompressor.checkCollision);
		},

		/**
		
		  * Bouge la bulle à une position determiné,glisse la bulle jusqu'a l'objectif
		  * @param inX <int>: The pixels of the X axe to move the bubble where
		  * @param inY <int>: The pixels of the Y axe to move the bubble where
		  * @param inCallBack <function>: la fonction appelé apres la fin du mouvement
		  * @param inCheckCollFunc <function>: la fonction a appelé à chaque etape du mouvement jusqu'a que l'objectif soit atteint
		  *
		  */
		moveTo: function(inX, inY, inCallBack, inCheckCollFunc) {
			image.moveTo(inX, inY, config.bubbles.loopTime, inCallBack, config.bubbles.steepPx, inCheckCollFunc, this);
		},

		/**
		  * Returns an integer as the type of the bubble
		  *
		  * @return <int>: The number assigned to this bubble
		  *
		  */
		getType: function() {
			return type;
		},

		/**
		  * Returns the object of the animated image the represents the bubble
		  *
		  * @see AnimatedImage_Tool
		  * @return <AnimatedImage_Tool>: The object to the bubble element
		  *
		  */
		getImage: function() {
			return image;
		},

		/**
                  * creer un image a ajouter à la bulle pour lui donner un effet gelé	  
		  */
		froze: function() {
			var frozeImage = new AnimatedImage_Tool('bubble_frozzen');
			frozeImage.init();
			frozeImage.setPos(image.getX() - 1, image.getY() - 1);
			frozeImage.show();
		},

		/**
		  * Stops all the animations of the bubble
		  *
		  */
		stop: function() {
			image.stop();
		},

		/**
		  * Init the bubble, create the object of the bubble, and shows it into the
		  * position specified ad the constructor
		  *
		  */
		init: function() {
			if (type === undefined) {
				type = Math.floor(Math.random() * config.bubbles.totalTypes);
			}

			image = new AnimatedImage_Tool(
				'bubble',
				type,
				0,
				config.bubbles.totalTypes);

			image.init();
			image.setPos(inX, inY);
			image.show();
		}
	};

	return my;
});
