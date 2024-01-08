import {StyleSheet, Text, View} from 'react-native';
import Input from './Input';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>
        Download your favorite Music or Video!
      </Text>
      <Input />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
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
});
