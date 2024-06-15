export const formatPaginate = (err, result) => {
  console.log("RESULT", result);

  const response = {
    ...result,
    data: result.docs,
    docs: undefined,
  };
  return response;
};

export const basePaginationOptions = {
  page: 1,
  limit: 10,
  sort: "-createdAt",
  // populate: [
  //   { path: "client_id", model: Client },
  //   { path: "required_skills", model: Skill },
  //   { path: "expected_duration_id", model: ExpectedDuration },
  //   { path: "complexity_id", model: Complexity },
  // ],
};
