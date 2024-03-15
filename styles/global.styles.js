import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	buttonContainer: {
    justifyContent: 'space-between',
		flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 30
  },
  button: {
		marginTop: 30,
		borderRadius: 7,
    alignItems: 'center',
    backgroundColor: '#F3F4F8',
    padding: 10,
		width: '50%',
    width: '45%'
  },
	buttonText: {
		fontSize: 12
	},
	signerDetailsContainer: {
		justifyContent: "center",
    alignItems: "left",
    flexDirection: "column",
    marginTop: 30,
    height: 40,
    paddingHorizontal: 10,
	},
	signerDetailsWrapper: {
    backgroundColor: "#F3F4F8",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    height: "100%",
    width: "100%",
    marginBottom: 12
	},
	signerDetailsInput: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
	},
  signerDetailsLabel: {
    marginBottom: 3,
  }
});

export default styles;