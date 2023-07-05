export const getSongArtistFromArray = (artists) => {
  const artistName = artists.reduce((accumulator, currentArtist, index) => {
    if (index === artists.length - 1) {
      return accumulator + currentArtist.name;
    }
    return accumulator + currentArtist.name + ", ";
  }, "");
  return artistName;
};

export const formatListenNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};
