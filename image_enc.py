import base64
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.Random import get_random_bytes
import os

def encrypt_image_for_js(image_path, password, output_file):
    # Create a key from the password using SHA-256
    key = SHA256.new(password.encode()).digest()

    # Generate a random IV (16 bytes for AES)
    iv = get_random_bytes(16)

    # Read the image data
    with open(image_path, 'rb') as f:
        image_data = f.read()

    # Pad the image data to make its length a multiple of 16
    pad_length = 16 - (len(image_data) % 16)
    padded_data = image_data + bytes([pad_length] * pad_length)

    # Encrypt the data using AES-CBC
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_data = cipher.encrypt(padded_data)

    # Combine IV and encrypted data
    encrypted_blob = iv + encrypted_data

    # Encode as Base64
    encrypted_base64 = base64.b64encode(encrypted_blob).decode('utf-8')

    # Write the Base64 data to the output file
    with open(output_file, 'w') as f:
        f.write(encrypted_base64)

    print(f"Encrypted image saved to {output_file} as Base64.")

# Example usage
if __name__ == "__main__":
    image_path = r"images\challenge2.png"
    password = "caffeine"
    output_file = image_path + ".enc"
    encrypt_image_for_js(image_path, password, output_file)
