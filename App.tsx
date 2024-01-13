import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Input from './components/Input';
import MusicInfo from './components/MusicInfo';
import {isYouTubeUrl, parseId} from './utils/url-check';
import mobileAds, {
  InterstitialAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import RNFS from 'react-native-fs';
import {mainStyles} from './styles/app-style';
import {downloadFile, downloadMusicFromEndpoint} from './utils/download';
import i18n from './i18n';
import {LangSwitch} from './components/LangSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-1189765057441007/5108604834';

const bannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-1189765057441007/8146535989';

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
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const [currentLanguage, setCurrentLanguage] = React.useState('en');

  const setSavedLocale = async (lang: string) => {
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.log(error);
    }
  };

  const getSavedLocale = async () => {
    try {
      const locale = await AsyncStorage.getItem('language');
      if (locale !== null) {
        setCurrentLanguage(locale);
        i18n.locale = locale;
      }
    } catch (error) {
      console.log(error);
      return 'en';
    }
  };

  useEffect(() => {
    getSavedLocale();
  }, []);

  const handleLanguageSwitch = async () => {
    const newLanguage = currentLanguage === 'en' ? 'tr' : 'en';
    i18n.locale = newLanguage;
    setCurrentLanguage(newLanguage);
    setSavedLocale(newLanguage);
  };

  const musicConverted = musicData.link || musicData.downloadUrl;
  const filePath =
    RNFS.DownloadDirectoryPath +
    '/' +
    (musicData.title.replace(/\s/g, '_') || 'ytmuzik') +
    '.mp3';

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log('Ads initialized');
      });

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
        if (musicData.link || musicData.downloadUrl) {
          setDownloadLoading(true);
          downloadFile(
            filePath,
            musicData,
            () => {
              successAlert();
              setDownloadLoading(false);
              analytics().logEvent('download_success');
            },
            () => {
              setDownloadLoading(false);
              analytics().logEvent('download_error');
            },
          );
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

  const downloadMusicRecursive = async (currentEndpointIndex: any) => {
    if (currentEndpointIndex >= endpoints.length) {
      setIsLoading(false);
      throw new Error('All attempts failed. Unable to download music.');
    }

    const musicData = await downloadMusicFromEndpoint(
      endpoints[currentEndpointIndex],
    );

    if (musicData) {
      setMusicData(musicData);
      setIsLoading(false);
      return musicData;
    } else {
      downloadMusicRecursive(currentEndpointIndex + 1);
    }
  };

  const handleDownload = async () => {
    if (!isYouTubeUrl(videoUrl)) {
      setError(i18n.t('INVALID_URL_ERROR'));
      return;
    }
    if (musicData.link || musicData.downloadUrl) {
      return;
    }
    setError('');
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      await downloadMusicRecursive(0);
    } catch (error) {
      console.log('error when converting', error);
      analytics().logEvent('convert_error');
    }
  };

  const downloadMusic = async () => {
    if (musicData.link || musicData.downloadUrl) {
      interstitial.show();
    }
  };

  const successAlert = () => {
    Alert.alert(i18n.t('DOWNLOAD_SUCCESS'), i18n.t('DOWNLOAD_SUCCESS_TEXT'), [
      {text: i18n.t('CLOSE'), onPress: () => console.log('OK Pressed')},
    ]);
    setDownloadLoading(false);
  };

  const clearData = () => {
    setMusicData({link: '', title: '', downloadUrl: ''});
    setVideoUrl('');
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      <ScrollView style={mainStyles.container}>
        {loaded && (
          <BannerAd
            unitId={bannerAdUnitId as string}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        )}
        <View style={mainStyles.headerContainer}>
          <View style={mainStyles.langSwitchContainer}>
            <LangSwitch
              selectedLang={currentLanguage}
              onPress={handleLanguageSwitch}
            />
          </View>
          <Text style={mainStyles.headerText}>{i18n.t('MAIN_TITLE')}</Text>
          <Text style={mainStyles.subText}>{i18n.t('MAIN_DESCRIPTION')}</Text>
          <View style={mainStyles.inputContainer}>
            <Input onChangeText={setVideoUrl} value={videoUrl} />
            <Pressable
              onPress={() => {
                if (musicConverted) {
                  clearData();
                } else {
                  handleDownload();
                }
              }}
              style={mainStyles.imageContainer}>
              <Image
                source={
                  musicConverted
                    ? require('./assets/images/clear.png')
                    : require('./assets/images/Search.png')
                }
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </Pressable>
          </View>
        </View>
        <Text style={mainStyles.errorText}>{error}</Text>

        {isLoading && <ActivityIndicator style={mainStyles.loading} />}
        {musicConverted ? (
          <MusicInfo
            onPress={downloadMusic}
            title={musicData?.title || `${i18n.t('UNTITLED')}`}
            children={
              downloadLoading ? (
                <ActivityIndicator style={mainStyles.downloadLoadingStyle} />
              ) : null
            }
          />
        ) : (
          <Text style={mainStyles.noVideoText}>
            {i18n.t('NOT_CONVERTED_YET_TEXT')}
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
          style={mainStyles.downloadButton}>
          <Text style={mainStyles.downloadButtonText}>
            {musicConverted ? i18n.t('DOWNLOAD') : i18n.t('CONVERT_TO_MP3')}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
