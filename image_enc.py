import base64
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.Random import get_random_bytes
import json
import os

def encrypt_file_for_js(image_path, password, output_file):
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


def process_challenges_from_config(source_folder, config_file, output_folder, output_json):
    # Load the config file
    with open(config_file, 'r') as f:
        config = json.load(f)

    hashes = {}

    for entry in config:
        file_name = entry['image']
        password = entry['password']

        # Construct full paths for the source and output files
        file_path = os.path.join(source_folder, file_name)
        output_file = os.path.join(output_folder, file_name + ".enc")

        if not os.path.exists(file_path):
            print(f"Error: {file_path} does not exist.")
            continue

        # Encrypt the challenge
        encrypt_file_for_js(file_path, password, output_file)

        # Compute the SHA-256 hash of the password
        password_hash = SHA256.new(password.encode()).hexdigest()

        # Add to the JSON structure
        hashes[password_hash] = file_name

    # Save the JSON structure
    with open(output_json, 'w') as f:
        json.dump(hashes, f, indent=4)

    print(f"Image hashes saved to {output_json}.")


# Example usage
if __name__ == "__main__":
    source_folder = "challenge_source_files"          # Folder containing the source files
    config_file = "challenges.json"              # Configuration file with image names and passwords
    output_folder = "challenge_files"       # Folder to store the encrypted files
    output_json = "assets/challengeHashes.json"  # Output JSON file for hashes

    # Ensure the output folders exist
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(os.path.dirname(output_json), exist_ok=True)

    # Process the challenges
    process_challenges_from_config(source_folder, config_file, output_folder, output_json)
