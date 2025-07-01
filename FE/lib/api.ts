import type { 
  Marathon, 
  MarathonInput, 
  Rating, 
  RatingInput, 
  Review, 
  ReviewInput, 
  ReviewResponse,
  User,
  UserInput,
  LoginInput,
  Application,
  ApplicationInput,
  ApplicationResponse
} from "./types";

const API_URL = "/api/marathons";
const RATING_API_URL = "/api/ratings";
const REVIEW_API_URL = "/api/reviews";
const USER_API_URL = "/api/users";
const APPLICATION_API_URL = "/api/applications";

// User Authentication
export async function login(data: LoginInput): Promise<User> {
  const response = await fetch(`${USER_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json();
}

export async function register(data: UserInput): Promise<User> {
  const response = await fetch(`${USER_API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.status}`);
  }

  return response.json();
}

export async function getUser(id: string): Promise<User> {
  const response = await fetch(`${USER_API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to get user: ${response.status}`);
  }

  return response.json();
}

// Marathon functions (updated for enterprise support)
export async function fetchMarathons(params?: {
  name?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  enterpriseId?: string;
}): Promise<Marathon[]> {
  const queryParams = new URLSearchParams();

  if (params?.name) queryParams.append('name', params.name);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params?.enterpriseId) queryParams.append('enterpriseId', params.enterpriseId);

  const response = await fetch(`${API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch marathons: ${response.status}`);
  }

  return response.json();
}

export async function fetchMarathon(id: string): Promise<Marathon> {
  const response = await fetch(`${API_URL}/id/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch marathon: ${response.status}`);
  }

  return response.json();
}

export async function createMarathon(data: MarathonInput): Promise<Marathon> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create marathon: ${response.status}`);
  }

  return response.json();
}

export async function updateMarathon(
  id: string,
  data: MarathonInput
): Promise<Marathon> {
  const response = await fetch(`/api/marathons/id/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update marathon: ${response.status}`);
  }

  return response.json();
}

export async function deleteMarathon(id: string): Promise<void> {
  const response = await fetch(`/api/marathons/id/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete marathon: ${response.status}`);
  }
}

export async function getEnterpriseMarathons(enterpriseId: string): Promise<Marathon[]> {
  const response = await fetch(`${API_URL}/enterprise/${enterpriseId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch enterprise marathons: ${response.status}`);
  }

  return response.json();
}

// Application functions
export async function applyToRace(
  raceId: string,
  data: ApplicationInput
): Promise<Application> {
  const response = await fetch(`${APPLICATION_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raceId,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to apply to race: ${response.status}`);
  }

  return response.json();
}

export async function getRaceApplications(raceId: string): Promise<ApplicationResponse> {
  const response = await fetch(`${APPLICATION_API_URL}?raceId=${raceId}`);

  if (!response.ok) {
    throw new Error(`Failed to get race applications: ${response.status}`);
  }

  return response.json();
}

export async function getUserApplications(runnerId: string): Promise<Application[]> {
  const response = await fetch(`${APPLICATION_API_URL}?runnerId=${runnerId}`);

  if (!response.ok) {
    throw new Error(`Failed to get user applications: ${response.status}`);
  }

  return response.json();
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'on-going' | 'cancelled'
): Promise<Application> {
  const response = await fetch(`${APPLICATION_API_URL}/${applicationId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update application status: ${response.status}`);
  }

  return response.json();
}

export async function deleteApplication(raceId: string, runnerId: string): Promise<void> {
  const response = await fetch(`${APPLICATION_API_URL}?raceId=${raceId}&runnerId=${runnerId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete application: ${response.status}`);
  }
}

// Rating functions
export async function addOrUpdateRating(
  raceId: string,
  data: RatingInput
): Promise<Rating> {
  const response = await fetch(`${RATING_API_URL}/${raceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to add rating: ${response.status}`);
  }

  return response.json();
}

export async function getUserRating(
  raceId: string,
  userId: string
): Promise<Rating | null> {
  const response = await fetch(`${RATING_API_URL}/${raceId}/user/${userId}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to get user rating: ${response.status}`);
  }

  return response.json();
}

export async function getRaceRatings(raceId: string): Promise<Rating[]> {
  const response = await fetch(`${RATING_API_URL}/${raceId}`);

  if (!response.ok) {
    throw new Error(`Failed to get race ratings: ${response.status}`);
  }

  return response.json();
}

export async function deleteRating(raceId: string, userId: string): Promise<void> {
  const response = await fetch(`${RATING_API_URL}/${raceId}/user/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete rating: ${response.status}`);
  }
}

// Review functions
export async function addOrUpdateReview(
  raceId: string,
  data: ReviewInput
): Promise<Review> {
  const response = await fetch(`${REVIEW_API_URL}/${raceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to add review: ${response.status}`);
  }

  return response.json();
}

export async function getUserReview(
  raceId: string,
  userId: string
): Promise<Review | null> {
  const response = await fetch(`${REVIEW_API_URL}/${raceId}/user/${userId}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to get user review: ${response.status}`);
  }

  return response.json();
}

export async function getRaceReviews(raceId: string): Promise<ReviewResponse> {
  const response = await fetch(`${REVIEW_API_URL}/${raceId}`);

  if (!response.ok) {
    throw new Error(`Failed to get race reviews: ${response.status}`);
  }

  return response.json();
}

export async function deleteReview(raceId: string, userId: string): Promise<void> {
  const response = await fetch(`${REVIEW_API_URL}/${raceId}/user/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete review: ${response.status}`);
  }
}