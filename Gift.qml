import QtQuick 1.0

Image {
    id: rootGift;
    fillMode: Image.PreserveAspectFit;
    property variant validStates: ["fast", "slow", "curse", "extra_ball", "extra_gift"];
    state: "setting up";

    states: [
        State {
            name: "fast"
            PropertyChanges {
                target: rootGift;
                source: "pics/gift_fast.png";
            }
        },
        State {
            name: "slow"
            PropertyChanges {
                target: rootGift;
                source: "pics/gift_slow.png";
            }
        },
        State {
            name: "curse"
            PropertyChanges {
                target: rootGift;
                source: "pics/gift_curse.png";
            }
        },
        State {
            name: "extra_ball"
            PropertyChanges {
                target: rootGift;
                source: "pics/gift_ball.png";
            }
        },
        State {
            name: "extra_gift"
            PropertyChanges {
                target: rootGift;
                source: "pics/gift_live.png";
            }
        }
    ]

    Behavior on y {
        enabled:  state != "setting up";
        NumberAnimation { duration: 50; }
    }

    Component.onCompleted: { state: "setting up" }
}
