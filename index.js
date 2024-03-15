import { Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Page() {
  return(
		<WebView
			source={{ uri: 'https://www.google.com' }}
			style={{ marginTop: 20 }} 
		/>
	);
}