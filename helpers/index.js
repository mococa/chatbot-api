export const errorHandler = (error, res) => {
  if (error.errors) {
    return res
      .status(500)
      .json({ message: Object.values(error.errors)[0].properties.message });
  }
  return res.status(error.status || 500).json({ message: error.message });
};
