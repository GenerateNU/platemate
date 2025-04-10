import { makeRequest } from "@/api/base";

export async function createFollow(followerId: string, followeeId: string) {
  return await makeRequest(
      "/api/v1/user/follow", 
      "POST", 
      { followerId, followeeId },
      "Failed to follow user"
  );
}

export async function deleteFollow(followerId: string, followeeId: string) {
  return await makeRequest(
      "/api/v1/user/follow", 
      "DELETE", 
      { followerId, followeeId },
      "Failed to unfollow user"
  );
}
