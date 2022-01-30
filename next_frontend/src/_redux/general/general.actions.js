export const setCurrentUser = (currentUser) => {
  return {
    type: "SET_CURRENT_USER",
    payload: currentUser,
  };
};

