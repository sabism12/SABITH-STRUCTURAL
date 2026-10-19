// Intrinsic sizes of the photos and screenshots, so the browser reserves their space before they load.
// Regenerate if images change.
export const imageSizes: Record<string, [number, number]> = {
  "/images/model.webp": [1372, 923],
  "/images/piles.webp": [1383, 944],
  "/images/plugins/detailer-full.webp": [1120, 591],
  "/images/plugins/detailer.webp": [886, 591],
  "/images/plugins/footing-dialog-full.webp": [1121, 573],
  "/images/plugins/footing-dialog.webp": [860, 573],
  "/images/plugins/safe-result-full.webp": [1121, 591],
  "/images/plugins/safe-result.webp": [1200, 800],
  "/images/portrait.webp": [1024, 1024],
  "/images/projects/buildings_analysis_1.webp": [1531, 903],
  "/images/projects/buildings_analysis_2.webp": [1448, 923],
  "/images/projects/buildings_foundation.webp": [1246, 894],
  "/images/projects/buildings_hero.webp": [1008, 672],
  "/images/projects/buildings_slab.webp": [1278, 899],
  "/images/projects/residential_hero.webp": [736, 456],
  "/images/projects/retrofitting_analysis_1.webp": [1166, 899],
  "/images/projects/retrofitting_analysis_2.webp": [1344, 897],
  "/images/projects/retrofitting_foundation.webp": [2400, 1792],
  "/images/projects/retrofitting_slab.webp": [645, 429],
  "/images/projects/warehouse_analysis_1.webp": [1526, 813],
  "/images/projects/warehouse_analysis_2.webp": [1817, 804],
  "/images/projects/warehouse_foundation.webp": [1545, 660],
  "/images/projects/warehouse_hero.webp": [1280, 768],
  "/images/projects/warehouse_slab_1.webp": [1262, 760],
  "/images/projects/warehouse_slab_2.webp": [1196, 743],
  "/images/slab retrofitting.webp": [645, 429],
  "/images/slab.webp": [797, 566],
};

export const sizeOf = (src: string) => {
  const s = imageSizes[src];
  return s ? { width: s[0], height: s[1] } : {};
};
