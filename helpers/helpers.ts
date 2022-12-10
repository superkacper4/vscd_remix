export const cutTimeFromDate = ({ date }: { date: Date }) => {
  return String(date).slice(0, String(date).indexOf("T"));
};

export const mergeFiles = (primaryArr, secondaryArr) => {
  // merging old files with new ones (merge condition -> file name)
  const concatedArr = primaryArr.concat(secondaryArr);

  const sortedArr = concatedArr.sort(function (a, b) {
    // sort files from oldest to newest
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const duplicatFreeObject = sortedArr.reduce(
    // create an object to replace duplicats
    (acc, cur) => ({ ...acc, [cur.name]: cur }),
    {}
  );

  // crate array from duplicats free object
  var duplicatFreeArray = Object.keys(duplicatFreeObject).map(
    (key) => duplicatFreeObject[key]
  );

  const duplicatFreeFilesIds = duplicatFreeArray.map((file) => file.id);

  return duplicatFreeFilesIds;
};
