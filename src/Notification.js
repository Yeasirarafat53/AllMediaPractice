import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import messaging from '@react-native-firebase/messaging';

import notifee from '@notifee/react-native';

const Notification = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);

      getFCMToken();
    }
  }

  const notificationListner = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'notification cause app to open from background state',
        remoteMessage.notification,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(
          'notification cause app to open from quit state',
          remoteMessage.notification,
        );
      });

    messaging().onMessage(async remoteMessage => {
      console.log('notificatin on forground state ....', remoteMessage);
    });
  };

  async function getFCMToken() {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token', token);
      } else {
        console.log('no FCM Token available');
      }
    } catch (error) {
      console.log('error getting FCM Token', error);
    }
  }

  useEffect(() => {
    notificationListner();
    requestUserPermission();
  }, []);


//   ============

async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
        
      },
    });
  }

  return (
    <View>
      <View style={styles.body}>
        <TouchableOpacity style={styles.button} onPress={() => onDisplayNotification()}>
          <Text style={styles.btn_text}>Greet!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'black',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    backgroundColor: 'hotpink',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
  btn_text: {
    fontSize: 20,
    color: 'white',
  },
});
