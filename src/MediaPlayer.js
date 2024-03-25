import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';

import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';

const videos = [
  {
    title: 'Big Buck Bunny',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  },
  {
    title: "Elephant's Dream",
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
  },
  {
    title: 'For Bigger Blazes',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
  },
  {
    title: 'For Bigger Escapes',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
  },
  {
    title: 'For Bigger Fun',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
  },
  {
    title: 'For Bigger Joyrides',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
  },
  {
    title: 'For Bigger Meltdowns',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
  },
  {
    title: 'Sintel',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
  },
  {
    title: 'Subaru Outback On Street And Dirt',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
  },
  {
    title: 'Tears Of Steel',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
  },
];

const MediaPlayer = () => {
  const [url, setUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [clicked, setClicked] = useState(false);
  const [puased, setPuased] = useState(false);
  const [progress, setProgress] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const ref = useRef();
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const sintel = require('../assets/video1.mp4');

  const videoPlayer = useRef(null);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [isLoading, setIsLoading] = useState(true);

  const onFullScreen = () => {
    setIsFullScreen(!isFullScreen);

    if (!isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  };

  const onSeek = seek => {
    videoPlayer?.current.seek(seek);
  };

  const onSeeking = currentVideoTime => setCurrentTime(currentVideoTime);

  const onPaused = newState => {
    setPaused(!paused);
    setPlayerState(newState);
  };

  const onReplay = () => {
    videoPlayer?.current.seek(0);
    setCurrentTime(0);
    if (Platform.OS === 'android') {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(true);
    } else {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(false);
    }
  };

  const onProgress = data => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  const handleVideoPress = video => {
    console.log('Video pressed:', video.url);

    setUrl(video.url);
    setThumbnail(Video.thumbnail);
    // Here you can implement navigation logic to show video player
  };

  const renderVideoItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleVideoPress(item)}
      style={styles.buttonContainer}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
        <Image source={{uri: item.thumbnail}} style={{width: 30, height: 30}} />
        <Text style={{fontSize: 16, color: 'black'}}>{item.title}</Text>
      </View>

      <View>
        <Image
          source={require('../assets/video-button.png')}
          style={{width: 30, height: 30}}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {/*====== custom made ======= */}

      {/* <TouchableOpacity
        style={{width: '100%', height: fullScreen ? '100%' : 200}}
        onPress={() => {
          setClicked(true);
        }}>
        <Video
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          paused={puased}
          ref={ref}
          onProgress={x => {
            // console.log(x);

            setProgress(x);
            // onProgress
          }}
          muted
          style={{width: '100%', height: fullScreen ? '100%' : 200}}
          resizeMode="contain"
        />

        {clicked && (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) - 10);
                }}>
                <Image
                  source={require('./assets/backward.png')}
                  style={{width: 30, height: 30, tintColor: 'white'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPuased(!puased);
                }}>
                <Image
                  source={
                    puased
                      ? require('./assets/play-button.png')
                      : require('./assets/pause.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) + 10);
                }}>
                <Image
                  source={require('./assets/forward.png')}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>
                {format(progress.currentTime)}
              </Text>

              <Slider
                style={{width: '80%', height: 40}}
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#fff"
                onValueChange={x => {
                  ref.current.seek(x);
                }}
              />

              <Text style={{color: 'white'}}>
                {format(progress.seekableDuration)}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 10,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (fullScreen) {
                    Orientation.lockToPortrait();
                  } else {
                    Orientation.lockToLandscape();
                  }
                  setFullScreen(!fullScreen);
                }}>
                <Image
                  source={
                    fullScreen
                      ? require('./assets/minimize.png')
                      : require('./assets/full-size.png')
                  }
                  style={{width: 24, height: 24, tintColor: 'white'}}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity> */}

      {/* using react-native-media-controls package */}

      <View style={{marginVertical: 10}}>
        <Video
          onEnd={onEnd}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onProgress={onProgress}
          paused={paused}
          poster={
            thumbnail
              ? thumbnail
              : 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
          }
          //   poster = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
          posterResizeMode={'cover'}
          ref={ref => (videoPlayer.current = ref)}
          resizeMode={'cover'}
          // source={{
          //   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          // }}

          //   source={sintel}
          source={{uri: url}}
          style={{
            width: '99%',
            height: isFullScreen ? '100%' : 200,
            borderWidth: 1,
            borderColor: 'tomato',
            alignSelf: 'center',
            borderRadius: 5,
          }}
        />
        <MediaControls
          isFullScreen={true}
          duration={duration}
          isLoading={isLoading}
          progress={currentTime}
          onFullScreen={onFullScreen}
          onPaused={onPaused}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          mainColor={'tomato'}
          playerState={playerState}
          showOnStart={true}
          sliderStyle={{containerStyle: {}, thumbStyle: {}, trackStyle: {}}}
        />
      </View>

      <View>
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={item => item.title}
        />
      </View>

      {/* using react-native-media-console package */}

      {/* <View >
        <Video
          resizeMode={'cover'}
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          style={{width: '100%', height: fullScreen ? '100%' : 200}}
          controls={true}
          // fullscreenOrientation={'landscape'}
          // fullscreen={true}
          // fullscreenAutorotate={true}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 10,
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: 'center',
      
          }}>
          <TouchableOpacity
            onPress={() => {
              if (fullScreen) {
                Orientation.lockToPortrait();
              } else {
                Orientation.lockToLandscape();
              }
              setFullScreen(!fullScreen);
            }}>
             
                <Image
              source={
                fullScreen
                  ? require('./assets/minimize2.png')
                  : require('./assets/full-size2.png')
              }
              style={{width: 24, height: 24, tintColor: 'white',}}
            />
              
            
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

export default MediaPlayer;

const styles = StyleSheet.create({
  mediaControls: {
    height: '100%',
    flex: 1,
    alignSelf: 'center',
  },

  buttonContainer: {
    marginBottom: 20,
    // borderWidth: 1,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    elevation: 5,
    borderRadius: 5,
  },
});
