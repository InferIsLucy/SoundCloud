export const getSongArtistFromArray = (artists) => {
  const artistName = artists.reduce((accumulator, currentArtist, index) => {
    if (index === artists.length - 1) {
      return accumulator + currentArtist.name;
    }
    return accumulator + currentArtist.name + ", ";
  }, "");
  return artistName;
};
