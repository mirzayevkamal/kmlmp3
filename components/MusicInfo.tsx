import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import i18n from '../i18n';

const MusicInfo = ({
  title,
  onPress,
  children
}: {
  title?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.imageContainer}>
      <View style={styles.imageBg}>
        <Image
          style={{width: 90, height: 90, marginHorizontal: 10}}
          source={require('../assets/images/music.png')}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.musicTitle}>{title?.slice(0, 40) + '...'}</Text>
        <Text style={styles.musicDesc}>{i18n.t('CLICK_TO_DOWNLOAD')}</Text>
      </View>
      {children}
    </Pressable>
  );
};

export default MusicInfo;

const styles = StyleSheet.create({
  imageContainer: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 28,
    shadowColor: 'rgba(178, 178, 178, 1)',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 55,
    margin: 24,
    gap: 8,
  },
  musicTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#080C2F',
    width: 'auto',
    flexWrap: 'wrap',
  },
  musicDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(8, 12, 47, 0.65)',
  },
  imageBg: {
    backgroundColor: '#D0F8EC',
    borderRadius: 28,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: 'auto',
    flex: 1
  },
});
