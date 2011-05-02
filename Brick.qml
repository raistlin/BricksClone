import QtQuick 1.0

Image {
    id: root

    property int vida: 1
    state: "NORMAL"

    source: "pics/green_brick.png"

    fillMode: Image.PreserveAspectFit

    states: [
        State {
            name: "EXPLODE"
            when: root.vida < 1
            PropertyChanges {
                target: root;
                opacity: 0
            }
        },
        State {
            name: "One";
            when: root.vida == 1;
            PropertyChanges {
                target: root;
                source: "pics/green_brick.png"

            }
        },
        State {
            name: "Two";
            when: root.vida == 2;
            PropertyChanges {
                target: root;
                source: "pics/yellow_brick.png"

            }
        },
        State {
            name: "Three"
            when: root.vida = 3;
            PropertyChanges {
                target: root;
                source: "pics/red_brick.png"

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
