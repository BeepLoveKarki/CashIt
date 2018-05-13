cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-native-transitions.NativeTransitions",
    "file": "plugins/cordova-plugin-native-transitions/www/nativetransitions.js",
    "pluginId": "cordova-plugin-native-transitions",
    "clobbers": [
      "nativetransitions"
    ]
  },
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
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-native-transitions": "0.2.3",
  "cordova-plugin-dialogs": "2.0.1",
  "cordova-plugin-facebook4": "2.1.0"
};
// BOTTOM OF METADATA
});