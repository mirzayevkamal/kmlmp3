import axios from 'axios';
import {Alert} from 'react-native';
import RNFS, {exists} from 'react-native-fs';
import i18n from '../i18n';
import analytics from '@react-native-firebase/analytics';

export const downloadMusicFromEndpoint = async (endpoint: any) => {
  try {
    const response = await axios.get(endpoint.url, {
      params: endpoint.params,
      headers: endpoint.headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading music: ${error.message}`);
    analytics().logEvent('music_download_error');
    return null;
  }
};

export const downloadFile = async (
  filePath: string,
  musicData: {
    link: string;
    title: string;
    downloadUrl?: string;
  },
  successCb: () => void,
  errorCb: () => void,
) => {
  const isFileAlreadyExist = await exists(filePath);
  if (isFileAlreadyExist) {
    Alert.alert(i18n.t('FILE_EXISTS_TITLE'), i18n.t('FILE_EXISTS_TEXT'), [
      {text: 'Kapat', onPress: () => console.log('OK Pressed')},
    ]);
    errorCb();
  } else {
    RNFS.downloadFile({
      fromUrl: musicData.link || musicData.downloadUrl || '',
      toFile: filePath,
    })
      .promise.then(response => {
        console.log('File downloaded!', response);
        successCb();
      })
      .catch(err => {
        analytics().logEvent('fs_download_error');
        errorCb()
        console.log('Download error:', err);
      });
  }
};
