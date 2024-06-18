import { BookingDoctorHomepageOutput } from '@bookings/dto/get-booking-doctor-homepage.dto';
import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetDoctorHomepageOutput {
  id: string;
  name: string | null;
  imageFilePath: string | null;
  imageId: string | null;
  imageUrl: string | null;
  mobileNumber: string | null;
  @Field(() => Float)
  todayEarning: number;
  isActive: boolean;
  @Field(() => [BookingDoctorHomepageOutput], { nullable: 'items' })
  newCases: BookingDoctorHomepageOutput[];
  hasMore: boolean;
}
