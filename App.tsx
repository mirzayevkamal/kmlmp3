import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Keyboard,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Input from './components/Input';
import axios from 'axios';
import MusicInfo from './components/MusicInfo';
import {isYouTubeUrl, parseId} from './utils/url-check';
import mobileAds, {
  InterstitialAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const bannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

function App(): React.JSX.Element {
  const [musicData, setMusicData] = React.useState<{
    link: string;
    title: string;
    downloadUrl?: string;
  }>({link: '', title: '', downloadUrl: ''});
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const rapidKey = '54113d86fbmshd2d33092866458bp119333jsnb6d93500de3d';
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    console.log('is dev?', __DEV__);
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log('Ads initialized');
      });
  }, []);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('Interstitial closed', musicData);
        if (musicData.link || musicData.downloadUrl) {
          Linking.openURL(musicData.link || musicData.downloadUrl || '');
        }
        interstitial.load();
      },
    );

    // Unsubscribe from events on unmount
    return loadListener;
  }, [musicData]);

  const endpoints = [
    {
      //link
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: {id: parseId(videoUrl)},
      headers: {
        'X-RapidAPI-Key': rapidKey,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    },
    {
      //link
      url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
      params: {
        url: videoUrl,
      },
      headers: {
        'X-RapidAPI-Key': rapidKey,
        'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com',
      },
    },
    {
      //link
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: {id: parseId(videoUrl)},
      headers: {
        'X-RapidAPI-Key': rapidKey,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    },
    //link
    {
      url: 'https://youtube-mp3-download-highest-quality1.p.rapidapi.com/ytmp3/ytmp3/custom/',
      params: {
        url: videoUrl,
        quality: 320,
      },
      headers: {
        'X-RapidAPI-Key': rapidKey,
        'X-RapidAPI-Host':
          'youtube-mp3-download-highest-quality1.p.rapidapi.com',
      },
    },
    //downloadUrl
    {
      url: 'https://youtube-mp310.p.rapidapi.com/download/mp3',
      params: {
        url: videoUrl,
      },
      headers: {
        'X-RapidAPI-Key': rapidKey,
        'X-RapidAPI-Host': 'youtube-mp310.p.rapidapi.com',
      },
    },
  ];

  const downloadMusicFromEndpoint = async (endpoint: any) => {
    try {
      const response = await axios.get(endpoint.url, {
        params: endpoint.params,
        headers: endpoint.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error downloading music: ${error.message}`);
      return null;
    }
  };

  const downloadMusicRecursive = async (currentEndpointIndex: any) => {
    if (currentEndpointIndex >= endpoints.length) {
      console.log('All attempts failed. Unable to download music.');
      setIsLoading(false);
      throw new Error('All attempts failed. Unable to download music.');
    }

    const musicData = await downloadMusicFromEndpoint(
      endpoints[currentEndpointIndex],
    );

    if (musicData) {
      console.log('music data var', musicData);
      setMusicData(musicData);
      setIsLoading(false);
      return musicData;
    } else {
      // Retry with the next endpoint
      downloadMusicRecursive(currentEndpointIndex + 1);
    }
  };

  useEffect(() => {
    console.log('Muzik data deyisdi', musicData);
  }, [musicData]);

  const handleDownload = async () => {
    if (!isYouTubeUrl(videoUrl)) {
      setError('Please enter a valid YouTube video URL');
      return;
    }
    setError('');
    try {
      setIsLoading(true);
      const resp = await downloadMusicRecursive(0);
      Keyboard.dismiss();
      console.log('respionse', resp);
    } catch (error) {
      console.log('error', error);
    }
  };

  const downloadMusic = async () => {
    if (musicData.link || musicData.downloadUrl) {
      interstitial.show();
      // Linking.openURL(musicData.link || musicData.downloadUrl || '');
    }
  };

  const musicConverted = musicData.link || musicData.downloadUrl;

  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Favori Muziğinizi hızlıca indirin!
          </Text>
          <Text style={styles.subText}>
            Videonu müziğe çevirmek için video linkini girin.
          </Text>
          <View style={styles.inputContainer}>
            <Input onChangeText={setVideoUrl} value={videoUrl} />
            <Pressable onPress={handleDownload} style={styles.imageContainer}>
              <Image
                source={require('./assets/images/Search.png')}
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </Pressable>
          </View>
        </View>
        <Text style={styles.errorText}>{error}</Text>

        {isLoading && <ActivityIndicator style={styles.loading} />}
        {musicConverted ? (
          <MusicInfo
            onPress={downloadMusic}
            title={musicData?.title || 'Başlıksız.mp3'}
          />
        ) : (
          <Text style={styles.noVideoText}>
            Çevirmeden sonra müziğiniz burada gözükecek...
          </Text>
        )}

        <Pressable
          onPress={() => {
            if (musicConverted) {
              downloadMusic();
            } else {
              handleDownload();
            }
          }}
          style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>
            {musicConverted ? 'İndir' : 'MP3-e çevir'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: '#51A8FF',
    padding: 24,
    paddingTop: 32,
  },
  headerText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 28,
    height: 55,
    width: 55,
    position: 'absolute',
    right: 6,
  },
  downloadButton: {
    borderRadius: 28,
    width: 'auto',
    margin: 24,
    backgroundColor: '#51A8FF',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
  },
  loading: {
    justifyContent: 'center',
    margin: 50,
  },
  noVideoText: {
    color: 'rgba(8, 12, 47, 0.65)',
    fontSize: 20,
    fontFamily: 'Poppins-Light',
    margin: 40,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 17,
    fontFamily: 'Poppins-Light',
    margin: 6,
    textAlign: 'center',
  },
  subText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    paddingBottom: 24,
  },
});

export default App;
