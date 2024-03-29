import {StyleSheet} from 'react-native';

export const mainStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: '#51A8FF',
    padding: 24,
    paddingTop: 40,
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
  langSwitchContainer: {
    position: 'absolute',
    right: 24,
    top: 10,
  },
  downloadLoadingStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cacaca7a',
    borderRadius: 28,
  },
});
