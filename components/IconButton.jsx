import {Button, Image, StyleSheet} from 'react-native';

const IconButton = ({...props}) => {
  return (
    <Button style={styles.button} title="" {...props} onPress={() => {}}>
      <Image
        source={props.icon}
        resizeMode="contain"
        style={{width: 24, height: 24}}
      />
    </Button>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    backgroundColor: 'red',
    padding: 10,
    height: 55,
    fontSize: 18,
    marginTop: 24,
  },
});
