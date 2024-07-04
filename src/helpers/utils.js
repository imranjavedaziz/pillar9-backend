const checkTokenExpired = async (createdAt) => {
  const now = new Date();
  const diff = now.getMinutes() - createdAt.getMinutes();
  // const diffHours = diff / (1000 * 60);
  console.log("diffHours", diff);
  if (diff > 10) return true;
  return false;
};
module.exports = { checkTokenExpired };
