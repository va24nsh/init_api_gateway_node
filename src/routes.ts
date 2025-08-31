export default [
  {
    path: "/auth",
    target: process.env.auth_service_api || "http://localhost:5001",
    authRequired: false,
  },
  {
    path: "/user",
    target: process.env.user_service_api || "http://localhost:5002",
    authRequired: true,
  }
];
