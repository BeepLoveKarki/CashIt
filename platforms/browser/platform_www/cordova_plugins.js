cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/browser/notification.js",
        "id": "cordova-plugin-dialogs.notification_browser",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-facebook4/www/facebook-browser.js",
        "id": "cordova-plugin-facebook4.FacebookConnectPluginBrowser",
        "pluginId": "cordova-plugin-facebook4",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-native-spinner/www/SpinnerDialog.js",
        "id": "cordova-plugin-native-spinner.SpinnerDialog",
        "pluginId": "cordova-plugin-native-spinner",
        "clobbers": [
            "SpinnerDialog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-native-transitions/www/nativetransitions.js",
        "id": "cordova-plugin-native-transitions.NativeTransitions",
        "pluginId": "cordova-plugin-native-transitions",
        "clobbers": [
            "nativetransitions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-pin-dialog/www/pin.js",
        "id": "cordova-plugin-pin-dialog.PinDialog",
        "pluginId": "cordova-plugin-pin-dialog",
        "merges": [
            "window.plugins.pinDialog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-spinner-dialog/www/spinner.js",
        "id": "cordova-plugin-spinner-dialog.SpinnerDialog",
        "pluginId": "cordova-plugin-spinner-dialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-password-dialog/www/password-dialog-plugin.js",
        "id": "cordova-plugin-password-dialog.PasswordDialogPlugin",
        "pluginId": "cordova-plugin-password-dialog",
        "clobbers": [
            "PasswordDialogPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/src/browser/network.js",
        "id": "cordova-plugin-network-information.NetworkInfoProxy",
        "pluginId": "cordova-plugin-network-information",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-dialogs": "2.0.1",
    "cordova-plugin-facebook4": "2.1.0",
    "cordova-plugin-native-spinner": "1.1.3",
    "cordova-plugin-native-transitions": "0.2.3",
    "cordova-plugin-pin-dialog": "0.1.3",
    "cordova-plugin-spinner-dialog": "1.3.1",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-password-dialog": "1.2.0",
    "cordova-plugin-network-information": "2.0.1"
}
// BOTTOM OF METADATA
});