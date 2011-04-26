import Qt 4.7

Image {
    id: root
    // Dirección
    property double angulo: 0
    property double totalSpeed: 6
    property double speedX: 1
    property double speedY: 6
    property string estado: "NORMAL"

    source: "pics/bola.png"
    width: 10;
    height: 10;

    fillMode: Image.PreserveAspectFit;


}
