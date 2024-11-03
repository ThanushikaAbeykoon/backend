export interface CreateArenaBookingInput {
  bookingId: string;
  coachId: string;
  arenaId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  totalCost: number;
}
