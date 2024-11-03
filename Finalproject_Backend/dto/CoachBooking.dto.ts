export interface CreateCoachBookingInput {
  bookingId: string;
  coachId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalCost: number;
}
