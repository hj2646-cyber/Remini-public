import type { CapacitorConfig } from '@capacitor/cli';

// Remini 환자 앱 (Capacitor WebView 쉘)
// - 웹 자산은 H200 서버(<SERVER_IP>:8000)에서 서빙. 앱은 그 URL을 로드만 함.
// - 서버 URL만 바꾸려면 아래 server.url 수정 (빌드 재배포 필요).
// - iOS: HTTP 허용을 위해 ios/App/App/Info.plist의 NSAppTransportSecurity 편집 필요.
// - Android: AndroidManifest.xml application 태그에 android:usesCleartextTraffic="true" 필요.
const config: CapacitorConfig = {
  appId: 'com.remini.patient',
  appName: 'Remini',
  webDir: 'www',
  server: {
    url: 'http://<SERVER_IP>:8000',
    cleartext: true,
    allowNavigation: ['<SERVER_IP>', '<SERVER_IP>:8000'],
  },
  ios: {
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
