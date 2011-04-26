import QtQuick 1.0

Image {
    id: root

    property int vida: 1
    state: "NORMAL"

    source: "pics/bloque.png"

    width:60;
    height:30;

    fillMode: Image.PreserveAspectFit

    states: [
        State {
            name: "NORMAL"
            when: root.vida > 0
            PropertyChanges {
                target: root;
                opacity: 1;
            }
        },

        State {
            name: "EXPLODE"
            when: root.vida < 1
            PropertyChanges {
                target: root;
                opacity: 0
            }
        }
    ]

    transitions: [
        Transition {
            from: "*"
            to: "EXPLODE"
            NumberAnimation { target: root; property: "opacity"; duration: 1000 }

        }
    ]

    Component.onCompleted: { status: "NORMAL" }

}
