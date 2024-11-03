export interface CreateUserInput {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  userRole: string;
  profilePictureUrl: string;
  preferredSports: string[];
}

export interface UserLoginInputs {
  email: string;
  password: string;
}

export interface UserPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
}

export interface EditUserInput {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  profilePictureUrl: string;
  preferredSports: string[];
}
