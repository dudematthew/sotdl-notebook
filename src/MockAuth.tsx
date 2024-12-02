import { User } from "./AuthContext";

export const MockAuth = {
  currentAuthenticatedUser: async (): Promise<User> => {
    const user = JSON.parse(localStorage.getItem("mockUser") || "null");
    if (user) {
      return {
        ...user,
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
      };
    } else {
      throw new Error("Not authenticated");
    }
  },
  signIn: async (username: string, password: string) => {
    if (
      username === import.meta.env.VITE_COGNITO_TEST_USERNAME &&
      password === import.meta.env.VITE_COGNITO_TEST_PASSWORD
    ) {
      const user = {
        username,
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
        attributes: {
          email: `${username}@example.com`,
          created_at: new Date().toISOString(),
        },
      };
      localStorage.setItem("mockUser", JSON.stringify(user));
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  },
  signOut: async () => {
    localStorage.removeItem("mockUser");
  },
};
