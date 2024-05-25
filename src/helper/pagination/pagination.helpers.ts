export const formatPaginate = (err, result) => {
  console.log("RESULT", result);

  const response = {
    ...result,
    data: result.docs,
    docs: undefined,
  };
  return response;
};
