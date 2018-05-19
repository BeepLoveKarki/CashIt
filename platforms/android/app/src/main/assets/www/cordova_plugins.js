cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification_android",
    "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-facebook4.FacebookConnectPlugin",
    "file": "plugins/cordova-plugin-facebook4/www/facebook-native.js",
    "pluginId": "cordova-plugin-facebook4",
    "clobbers": [
      "facebookConnectPlugin"
    ]
  },
  {
    "id": "cordova-plugin-native-spinner.SpinnerDialog",
    "file": "plugins/cordova-plugin-native-spinner/www/SpinnerDialog.js",
    "pluginId": "cordova-plugin-native-spinner",
    "clobbers": [
      "SpinnerDialog"
    ]
  },
  {
    "id": "cordova-plugin-native-transitions.NativeTransitions",
    "file": "plugins/cordova-plugin-native-transitions/www/nativetransitions.js",
    "pluginId": "cordova-plugin-native-transitions",
    "clobbers": [
      "nativetransitions"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-plugin-password-dialog.PasswordDialogPlugin",
    "file": "plugins/cordova-plugin-password-dialog/www/password-dialog-plugin.js",
    "pluginId": "cordova-plugin-password-dialog",
    "clobbers": [
      "PasswordDialogPlugin"
    ]
  },
  {
    "id": "cordova-plugin-pin-dialog.PinDialog",
    "file": "plugins/cordova-plugin-pin-dialog/www/pin.js",
    "pluginId": "cordova-plugin-pin-dialog",
    "merges": [
      "window.plugins.pinDialog"
    ]
  },
  {
    "id": "cordova-plugin-spinner-dialog.SpinnerDialog",
    "file": "plugins/cordova-plugin-spinner-dialog/www/spinner.js",
    "pluginId": "cordova-plugin-spinner-dialog",
    "merges": [
      "window.plugins.spinnerDialog"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-dialogs": "2.0.1",
  "cordova-plugin-facebook4": "2.1.0",
  "cordova-plugin-native-spinner": "1.1.3",
  "cordova-plugin-native-transitions": "0.2.3",
  "cordova-plugin-network-information": "2.0.1",
  "cordova-plugin-password-dialog": "1.2.0",
  "cordova-plugin-pin-dialog": "0.1.3",
  "cordova-plugin-spinner-dialog": "1.3.1",
  "cordova-plugin-whitelist": "1.3.3"
};
// BOTTOM OF METADATA
});