import { fetchAuthSession } from "aws-amplify/auth";

export async function getAccessToken(): Promise<string | null> {
  try {
    console.log("Fetching auth session...");
    const session = await fetchAuthSession();
    console.log("Session obtained:", !!session);
    console.log("Access token present:", !!session.tokens?.accessToken);
    return session.tokens?.accessToken?.toString() || null;
  } catch (error) {
    console.error("Error getting access token:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return null;
  }
}
