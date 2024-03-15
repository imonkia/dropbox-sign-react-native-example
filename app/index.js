import { Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
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
	
	const script = `
	window.ReactNativeWebView.postMessage('From webview');
	
	const signDocument = () => {
		const client = new window.HelloSign({
			clientId: '${CLIENT_ID}',
		});
		
		client.open('${signUrl}', {
			skipDomainVerification: true,
			container: document.getElementById('esig-container'),
			allowCancel: true,
			debut: true,
			testMode: true
		});
		
		client.on('close', data => {
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

	const onMessageHandler = event => {
		console.log(event.nativeEvent.data);
		if(event.nativeEvent.data == 'reload') {
			setTimeout(() => {
				wbRef.current.reload();
			}, 5000);
		};
	};
	
	const handlePress = () => {
		wbRef.current.injectJavaScript(script);
		setDisabled(true);
	};

	const createSignatureRequest = async () => {
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
				<View style={styles.signerDetailsWrapper}>
					<TextInput
						placeholder={'Name'}
						style={styles.signerDetailsInput}
						onChangeText={(val) => setSignerName(val)}
						value={signerName && signerName}
					/>
				</View>
				<View style={styles.signerDetailsWrapper}>
					<TextInput
						placeholder={'Email'}
						style={styles.signerDetailsInput}
						onChangeText={(val) => setSignerEmail(val)}
						keyboardType="email-address"
						value={signerEmail && signerEmail}
					/>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={createSignatureRequest}>
					<Text style={styles.buttonText}>
						Create Signature Request
					</Text>
				</TouchableOpacity>
			</View>
			<WebView
				ref={wbRef}
				javaScriptEnabled={true}
				originWhitelist={['*']}
				source={require('./index.html')}
				webviewDebuggingEnabled={true}
				onMessage={onMessageHandler}
			/>
			<View style={[styles.buttonContainer, { flexDirection: 'row', justifyContent: 'center' }]}>
				{!disabled &&				
					<TouchableOpacity style={styles.button} onPress={handlePress}>
						<Text style={styles.buttonText}>
							Open Document to Sign
						</Text>
					</TouchableOpacity>
				}
				{errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
			</View>
		</SafeAreaView>
		)
}

export default Home;