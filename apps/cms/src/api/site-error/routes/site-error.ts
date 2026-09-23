export default {
  routes: [
    {
      method: "POST",
      path: "/site-errors",
      handler: "site-error.create",
      config: { auth: false },
    },
  ],
};
