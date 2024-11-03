export interface CreateCoachInput {
  userId: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  availability: boolean;
  certification: string[];
}
