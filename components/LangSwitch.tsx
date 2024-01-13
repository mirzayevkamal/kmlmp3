import {Image, Pressable, StyleSheet} from 'react-native';

export const LangSwitch = ({
  selectedLang,
  onPress,
}: {
  selectedLang: string;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      {selectedLang === 'tr' ? (
        <Image
          style={styles.flagIcon}
          source={require('../assets/images/en.png')}
        />
      ) : (
        <Image
          style={styles.flagIcon}
          source={require('../assets/images/tr.png')}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flagIcon: {
    width: 32,
    height: 32,
  },
});
