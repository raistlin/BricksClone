import QtQuick 1.0

Image {
    id: root
    // Dirección
    property double angulo: 0
    property double totalSpeed: 6
    property double speedX: 1
    property double speedY: 6
    state: "setting up"

    source: "pics/bola.png"
    width: 10;
    height: 10;

    fillMode: Image.PreserveAspectFit;

    states: [
        State {
            name: "setting up"
            },
        State {
            name: "running"
        }]

    Behavior on x {
        enabled: state != "setting up";
        NumberAnimation { duration: 50 }
    }

    Behavior on y {
        enabled: state != "setting up";
        NumberAnimation { duration: 50 }
    }

    Component.onCompleted: { state: "setting up" }
}
