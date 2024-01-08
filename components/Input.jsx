import {StyleSheet, TextInput} from 'react-native';

const Input = ({...props}) => {
  return (
    <TextInput placeholder="Video URL girin" style={styles.input} {...props} />
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
