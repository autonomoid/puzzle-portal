import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from Crypto.Hash import SHA256
from Crypto.Util.Padding import pad
import os

def decrypt_file(file_path, password, output_file):
    try:
        # Read the Base64-encoded encrypted file
        with open(file_path, 'r') as f:
            encrypted_base64 = f.read()

        # Decode Base64 to get the raw binary data
        encrypted_blob = base64.b64decode(encrypted_base64)
        print(f"encrypted_base64 (16 Bytes): {list(encrypted_base64[:16])}")
        print(f"encrypted_blob (16 Bytes): {list(encrypted_blob[:16])}")
        print(f"encrypted_blob (-16 Bytes): {list(encrypted_blob[-16:])}")

        # Extract the IV and encrypted content
        iv = encrypted_blob[:16]
        encrypted_content = encrypted_blob[16:]

        # Derive the cryptographic key from the password using SHA-256
        key = SHA256.new(password.encode()).digest()

        # Decrypt the data
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_data = cipher.decrypt(encrypted_content)

        padding_length = decrypted_data[-1]
        print(f"IV: {list(iv)}")
        print(f"Decrypted Data Length: {len(decrypted_data)}")
        print(f"Decrypted Data (Last 16 Bytes): {list(decrypted_data[-16:])}")
        print(f"Padding Length (Decrypted): {padding_length}")
        print(f"Padding Bytes (Decrypted): {list(decrypted_data[-padding_length:])}")

        # Remove PKCS#7 padding
        unpadded_data = unpad(decrypted_data, AES.block_size)

        # Save the decrypted data to the output file
        with open(output_file, 'wb') as f:
            f.write(unpadded_data)

        print(f"Decrypted file saved to {output_file}")

    except Exception as e:
        print(f"Error during decryption: {e}")

# Example usage
if __name__ == "__main__":
    encrypted_file = r"challenge_files\challenge2.png.enc"  # Path to the encrypted .enc file
    output_file = "challenge2.png"        # Path to save the decrypted file
    password = "caffeine"               # Password used for encryption

    decrypt_file(encrypted_file, password, output_file)
