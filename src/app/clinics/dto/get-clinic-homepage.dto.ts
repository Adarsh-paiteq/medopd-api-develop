import { BannerOutput } from '@banners/dto/get-banners.dto';
import { DoctorWithDetailsOutput } from '@doctors/dto/get-doctorsWithDetails.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetClinicHomepageOutput {
  clinicId: string | null;
  clinicName: string | null;
  clinicOwnerName: string | null;
  clinicImageFilePath: string | null;
  clinicImageId: string | null;
  clinicImageUrl: string | null;
  @Field(() => [BannerOutput], { nullable: 'items' })
  banners: BannerOutput[];
  @Field(() => [DoctorWithDetailsOutput], { nullable: 'items' })
  doctors: DoctorWithDetailsOutput[];
}
