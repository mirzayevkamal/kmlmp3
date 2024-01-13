import {StyleSheet, TextInput} from 'react-native';
import i18n from '../i18n';

const Input = ({...props}) => {
  return (
    <TextInput
      placeholder={i18n.t('INPUT_TEXT')}
      style={styles.input}
      {...props}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderRadius: 28,
    backgroundColor: 'white',
    padding: 10,
    height: 55,
    fontSize: 18,
    color: 'rgba(8, 12, 47, 0.65)',
    flex: 1,
  },
});
