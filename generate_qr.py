import qrcode

# The destination for Omondi and other farmers
url = "https://okoth-hash.github.io/agrimastery-platform/"

# Configure the QR code appearance
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Generate the image with your brand colors (Green and White)
img = qr.make_image(fill_color="#1B4332", back_color="white")
img.save("AgriMastery_Access_QR.png")

print("--- QR CODE GENERATED ---")
print("Check your folder for 'AgriMastery_Access_QR.png'")
