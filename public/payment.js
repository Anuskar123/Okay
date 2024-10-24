document.addEventListener('DOMContentLoaded', function() {
    const qrContainer = document.getElementById('qr-container');
    const qrCode = document.getElementById('qr-code');

    window.showEsewaQR = function() {
        qrCode.src = 'images/esewaqr.jpg'; // Replace with the actual eSewa QR code image path
        qrContainer.style.display = 'block';
    };

    window.showPayPalQR = function() {
        qrCode.src = 'images/paypalqr.jpg'; // Replace with the actual PayPal QR code image path
        qrContainer.style.display = 'block';
    };
});