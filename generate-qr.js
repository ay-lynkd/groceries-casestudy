const QRCode = require('qrcode');
const fs = require('fs');

const url = 'exp://192.168.1.190:8081';

QRCode.toString(url, { type: 'terminal', small: true }, (err, string) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('\n=== SCAN THIS QR CODE WITH EXPO GO ===\n');
  console.log(string);
  console.log('\n=== OR ENTER THIS URL MANUALLY ===');
  console.log(url);
  console.log('');
});

QRCode.toFile('expo-qr.png', url, (err) => {
  if (err) {
    console.error('File error:', err);
    return;
  }
  console.log('✅ QR code also saved to: expo-qr.png');
});
