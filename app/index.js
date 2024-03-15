import { Text, View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { API_KEY, CLIENT_ID } from '@env';

import axios from 'axios';
import base64 from 'react-native-base64';
import styles from '../styles/global.styles';

const headers = {
	'Authorization': 'Basic ' + base64.encode(`${API_KEY}:`),
	'Content-Type': 'multipart/form-data'
};

let data = new FormData();

data.append('test_mode', '1');
data.append('client_id', CLIENT_ID);
data.append('file_urls[0]', 'https://www.dropbox.com/s/ad9qnhbrjjn64tu/mutual-NDA-example.pdf?dl=1');

const Home = () => {
	const [signUrl, setSignUrl] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [signerName, setSignerName] = useState('');
	const [signerEmail, setSignerEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	
	const wbRef = useRef(WebView);
	
	// JavaScript containing the Dropbox Sign front-end client code.
	const script = `
	window.ReactNativeWebView.postMessage('postMessage from webview');
	
	const signDocument = () => {
		const client = new window.HelloSign({
			clientId: '${CLIENT_ID}',
		});
		
		client.open('${signUrl}', {
			skipDomainVerification: true,
			container: document.getElementById('esig-container'),
			debug: true,
			testMode: true
		});
		
		client.on('close', data => {
			// Sending message back to the web app to trigger a reload of the WebView content only.
			// I.E. "Garbage collection" since the WebView does not reload on state updates.
			window.ReactNativeWebView.postMessage('reload');
		});

		client.on('error', data => {
			client.close();
		});

		client.on('sign', data => {
			client.close();
		});

		client.on('decline', data => {
			client.close();
		});
	};

	signDocument();
	`

	// Function to handle messages coming from the WebView content.
	const onMessageHandler = event => {
		console.log(event.nativeEvent.data);
		// Where the WebView reload happens.
		if(event.nativeEvent.data == 'reload') {
			setTimeout(() => {
				wbRef.current.reload();
			}, 5000);
		};
	};
	
	// Function to handle when "Create Signature Request" button is pressed.
	// This is where the JS code containing the Dropbox Sign front-end client code is injected into the WebView
	// to trigger the iframe to open.
	const handlePress = () => {
		wbRef.current.injectJavaScript(script);
		setDisabled(true);
	};

	// Function to send the request to the API to create a signature request.
	const createSignatureRequest = async () => {
		Keyboard.dismiss();
		if(signerName === '' || signerEmail === '') {
			alert('Please enter signer details');
			return;
		}

		data.append('signers[0][name]', signerName);
		data.append('signers[0][email_address]', signerEmail);

		try {
			const res = await axios.post(`https://api.hellosign.com/v3/signature_request/create_embedded`, data, {
				headers: headers
			})
			const signId = res.data.signature_request.signatures[0].signature_id;
			setDisabled(false);
			setSignerName('');
			setSignerEmail('');
			setErrorMessage('');
			const url = await axios.get(`https://api.hellosign.com/v3/embedded/sign_url/${signId}`, {
				headers: headers
			})
			setSignUrl(url.data.embedded.sign_url);
		} catch (error) {
			if(error.response) {
				console.log(error.response.data.error.error_msg);
				setErrorMessage(error.response.data.error.error_msg);
			}
		};
	};
	
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.signerDetailsContainer}>
				<Text style={styles.signerDetailsLabel}>Enter Name:</Text>
				<View style={styles.signerDetailsWrapper}>
					<TextInput
						placeholder='Name'
						placeholderTextColor={'lightgrey'}
						style={styles.signerDetailsInput}
						onChangeText={(val) => {setSignerName(val); errorMessage && setErrorMessage('')}}
						value={signerName && signerName}
					/>
				</View>
				<Text style={styles.signerDetailsLabel}>Enter Email:</Text>
				<View style={styles.signerDetailsWrapper}>
					<TextInput
						placeholder='Email'
						placeholderTextColor={'lightgrey'}
						style={styles.signerDetailsInput}
						onChangeText={(val) => {setSignerEmail(val); errorMessage && setErrorMessage('')}}
						keyboardType="email-address"
						value={signerEmail && signerEmail}
						onSubmitEditing={Keyboard.dismiss}
					/>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={createSignatureRequest}>
					<Text style={styles.buttonText}>
						Create Signature Request
					</Text>
				</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={handlePress} disabled={disabled}>
						{disabled
						?
						<Text style={[styles.buttonText, { opacity: disabled && 0.2}]}>
							No Document Available
						</Text>
						:
						<Text style={styles.buttonText}>
							Open Document to Sign
						</Text>
						}
					</TouchableOpacity>
			</View>
			{errorMessage !== '' && alert(errorMessage)}
			<WebView
				ref={wbRef}
				javaScriptEnabled={true}
				originWhitelist={['*']}
				source={require('./index.html')}
				webviewDebuggingEnabled={true}
				onMessage={onMessageHandler}
			/>
		</SafeAreaView>
		)
}

export default Home;