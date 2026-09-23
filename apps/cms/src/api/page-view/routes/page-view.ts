export default {
  routes: [
    {
      method: "POST",
      path: "/page-views",
      handler: "page-view.create",
      config: { auth: false },
    },
  ],
};
