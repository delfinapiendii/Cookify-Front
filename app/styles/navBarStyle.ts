// navbarStyles.js
import { StyleSheet } from 'react-native';

const navbarStyles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 20,
    left: 7,
    right: 7,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF9A16',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  navItem: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#FF9A16',
    borderRadius: 30,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});

export default navbarStyles;
