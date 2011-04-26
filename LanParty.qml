import Qt 4.7
//import QtMobility.sensors 1.1

import "js/Logic.js" as Logic

Rectangle {
    id: interfaz
    width: 800
    height: 600

    Text {
        id: "scoreText"
        text: "Score: "
        x: 10
        y: 10
    }

    Text {
        id: "score"
        text: "0"
        anchors.left: scoreText.right;
        anchors.top: scoreText.top;
        anchors.leftMargin: 10;
    }

    Text {
        id: "livesLabel"
        text: "Vidas: "
        anchors.right: livesText.right;
        anchors.rightMargin: 10;
        anchors.top: scoreText.top;
    }

    Text {
        id: "livesText"
        text: "3"
        anchors.right: interfaz.right;
        anchors.rightMargin: 10;
        anchors.top: scoreText.top;
    }


    Rectangle {
        id: markClickToStart
        color: "white"
        width: clickToStart.width + 20
        height: clickToStart.height + 20

        anchors.verticalCenter: parent.verticalCenter;
        anchors.horizontalCenter: parent.horizontalCenter;

        Text {
            id: clickToStart
            text: "Pulse en la zona de juego para comenzar"
            anchors.verticalCenter: parent.verticalCenter;
            anchors.horizontalCenter: parent.horizontalCenter;

        }
        z:6;
    }

    Rectangle {
        id: markNextLevel
        color: "white"
        width: nextLevel.width + 20
        height: nextLevel.height + 20
        visible: false;

        anchors.verticalCenter: parent.verticalCenter;
        anchors.horizontalCenter: parent.horizontalCenter;

        Text {
            id: nextLevel
            text: "Ha superado el nivel " + Logic.level
            anchors.verticalCenter: parent.verticalCenter;
            anchors.horizontalCenter: parent.horizontalCenter;

        }
        z:6;
    }

    Rectangle {
        id: markYouLoseLive
        color: "white"
        width: youLoseLive.width + 20
        height: youLoseLive.height + 20

        visible: false;

        anchors.verticalCenter: parent.verticalCenter;
        anchors.horizontalCenter: parent.horizontalCenter;

        Text {
            anchors.verticalCenter: parent.verticalCenter;
            anchors.horizontalCenter: parent.horizontalCenter;

            id: youLoseLive
            text: "¡Has perdido una vida!"
        }
        z:6;
    }

    Rectangle {
        id: gameModeButton
        x: 200
        y: 10;
        color: "green"
        width: gameModeText.width +20;
        height: gameModeText.height

        Text {
            id: gameModeText
            anchors.horizontalCenter: gameModeButton.horizontalCenter;
            text: "Classic"
        }

        MouseArea {
            id: buttonArea
            anchors.fill: gameModeButton;
            onClicked:
            {
                if (Logic.gameType == "normal")
                {
                    Logic.gameType = "random"
                    gameModeText.text = "Random"
                }
                else
                {
                    Logic.gameType = "normal"
                    gameModeText.text = "Classic"
                }
            }
        }
        z: 6;
    }

    Rectangle {
        id: board
        x:5
        y:40

        width:790
        height:555
        color: "grey"

        // Nuestro jugador
        Plataforma {
            id: plataforma

            x: (board.width - width) / 2
            y: (board.height - height) - 5
        }


        // Primer inicio
        function startUp()
        {
            // Aqui deben de ir funciones de inicializacion, carga de hiscores...
        }

        Component.onCompleted: startUp();

        // Temporizadores
        Timer {
            id: heartbeat;
            interval: 50;
            running: true;
            repeat: true;
            onTriggered: Logic.heartbeat();
        }

        Timer {
            id: dead;
            interval: 3000;
            running: false;
            repeat: false;
            onTriggered: Logic.triggerDeadTimer();
        }

        Timer {
            id: levelTimer;
            interval: 3000;
            running: false;
            repeat: false;
            onTriggered: Logic.triggerNextLevel();
        }

//        Accelerometer  {
//            id: accelerometer
//            Component.onCompleted: start()
//            onReadingChanged: {
//                var r = reading
//                Logic.scheduleDirection((r.x) * -Logic.maxSpeed);

//            }
//        }
        focus: true;

        // Manejo del teclado
        Keys.onLeftPressed: Logic.velocidadJugador(-Logic.maxSpeed);
        Keys.onRightPressed: Logic.velocidadJugador(Logic.maxSpeed);
        Keys.onEscapePressed: Qt.quit();

        MouseArea {
            anchors.fill: parent;
            onPressed: {
                if ((Logic.state == "stopped" || Logic.state == "paused") && !dead.running) {
                    Logic.startGame();
                }
                else
                {
                    Logic.useSpecial();
                }
            }
        }
    }
}