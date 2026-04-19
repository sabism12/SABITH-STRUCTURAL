import os
from PIL import Image

def compress_hero_sequence():
    folder = 'public/images/hero-sequence'
    if not os.path.exists(folder):
        print(f"Folder {folder} not found.")
        return

    files = [f for f in os.listdir(folder) if f.endswith('.png')]
    files.sort()

    print(f"Found {len(files)} frames in hero-sequence. Starting compression...")

    for filename in files:
        filepath = os.path.join(folder, filename)
        try:
            with Image.open(filepath) as img:
                # Convert to WebP with 85 quality
                webp_name = os.path.splitext(filename)[0] + '.webp'
                webp_path = os.path.join(folder, webp_name)
                
                # Check if it's already there (optional)
                img.save(webp_path, 'WEBP', quality=85)
            
            # Delete original PNG after successful conversion
            os.remove(filepath)
            print(f"Compressed: {filename} -> {webp_name}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

def compress_loose_images():
    images = ['portrait.png', 'slab.png', 'model.png', 'piles.png', 'slab retrofitting.png']
    folder = 'public/images'
    
    for filename in images:
        filepath = os.path.join(folder, filename)
        if not os.path.exists(filepath):
            continue
            
        try:
            with Image.open(filepath) as img:
                webp_name = os.path.splitext(filename)[0] + '.webp'
                webp_path = os.path.join(folder, webp_name)
                img.save(webp_path, 'WEBP', quality=85)
                
            # If it was large (>500KB), we might want to delete the original or keep it.
            # For the loose ones, I'll keep the PNGs for now until code is updated.
            # Actually, I'll delete portrait.png specifically since it was 2MB.
            if filename == 'portrait.png':
                os.remove(filepath)
                
            print(f"Compressed static asset: {filename} -> {webp_name}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    compress_hero_sequence()
    compress_loose_images()
    print("Optimization Complete.")
