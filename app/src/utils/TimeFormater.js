export const formatTime = (durationMillis) => {
  //279.902

  const minutes = Math.floor(durationMillis / 1000 / 60);
  const seconds = Math.floor((durationMillis / 1000) % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
export function convertFirebaseTimestamp(timestamp) {
  const date = timestamp.toDate();
  const hours = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
export const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
