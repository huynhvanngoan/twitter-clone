const userTransformer = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    profileImage: user.profileImage,
    handle: "@" + user.username
  };
};

export { userTransformer as u };
//# sourceMappingURL=user.mjs.map
