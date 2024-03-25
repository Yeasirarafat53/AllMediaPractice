import {StyleSheet, View, ScrollView} from 'react-native';
import React from 'react';

import MediaPlayer from './src/MediaPlayer';
import PdfReader from './src/PdfReader';
import Notification from './src/Notification';

const App = () => {
  return (
    <View style={{flex: 1,backgroundColor:"white",padding: 10}}>
      {/* <MediaPlayer /> */}
      <Notification />
      <PdfReader />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  //   backgroundVideo: {
  //     height: isFullScreen ? '100%' : 200,
  //     width: '100%',
  //     // flex: 1,
  // },
});
