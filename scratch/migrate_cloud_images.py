import os
import requests
from PIL import Image
import io

def download_and_optimize(url_id, output_name):
    # Google Drive Direct Link format
    url = f"https://drive.google.com/uc?export=download&id={url_id}"
    output_path = os.path.join('public/images/projects', f"{output_name}.webp")
    
    print(f"Downloading {url_id} -> {output_name}...")
    try:
        response = requests.get(url, stream=True, timeout=30)
        if response.status_code == 200:
            # Load into memory to optimize with Pillow
            img = Image.open(io.BytesIO(response.content))
            img.save(output_path, 'WEBP', quality=85)
            print(f"  Success: Saved to {output_path}")
            return True
        else:
            print(f"  Error: HTTP {response.status_code} for {url_id}")
            return False
    except Exception as e:
        print(f"  Exception for {url_id}: {e}")
        return False

# Mapping of ID to Descriptive Name
mapping = [
    # Buildings
    ("1q4rJ__ySenApJj0zcbEiw66fzemxIRmw", "buildings_hero"),
    ("1Kxjq5HfS3gnQ6b09cP1rRXo-EkWgtBFf", "buildings_analysis_1"),
    ("1Kq70vywpkjgRZoM3njsVFn4XId4BVQND", "buildings_analysis_2"),
    ("198G4mieNFsH1ebkuH1Xcpg1VupMw14Ay", "buildings_slab"),
    ("1O4pID4uOv2ndFNxNoPMfo80JVuwntyLC", "buildings_foundation"),
    
    # Warehouse
    ("1FgeymNs7v2rjQqHqka3zTWyiK_dFUQLK", "warehouse_hero"),
    ("1jgRxKEV5vgbnxbDmwmzZQ8bAlRbd4j-B", "warehouse_analysis_1"),
    ("1evXoYiqY_thn2xqmUg4sErjN2qVDMn_h", "warehouse_analysis_2"),
    ("1Icc1nxedhgH8fYCzmAr-LlhIaPW8Cjas", "warehouse_slab_1"), # Connection Design
    ("1kwovWRV3tCYCrbrXw-DmerAblwKLgG-D", "warehouse_slab_2"), 
    ("1aJRkYYbcJU_sSaYnYM5FXtIV1T8-AgBa", "warehouse_foundation"),
    
    # Retrofitting
    ("1aJHOf088jpFOHfqQJSGN1AfJom8z3ZWV", "retrofitting_analysis_1"),
    ("1snEJ4XfhrEy1p9PGBj08kcI-AvoBNU6D", "retrofitting_analysis_2"),
    ("1mnIhdgfSw2nRG0Yt1l6pxMhkcGpxOH78", "retrofitting_slab"),
    ("1iKYM1D3PJ-xbk13KM6a8Ya6LKWOeR1kQ", "retrofitting_foundation"),
    
    # Residential
    ("1YdBJUZzSrTtEZLDaN0RMw5WgM2jBKvaM", "residential_hero")
]

if __name__ == "__main__":
    if not os.path.exists('public/images/projects'):
        os.makedirs('public/images/projects')
        
    success_count = 0
    for url_id, name in mapping:
        if download_and_optimize(url_id, name):
            success_count += 1
            
    print(f"\nMigration Complete. {success_count}/{len(mapping)} images optimized.")
