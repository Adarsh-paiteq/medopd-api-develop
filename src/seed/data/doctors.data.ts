import {
  GENDER,
  Gender,
} from '@doctors/dto/send-otp-login-register-doctor.dto';

export interface DoctorSeedData {
  full_name: string;
  gender: Gender;
  image_file_path: string;
  image_id: string;
  image_url: string;
  mobile_number: string;
  country_code: string;
  city: string;
  earning_balance: number;
  otp_secret: string;
  registration_number: string;
  state: string;
  registration_year: string;
}

export const doctorsSeedData: DoctorSeedData[] = [
  {
    full_name: 'Aayush',
    gender: GENDER.male,
    image_file_path: '/path/to/image',
    image_id: '123',
    image_url:
      'https://i.pinimg.com/originals/b9/27/1b/b9271b8356c0e07fac2126e25dfe4343.jpg',
    mobile_number: '9999999999',
    country_code: '+91',
    city: 'Patna',
    earning_balance: 0,
    otp_secret: 'secret',
    registration_number: 'RN123',
    state: 'Bihar',
    registration_year: '2022',
  },
];
