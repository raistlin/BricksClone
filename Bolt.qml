import QtQuick 1.0

Image {
    id: bolt
    source:  "pics/bolt.png"
    fillMode: Image.PreserveAspectFit;
    state: "setting up"

    Behavior on y
    {
        enabled: state != "setting up"
        NumberAnimation { duration: 50 }
    }

    Component.onCompleted: { state = "setting up" }
}
