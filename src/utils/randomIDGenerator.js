const generateRandomID = () => {
  const random1 = Math.random()
    .toString(36)
    .substring(2);
  const random2 = Math.random()
    .toString(36)
    .substring(2);
  return random1 + random2;
};

export default generateRandomID;
