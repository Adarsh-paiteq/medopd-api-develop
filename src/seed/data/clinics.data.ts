export interface ClinicSeedData {
  email: string;
  full_name: string;
  clinic_name: string;
  image_file_path: string;
  image_id: string;
  image_url: string;
  mobile_number: string;
  country_code: string;
  cityId: string;
  otp_secret: string;
  address: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  landmark: string;
}
export const clinicSeedData: ClinicSeedData[] = [
  {
    email: 'www.ravishkumar.jio@gmail.com',
    full_name: 'John Doe',
    clinic_name: 'Ravish dental Clinic',
    image_file_path: '/images/pediatric-care.jpg',
    image_id: 'pediatric002',
    image_url: 'https://example.com/images/pediatric-care.jpg',
    mobile_number: '7717747250',
    country_code: '91',
    cityId: '01HTJ1EKKE0X33YWWY3558FFTY',
    otp_secret: '0795',
    address: 'Balughat',
    postal_code: '842001',
    latitude: 37.7749,
    longitude: -122.419411,
    landmark: 'Near Chocolate factory',
  },

  {
    email: 'www.test.jio@gmail.com',
    full_name: 'Mohan gee',
    clinic_name: 'Mohan Clinic',
    image_file_path: '/images/pediatric-care.jpg',
    image_id: 'pediatric002',
    image_url: 'https://example.com/images/pediatric-care.jpg',
    mobile_number: '7777747348',
    country_code: '91',
    cityId: '01HTJ1EKKE0X33YWWY3558FFTY',
    otp_secret: '0796',
    address: 'tower chowk',
    postal_code: '842001',
    latitude: 38.7749,
    longitude: -121.419411,
    landmark: 'Near hanuman mandir',
  },
];
