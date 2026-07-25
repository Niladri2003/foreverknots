// True aspect ratios (width / height) of the local journal photos in
// /public/photos. Used to give each masonry frame a definite height up front,
// so react-responsive-masonry can balance columns before the images load and
// each frame matches its photo exactly (no crop). Regenerate after adding
// images: `sips -g pixelWidth -g pixelHeight <file>` → width/height.
export const PHOTO_RATIOS = {
  '/photos/arnab-swagata-01.jpg': 1.5,
  '/photos/arnab-swagata-02.jpg': 0.66,
  '/photos/arnab-swagata-03.jpg': 0.623,
  '/photos/arnab-swagata-04.jpg': 0.707,
  '/photos/arnab-swagata-05.jpg': 1.5,
  '/photos/avirimpa-01.jpg': 1.5,
  '/photos/avirimpa-02.jpg': 1.5,
  '/photos/avirimpa-03.jpg': 1.5,
  '/photos/avirimpa-04.jpg': 1.432,
  '/photos/avirimpa-05.jpg': 1.5,
  '/photos/avirimpa-06.jpg': 1.446,
  '/photos/prathama-surajit-01.jpg': 1.5,
  '/photos/prathama-surajit-02.jpg': 0.773,
  '/photos/prathama-surajit-03.jpg': 0.664,
  '/photos/prathama-surajit-04.jpg': 1.304,
  '/photos/prathama-surajit-05.jpg': 1.5,
  '/photos/prathama-surajit-06.jpg': 1.459,
  '/photos/soumaydip-arina-01.jpg': 1.5,
  '/photos/soumaydip-arina-02.jpg': 1.5,
  '/photos/soumaydip-arina-03.jpg': 1.5,
  '/photos/soumaydip-arina-04.jpg': 1.571,
  '/photos/soumaydip-arina-05.jpg': 1.5,
  '/photos/sudipta-shaheli-01.jpg': 1.5,
  '/photos/sudipta-shaheli-02.jpg': 0.667,
  '/photos/sudipta-shaheli-03.jpg': 1.5,
  '/photos/sudipta-shaheli-04.jpg': 1.448,
  '/photos/sudipta-shaheli-05.jpg': 1.5,
  '/photos/sudipta-shaheli-06.jpg': 1.5,
  '/photos/sudipta-shaheli-07.jpg': 1.5,
  '/photos/yujanti-subham-01.jpg': 1.5,
  '/photos/yujanti-subham-02.jpg': 0.667,
  '/photos/yujanti-subham-03.jpg': 0.667,
  '/photos/yujanti-subham-04.jpg': 1.451,
  '/photos/yujanti-subham-05.jpg': 1.5,
};

// Fallback ratio for any photo not in the map (e.g. a Cloudinary-hosted name).
export const ratioFor = (name) => PHOTO_RATIOS[name] || 1.5;
