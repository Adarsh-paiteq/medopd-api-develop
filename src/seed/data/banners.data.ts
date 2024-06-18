interface BannerSeedData {
  title: string;
  description: string;
  image_file_path: string;
  image_id: string;
  image_url: string;
}

export const bannersSeedData: BannerSeedData[] = [
  {
    title: 'Comprehensive Health Checkup',
    description:
      'Get a full assessment of your health with our comprehensive checkup package.',
    image_file_path: '/images/health-checkup.jpg',
    image_id: 'health001',
    image_url: 'https://example.com/images/health-checkup.jpg',
  },
  {
    title: 'Pediatric Care',
    description:
      'Expert healthcare for children with our specialized pediatric services.',
    image_file_path: '/images/pediatric-care.jpg',
    image_id: 'pediatric002',
    image_url: 'https://example.com/images/pediatric-care.jpg',
  },
  {
    title: 'Dental Services',
    description:
      'Keep your smile bright with our professional dental care services.',
    image_file_path: '/images/dental-services.jpg',
    image_id: 'dental003',
    image_url: 'https://example.com/images/dental-services.jpg',
  },
  {
    title: 'Emergency Response',
    description:
      'Rapid and efficient emergency response when you need it the most.',
    image_file_path: '/images/emergency-response.jpg',
    image_id: 'emergency004',
    image_url: 'https://example.com/images/emergency-response.jpg',
  },
];
