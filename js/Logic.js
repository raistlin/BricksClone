var component;
var level = 0;
var lives = 3;
var firstBall = true;

// Player can shoot?
var weapon = false;
var weaponTimeout = 0;
var weaponTimeoutMax = 250;

// Player can 'stick' balls
var sticky = false;

var maxBalls = 10;
var maxBricks = 100;
var maxGifts = 32;
var maxShots = 16;

var brickWidth = 47;
var brickHeight = 24;

var bricks = new Array(maxBricks);
var ball = new Array(maxBalls);
var gift = new Array(maxGifts);
var shots = new Array(maxShots);

var points = 0;
var state = "stopped";
var gameType = "normal";
var giftChance = 25;  // 25% chances of create a gift
var maxSpeed = 10;
var maxSpeedInit = 10;
var giftSpeed = 5;
var keyPressing = false;

// Overloading, should work?
function createBall()
{
    createBall(0,0);
}


function createBall (x, y)
{
    var index = -1;
    for ( var i = 0; i < maxBalls; i++)
    {
        if (!ball[i])
        {
            index = i;
            break;
        }
    }

    if (index == -1)
    {
        return;
    }

    component = Qt.createComponent("Ball.qml");
    ball[index] =  component.createObject(board);

    if (firstBall)
    {
        // Solo la primera bola se crea en la plataforma
        ball[index].x = plataforma.x + plataforma.width - (ball[index].width / 2);
        ball[index].y = plataforma.y - ball[index].height - 5;
        if (ball[index].speedY > 0)
        {
            ball[index].speedY *= -1;
        }
        // Por definir
        //ball[index].angulo = 0;
        ball[index].state = "sticked";
        firstBall = false;
    }
    else
    {
        // El resto de bolas, se crean en la posicion de la primera, con dirección aleatoria
        ball[index].x = ball[0].x;
        ball[index].y = ball[0].y;
        ball[index].angulo = ball[0].angulo + 0.5;
        ball[index].state = "running";
    }

}


function destroyBalls()
{
    for ( var i = 0; i < maxBalls; i++ )
    {
        if ( ball[i] )
        {
            ball[i].destroy();
            ball[i] = null;
        }
    }
    firstBall = true;
}


function forceBallPosition(whatBall, x, y)
{
    if (!whatBall)
        return;
    var oldState = whatBall.state;

    whatBall.state = "setting up";
    whatBall.x = x;
    whatBall.y = y;
    whatBall.state = oldState;
}


// Check constraints of ball against borders of board
function checkConstraintsBall (whatBall)
{
    if (!whatBall)
        return;

    if (whatBall.x + whatBall.speedX < 0)
    {
        forceBallPosition ( whatBall, 0, whatBall.y);

        if (whatBall.speedX < 0)
            whatBall.speedX *= -1;
    }

    if (whatBall.x + whatBall.speedX + whatBall.width > board.width)
    {
        forceBallPosition (whatBall, board.width - whatBall.width, whatBall.y);

        if ( whatBall.speedX > 0)
            whatBall.speedX *= -1;
    }

    if (whatBall.y + whatBall.speedY < 0)
    {
        forceBallPosition (whatBall, whatBall.x, 0);

        if (whatBall.speedY < 0)
            whatBall.speedY *= -1;
    }
}


function createGift(x, y)
{
    var index = -1;
    for ( var i = 0; i < maxGifts; i++)
    {
        if (!gift[i])
        {
            index = i;
            break;
        }
    }

    if (index == -1)
    {
        return;
    }

    component = Qt.createComponent("Gift.qml");
    gift[index] =  component.createObject(board);

    gift[index].x = x
    gift[index].y = y;
    gift[index].state = gift[index].validStates[rand(7)]
}


function destroyGifts()
{
    for ( var i = 0; i < maxGifts; i++ )
    {
        if ( gift[i] )
        {
            gift[i].destroy();
            gift[i] = null;
        }
    }
}


function createBrick (posx, posy, thoughness)
{
    var index = -1;
    for ( var i = 0; i < maxBricks; i++ )
    {
        if ( !bricks[i] )
        {
            index = i;
            break;
        }
    }

    for (var j = 0; j < maxBricks; j++)
    {
        if (bricks[j])
        {
            // Bricks cannot overlap.
            if ( (posx >= bricks[j].x) && (posx < bricks[j].x + bricks[j].width) &&
                 (posy >= bricks[j].y) && (posy < bricks[j].y + bricks[j].height))
            {
                return 1;
            }
        }
    }

    // Comprobacion de vida 'válida'
    if ( (thoughness > 0) && (thoughness < 5) && ( index > -1 ) )
    {
        component = Qt.createComponent ("Brick.qml");
        bricks[index] = component.createObject(board);
        bricks[index].x = posx;
        bricks[index].y = posy;
        //bricks[index].source = "pics/bloque_" + thoughness + ".png";
        bricks[index].vida = thoughness;
        return 0;
    }
    return 1;
}


function destroyBricks ()
{
    for ( var i = 0 ; i < maxBricks; i ++)
    {
        if (bricks[i])
        {
            bricks[i].destroy();
            bricks[i] = null;
        }
    }
}


// Creates two shots, one at every 1/5 of platform length
function createShots()
{
    createShot(platform.x + platform.width / 5);
    createShot(platform.x + platform.width * 4 / 5);
}

// Creates one shot, y = platform.y
function createShot(x)
{
    var index = -1;
    for (var i = 0; i < maxShots; i++)
    {
        if (!shot[i])
        {
            index = i;
            break;
        }
    }

    if (index == -1)
        return;

    component = Qt.createComponent("Shot.qml");
    shots[index] = component.createObject(board);
    shots[index].x = x;
    shots[index].y = platform.y;
    shots[index].state = "running";

}

function destroyShot(whatIndex)
{
    // Check valid index
    if (whatIndex > -1 && whatIndex < shots.length)
    {
        // Check shot exists
        if (!shots[whatIndex])
            return;

        // Destroy!
        shots[whatIndex].destroy;
        shots[whatIndex] = null;
    }
}

function destroyShots()
{
    for(var i = 0; i < maxShots; i++)
    {
        destroyShot(i);
    }
}


function velocidadJugador(velocidad)
{
    if ( plataforma ) {
        plataforma.speed = velocidad;
    }
}

function heartbeat()
{
    if (state == "started")
    {
        movePlayer();
        moveBalls();
        moveGifts();
        moveShots();
        checkCollisions();
        checkLevelCleared();

        if (weaponTimeout > 0)
        {
            weaponTimeout -= 50;

            if (weaponTimeout < 0)
                weaponTimeout = 0;
        }
    }
}

function movePlayer()
{
    if ( plataforma )
    {
        var next_x = plataforma.x + plataforma.speed;

        // Checks
        if (next_x < 0)
        {
            plataforma.x = 0;
        }
        else if ( next_x + plataforma.width > board.width)
        {
            plataforma.x = board.width - plataforma.width;
        }
        else
            plataforma.x = next_x;


        // Only decrease speed while not pressing keys
        if ( !keyPressing)
        {
            if ( plataforma.speed > 0)
                plataforma.speed -= 2;

            if ( plataforma.speed < 0)
                plataforma.speed += 2;
        }
    }
}


function moveBalls()
{
    for ( var i = 0; i < maxBalls; i++ )
    {
        if (!ball[i])
            continue;

        if (ball[i].state != "sticked")
        {
            // Increase overall movement speed
            ball[i].totalSpeed += 0.001;

            // Debería de convertir el total speed en speedX y speedY
            // pero no tengo tiempo bastante :(
            ball[i].speedX += 0.0005;
            ball[i].speedY += 0.0005;

            ball[i].x += ball[i].speedX;
            ball[i].y += ball[i].speedY;
        }
        else
        {
            ball[i].x = plataforma.x + plataforma.width / 2 - ball[i].width / 2;
            ball[i].y = plataforma.y - ball[i].height;
        }
    }
}


function moveGifts()
{
    for ( var i = 0; i < maxGifts; i++ )
    {
        if (!gift[i])
            continue;

        // Descomentar para powerups que caen muy raro :D
        //gift[i].x += rand(5);
        gift[i].y += giftSpeed;

    }
}


function moveShots()
{
    for (var i = 0; i < maxShots; i++)
    {
        if (!shots[i])
            continue;
        shots[i].y -= shotSpeed;

        if (shots[i].y + shots[i].height < 0)
        {
            destroyShot(i);
        }
    }
}


function pointDistance(p1_x, p1_y, p2)
{
    return Math.sqrt((p2.x-p1_x) * (p2.x-p1_x) + (p2.y-p1_y) * (p2.y-p1_y));
}


function pointToLineDistance(s1,s2, p) {
    var xDelta = s2.x - s1.x;
    var yDelta = s2.y - s1.y;
    if ((xDelta == 0) && (yDelta == 0)) {
        // p1 and p2 cannot be the same point
        s2.x += 1;
        s2.y += 1;
        xDelta = 1;
        yDelta = 1;
    }
    var u = ((p.x - s1.x) * xDelta + (p.y - s1.y) * yDelta) / (xDelta * xDelta + yDelta * yDelta);
    var closestPoint_x, closestPoint_y;
    if (u <0) {
        closestPoint_x = s1.x;
        closestPoint_y = s1.y;
    } else if (u> 1) {
        closestPoint_x = s2.x;
        closestPoint_y = s2.y;
    } else {
        closestPoint_x = s1.x + u * xDelta;
        closestPoint_y = s1.y + u * yDelta;
    }
    return pointDistance(closestPoint_x, closestPoint_y, p);
}


/**
 * Se debería de haber utilizado una funcion mucho mejor de colision, basada en,
 * cuando hay colision, calcular que lado del cuadrado está mas cerca del centro
 * de la bola, pero por razones de tiempo, esto nos vale si no somos muy exigentes.
 *
 * Return:
 *  0 -> No collision
 *  1 -> Collision ball at top
 *  2 -> Collision ball at bottom
 *  3 -> Collision ball at right
 *  4 -> Collision ball at left
 */
function checkCollisionBrickBall(thisBrick, thisBall)
{
    var tl = Qt.point (thisBrick.x                , thisBrick.y);
    var tr = Qt.point (thisBrick.x+thisBrick.width, thisBrick.y)
    var bl = Qt.point (thisBrick.x                , thisBrick.y+thisBrick.height);
    var br = Qt.point (thisBrick.x+thisBrick.width, thisBrick.y+thisBrick.height)

    // This is to speed up things removing lot of checks
    if ((thisBall.y + thisBall.heigth < tl.y) || (thisBall.y > bl.y))
        return 0;

    var centerBall = Qt.point(thisBall.x + thisBall.width/2, thisBall.y + thisBall.height/2);

    centerBall.x += thisBall.speedX;
    centerBall.y += thisBall.speedY;

    var radiusBall = thisBall.width / 2;

    var dt = pointToLineDistance(tl, tr, centerBall);
    var dl = pointToLineDistance(tl, bl, centerBall);
    var dr = pointToLineDistance(tr, br, centerBall);
    var db = pointToLineDistance(bl, br, centerBall);

    if (dt > radiusBall && dl > radiusBall && dr > radiusBall && db > radiusBall)
        return 0;


    if ( dt < dl)
    {
        if (dt < dr)
        {
            if (dt < db)
            {
                // Ball is ABOVE brick
                return 1;
            }
            else
            {
                // Ball is BELOW brick
                return 2;
            }
        }
        else
        {
            if (dr < db)
            {
                // Ball is at RIGHT of brick
                return 3;
            }
            else
            {
                // Ball is BELOW
                return 2;
            }
        }
    }
    else
    {
        if (dl < dr)
        {
            if (dl < db)
            {
                // Ball is LEFT of brick
                return 4;
            }
            else
            {
                // Ball is BELLOW
                return 2;
            }
        }
        else
        {
            if (dl < db)
            {
                // BAll is LEFT of brick
                return 4;
            }
            else
            {
                // Ball is BELOW brick
                return 2;
            }
        }
    }

    return 0;
}


/*
    Funcion más compleja modifica ella misma trayectoria de la bola.
    Devuelve 1 si ha colisionado, 0 en otro caso
*/
function checkCollisionPlatformBall(cuadrado, bola)
{
    var colisionX = 0;
    var colisionRealX = 0;
    var colisionY = 0;

    if ((cuadrado.y < bola.y + bola.height) &&
        (cuadrado.y + cuadrado.height / 2 > bola.y))
    {
        colisionY = 1;
    }

    if (colisionY &&
        (cuadrado.x < bola.x + bola.width) &&
        (cuadrado.x + cuadrado.width > bola.x))
    {

       var posicionRelativa =
           (cuadrado.x + cuadrado.width/2) -
           (bola.x + (bola.width / 2));


       if (bola.speedX)
       {
           bola.speedX -= posicionRelativa/10;

           if ( bola.speedY > 0)
                bola.speedY *= -1;
       }

       return 1;
    }

    return 0;
}


function addScore (addPoints)
{
    points += addPoints;
    score.text = points;
}


function checkCollisions()
{
    for (var i = 0; i < maxBalls; i++)
    {
        if (!ball[i])
            continue;

        // Ball against player collisions
        var collision;
        collision = checkCollisionPlatformBall(plataforma, ball[i]);

        if (collision)
            addScore (5);


        for (var j = 0; j < maxBricks; j++)
        {
            if (bricks[j] && (bricks[j].vida > 0))
            {
                collision = checkCollisionBrickBall(bricks[j], ball[i]);

                if (collision == 1 && ball[i].speedY > 0)
                {
                    ball[i].y = bricks[j].y;
                    ball[i].speedY *= -1;
                }

                if (collision == 2 && ball[i].speedY < 0)
                {
                    ball[i].y = bricks[j].y + bricks[j].heigth;
                    ball[i].speedY *= -1;
                }

                if (collision == 3 && ball[i].speedX < 0)
                {
                    ball[i].x = bricks[j].x + bricks[j].width;
                    ball[i].speedX *= -1;
                }

                if (collision == 4 && ball[i].speedX > 0)
                {
                    ball[i].x = bricks[j].x;
                    ball[i].speedX *= -1;
                }

                if ( collision > 0)
                {
                    if (bricks[j].vida < 100)
                    {
                        addScore(bricks[j].vida*10);
                    }

                    breakBrick (bricks[j])

                    // Cada bola solo puede chocar con un único bloque
                    break;
                }

            }
        }


        // Realistic checks
        checkConstraintsBall(ball[i]);

        // Chocar abajo significa la muerte
        if (ball[i].y + ball[i].height > board.height)
        {
            // Liberamos el slot para otra posible bola
            ball[i].destroy();
            ball[i] = null;
        }

    }

    for ( var i = 0; i < maxGifts; i++)
    {
        if (!gift[i])
            continue;

        if (checkCollisionPlatformBall(plataforma, gift[i]))
        {
            if(gift[i].state == "fast")
            {
                maxSpeed += 2;
            }

            // All balls' speed are halved
            if(gift[i].state == "slow")
            {
                for (var j = 0; j < maxBalls; j++)
                {
                    if (!ball[j])
                        continue;

                    ball[j].speedX /= 2;
                    ball[j].speedY /= 2;
                }
            }

            // Curse, we slowed down!
            if(gift[i].state == "curse")
            {
                maxSpeed -= 2;
            }

            // We receive an extra ball
            if(gift[i].state == "extra_ball")
            {
                firstBall = true;
                createBall();
            }

            // Extra live
            if(gift[i].state == "extra_gift")
            {
                lives++;
                livesText.text = lives;
            }

            if (gift[i].state == "sticky")
            {
                sticky = true;
            }

            if (gift[i].state == "weapon")
            {
                weapon = true;
            }

            // We put gift out of vision
            gift[i].state = "setting up";
            gift[i].y = board.height + 1;
        }

        // Gifts are cleaned when out of board
        if (gift[i].y > board.height)
        {
            gift[i].destroy();
            gift[i] = null;
        }
    }

    // Count number of balls in game
    var nBalls = 0;
    for (var i = 0; i < maxBalls; i++)
    {
        if (ball[i])
            nBalls++;
    }

    if (nBalls == 0)
    {
        loseLive();
    }
}


function triggerDeadTimer()
{
    markYouLoseLive.visible = false;
    markClickToStart.visible = true;
    state = "paused";
}


function triggerNextLevel()
{
    createLevel();

    state = "paused";
    markNextLevel.visible = false;
    markClickToStart.visible = true
}

function loseLive()
{
    if ( lives > 0 )
    {
        destroyBalls();
        lives--;
        livesText.text = lives;
        // Paramos temporizador
        state = "waitingDeathTimer";
        heartbeat.running = false;
        dead.running = true;
        markYouLoseLive.visible = true;
    }
    else
    {
        // GameOver man!
        state = "stopped";
    }
    lives.text = lives;

}



function startGame ()
{
    if (state == "started")
        return;

    if ( state == "stopped")
    {
        // Siempre por seguridad
        destroyBalls();
        destroyBricks();

        points = 0;
        lives = 3;
        level = 0;

        // Creamos el nivel
        createLevel();
    }

    markClickToStart.visible = false;

    // Creamos una bola
    createBall();

    state = "started";
    heartbeat.running = true;
}


function createLevel()
{
    destroyBricks();
    if (level == 0)
    {
        maxSpeed = maxSpeedInit;
    }

    if (gameType == "normal")
    {
        var xBricks = Math.round(board.width / brickWidth) - 2;
        var xOffset = (board.width - xBricks*brickWidth) / 2;
        var yBricks = Math.min(2 + level, Math.round((board.height-120)/brickHeight));

        for (var i = 0; i < xBricks; i++)
        {
            for (var j = 0; j < yBricks; j++)
            {
                createBrick(i * brickWidth + xOffset, j * brickHeight + 15, level+1);
            }
        }
    }
    else
    {
        var n_bricks = 10 * (level + 1);
        if (n_bricks > 100)
            n_bricks = 100;

        for (var i = 0; i < n_bricks; i++)
        {
            createBrick(rand(board.width - 60), rand(board.height - 240), rand(3) + 1);
        }
    }
}


function breakBrick(whatBrick)
{
    // There may be non-destructible bricks
    if ( whatBrick.vida > 0 && whatBrick.vida < 100 )
    {
        whatBrick.vida--;

        if (whatBrick.vida == 0)
        {
            if (rand(100) < giftChance)
            {
                createGift (whatBrick.x, whatBrick.y);
            }
        }
    }

}


function useSpecial ()
{
    // First, unstick all sticked balls
    for (var i = 0; i < maxBalls; i++)
    {
        if (!ball[i])
            continue;
        if(ball[i].state == "sticked")
        {
            ball[i].state = "running";
        }
    }

    // Second, if player has a weapon, shoot
    if (weapon && weaponTimeout == 0)
    {
        weaponTimeout = weaponTimeoutMax;
    }
}


function rand(n)
{
  return (Math.floor(Math.random() * n));
}


function checkLevelCleared()
{
    var bricksLeft = 0;
    for (var i = 0; i < maxBricks; i++)
    {
        if (bricks[i] && bricks[i].vida > 0 && bricks[i].vida < 99)
        {
            bricksLeft++;
        }
    }

    if (bricksLeft == 0)
    {
        destroyBalls();
        destroyGifts();
        state = "levelCleared";
        level++;
        nextLevel.text = "Ha superado el nivel " + level;
        levelTimer.running = true;
        markNextLevel.visible = true;
        heartbeat.running = false;
    }
}
