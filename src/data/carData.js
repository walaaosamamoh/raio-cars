export const carData = {
  fuelTypes: [
    { id: 1, name_en: 'Petrol', name_ar: 'بنزين' },
    { id: 2, name_en: 'Diesel', name_ar: 'ديزل' },
    { id: 3, name_en: 'Electric', name_ar: 'كهرباء' },
    { id: 4, name_en: 'Hybrid', name_ar: 'هجين' },
  ],

  transmissions: [
    { id: 1, name_en: 'Automatic', name_ar: 'أوتوماتيك' },
    { id: 2, name_en: 'Manual', name_ar: 'عادي' },
  ],

  drivetrains: [
    { id: 1, name_en: 'FWD', name_ar: 'دفع أمامي' },
    { id: 2, name_en: 'RWD', name_ar: 'دفع خلفي' },
    { id: 3, name_en: 'AWD', name_ar: 'دفع رباعي' },
  ],

  cylinders: [
    { id: 1, count: 4 },
    { id: 2, count: 6 },
    { id: 3, count: 8 },
  ],

  colors: [
    { id: 1, name_en: 'Black', name_ar: 'أسود' },
    { id: 2, name_en: 'White', name_ar: 'أبيض' },
    { id: 3, name_en: 'Silver', name_ar: 'فضي' },
    { id: 4, name_en: 'Red', name_ar: 'أحمر' },
    { id: 5, name_en: 'Blue', name_ar: 'أزرق' },
    { id: 6, name_en: 'Gray', name_ar: 'رمادي' },
  ],

  odometers: [
    { id: 1, kilometers: '0 - 50,000 km' },
    { id: 2, kilometers: '50,000 - 100,000 km' },
    { id: 3, kilometers: '100,000 - 150,000 km' },
    { id: 4, kilometers: '150,000+ km' },
  ],

  options: [
    { id: 1, name_en: 'Full Option', name_ar: 'فل أوبشن' },
    { id: 2, name_en: 'Standard', name_ar: 'عادي' },
  ],

  models: [
    { id: 1, make_id: 2, name_en: 'Series 3', name_ar: 'الفئة الثالثة' },
    { id: 2, make_id: 9, name_en: 'Tahoe', name_ar: 'تاهو' },
    { id: 3, make_id: 7, name_en: 'EcoSport', name_ar: 'إيكوسبورت' },
    { id: 4, make_id: 8, name_en: 'Accord Sport', name_ar: 'أكورد سبورت' },
    { id: 5, make_id: 4, name_en: 'Elantra', name_ar: 'إلنترا' },
    { id: 6, make_id: 10, name_en: 'IS 200', name_ar: 'IS 200' },
    { id: 7, make_id: 6, name_en: 'Sentra', name_ar: 'سنترا' },
    { id: 8, make_id: 1, name_en: 'Camry', name_ar: 'كامري' },
  ],
}
