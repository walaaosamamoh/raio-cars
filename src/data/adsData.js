import bmw from '@/assets/cars/bmw-series-2016.jpg'
import bmw2 from '@/assets/cars/bmw-series-2-2016.jpg'

import chevrolet from '@/assets/cars/chevrolet-tahoe-2009.jpg'

import ford from '@/assets/cars/ford-ecosport-2019.jpg'
import ford2 from '@/assets/cars/ford-ecosport-2-2019.jpg'
import ford3 from '@/assets/cars/ford-ecosport-3-2019.jpg'

import honda from '@/assets/cars/honda-accord-sport-2022.jpg'
import honda2 from '@/assets/cars/honda-accord-sport-2-2022.jpg'

import hyundai from '@/assets/cars/hyundai-elantra-2018.jpg'
import hyundai2 from '@/assets/cars/hyundai-elantra-2-2018.jpg'

import lexus from '@/assets/cars/lexus-is-200.jpg'

import nissan from '@/assets/cars/nissan-sentra2013.jpg'
import nissan2 from '@/assets/cars/nissan-sentra-2-2013.jpg'
import nissan3 from '@/assets/cars/nissan-sentra-3-2013.jpg'

import toyota from '@/assets/cars/toyota-camry-2019.jpg'

import landCruiser from '@/assets/cars/toyota-land-cruiser-gxr2016.jpg'
import landCruiser2 from '@/assets/cars/landcruiser.jpg'

import toyotacamry from '@/assets/cars/toyota-camry-se-2017.jpg'
import toyotacamry2 from '@/assets/cars/toyota-camry.jpg'

import nissanSentra from '@/assets/cars/nissan-sentra-sl.jpg'

export const adsData = [
  {
    id: 1,
    name: 'BMW Series 3 2016',
    make: 'BMW',
    make_id: 2,
    model: 'Series 3',
    model_id: 1,
    price: 18500000,
    year: 2016,
    created_at: '2026-09-10T10:30:00',
    status: 'active',
    photos: [bmw, bmw2],
    description:
      'Well maintained BMW with a clean interior and comfortable driving experience.',

    odometer: 3,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 2,
    exterior_color: 1,
    interior_color: 1,

    city: 1,
    state: 1,
    advertiser_id: 1,
    advertiser: 'Ahmed Cars',
    ads_count: 5,
    followers: 120,
    views: 1240,
    shares: 86,

    viewsHistory: [
      { date: '2026-09-07', views: 18 },
      { date: '2026-09-08', views: 25 },
      { date: '2026-09-09', views: 31 },
      { date: '2026-09-10', views: 42 },
      { date: '2026-09-11', views: 36 },
      { date: '2026-09-12', views: 48 },
      { date: '2026-09-13', views: 55 },
    ],

    whatsapp: '249912345678',
    phone: '+249912345678',
    advertiser_photo: null,
  },

  {
    id: 2,
    name: 'Chevrolet Tahoe 2009',
    make: 'Chevrolet',
    make_id: 9,
    model: 'Tahoe',
    model_id: 2,
    price: 22000000,
    year: 2009,
    created_at: '2026-09-09T14:00:00',
    status: 'pending',
    photos: [chevrolet],
    description:
      'Spacious SUV suitable for family and long-distance driving.',

    odometer: 4,
    cylinders: 3,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 3,
    exterior_color: 2,
    interior_color: 7,

    city: 1,
    state: 1,
    advertiser_id: 2,
    advertiser: 'Sudan Auto',
    ads_count: 8,
    followers: 95,
    views: 980,
    shares: 54,

    viewsHistory: [
      { date: '2026-09-07', views: 12 },
      { date: '2026-09-08', views: 18 },
      { date: '2026-09-09', views: 24 },
      { date: '2026-09-10', views: 20 },
      { date: '2026-09-11', views: 29 },
      { date: '2026-09-12', views: 35 },
      { date: '2026-09-13', views: 31 },
    ],

    whatsapp: '249911111111',
    phone: '+249911111111',
    advertiser_photo: null,
  },

  {
    id: 3,
    name: 'Ford EcoSport 2019',
    make: 'Ford',
    make_id: 7,
    model: 'EcoSport',
    model_id: 3,
    price: 15000000,
    year: 2019,
    created_at: '2026-09-08T09:15:00',
    status: 'active',
    photos: [ford, ford2, ford3],
    description:
      'Compact SUV with practical interior and smooth performance.',

    odometer: 2,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 2,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 5,
    interior_color: 1,

    city: 2,
    state: 1,
    advertiser_id: 3,
    advertiser: 'Al Nile Motors',
    ads_count: 4,
    followers: 70,
    views: 760,
    shares: 42,

    viewsHistory: [
      { date: '2026-09-07', views: 10 },
      { date: '2026-09-08', views: 15 },
      { date: '2026-09-09', views: 19 },
      { date: '2026-09-10', views: 23 },
      { date: '2026-09-11', views: 21 },
      { date: '2026-09-12', views: 28 },
      { date: '2026-09-13', views: 26 },
    ],

    whatsapp: '249922222222',
    phone: '+249922222222',
    advertiser_photo: null,
  },

  {
    id: 4,
    name: 'Honda Accord Sport 2022',
    make: 'Honda',
    make_id: 8,
    model: 'Accord Sport',
    model_id: 4,
    price: 28000000,
    year: 2022,
    created_at: '2026-09-07T16:20:00',
    status: 'rejected',
    photos: [honda, honda2],
    description:
      'Modern sedan with sporty design and comfortable interior.',

    odometer: 1,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 6,
    interior_color: 1,

    city: 1,
    state: 1,
    advertiser_id: 4,
    advertiser: 'Modern Cars',
    ads_count: 6,
    followers: 150,
    views: 1580,
    shares: 112,

    viewsHistory: [
      { date: '2026-09-07', views: 22 },
      { date: '2026-09-08', views: 30 },
      { date: '2026-09-09', views: 35 },
      { date: '2026-09-10', views: 41 },
      { date: '2026-09-11', views: 48 },
      { date: '2026-09-12', views: 52 },
      { date: '2026-09-13', views: 60 },
    ],

    whatsapp: '249933333333',
    phone: '+249933333333',
    advertiser_photo: null,
  },

  {
    id: 5,
    name: 'Hyundai Elantra 2018',
    make: 'Hyundai',
    make_id: 4,
    model: 'Elantra',
    model_id: 5,
    price: 12500000,
    year: 2018,
    created_at: '2026-09-06T11:00:00',
    status: 'draft',
    photos: [hyundai, hyundai2],
    description:
      'Reliable and economical sedan in good condition.',

    odometer: 2,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 2,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 3,
    interior_color: 1,

    city: 3,
    state: 1,
    advertiser_id: 5,
    advertiser: 'Khartoum Motors',
    ads_count: 3,
    followers: 60,
    views: 640,
    shares: 31,

    viewsHistory: [
      { date: '2026-09-07', views: 8 },
      { date: '2026-09-08', views: 12 },
      { date: '2026-09-09', views: 16 },
      { date: '2026-09-10', views: 14 },
      { date: '2026-09-11', views: 20 },
      { date: '2026-09-12', views: 24 },
      { date: '2026-09-13', views: 22 },
    ],

    whatsapp: '249944444444',
    phone: '+249944444444',
    advertiser_photo: null,
  },

  {
    id: 6,
    name: 'Lexus IS 200',
    make: 'Lexus',
    make_id: 10,
    model: 'IS 200',
    model_id: 6,
    price: 17500000,
    year: 2015,
    created_at: '2026-09-05T13:45:00',
    status: 'active',
    photos: [lexus],
    description:
      'Comfortable luxury sedan with excellent road performance.',

    odometer: 3,
    cylinders: 2,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 2,
    exterior_color: 1,
    interior_color: 8,

    city: 1,
    state: 1,
    advertiser_id: 6,
    advertiser: 'Luxury Auto',
    ads_count: 7,
    followers: 110,
    views: 1120,
    shares: 67,

    viewsHistory: [
      { date: '2026-09-07', views: 16 },
      { date: '2026-09-08', views: 21 },
      { date: '2026-09-09', views: 27 },
      { date: '2026-09-10', views: 25 },
      { date: '2026-09-11', views: 32 },
      { date: '2026-09-12', views: 38 },
      { date: '2026-09-13', views: 35 },
    ],

    whatsapp: '249955555555',
    phone: '+249955555555',
    advertiser_photo: null,
  },

  {
    id: 7,
    name: 'Nissan Sentra 2013',
    make: 'Nissan',
    make_id: 6,
    model: 'Sentra',
    model_id: 7,
    price: 9000000,
    year: 2013,
    created_at: '2026-09-04T10:10:00',
    status: 'pending',
    photos: [nissan, nissan2, nissan3],
    description:
      'Affordable and practical sedan for everyday use.',

    odometer: 3,
    cylinders: 1,
    transmission: 2,
    keys: 1,
    option: 2,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 2,
    interior_color: 6,

    city: 2,
    state: 1,
    advertiser_id: 7,
    advertiser: 'Auto Market',
    ads_count: 2,
    followers: 45,
    views: 420,
    shares: 18,

    viewsHistory: [
      { date: '2026-09-07', views: 6 },
      { date: '2026-09-08', views: 9 },
      { date: '2026-09-09', views: 11 },
      { date: '2026-09-10', views: 13 },
      { date: '2026-09-11', views: 10 },
      { date: '2026-09-12', views: 15 },
      { date: '2026-09-13', views: 17 },
    ],

    whatsapp: '249966666666',
    phone: '+249966666666',
    advertiser_photo: null,
  },

  {
    id: 8,
    name: 'Toyota Camry 2019',
    make: 'Toyota',
    make_id: 1,
    model: 'Camry',
    model_id: 8,
    price: 21000000,
    year: 2019,
    created_at: '2026-09-03T08:30:00',
    status: 'active',
    photos: [toyota],
    description:
      'Reliable sedan with a comfortable interior and smooth ride.',

    odometer: 2,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 2,
    interior_color: 7,

    city: 1,
    state: 1,
    advertiser_id: 8,
    advertiser: 'Toyota Sudan',
    ads_count: 10,
    followers: 200,
    views: 1890,
    shares: 135,

    viewsHistory: [
      { date: '2026-09-07', views: 28 },
      { date: '2026-09-08', views: 35 },
      { date: '2026-09-09', views: 42 },
      { date: '2026-09-10', views: 50 },
      { date: '2026-09-11', views: 58 },
      { date: '2026-09-12', views: 65 },
      { date: '2026-09-13', views: 72 },
    ],

    whatsapp: '249977777777',
    phone: '+249977777777',
    advertiser_photo: null,
  },

  {
    id: 9,
    name: 'Toyota Land Cruiser 2016',
    make: 'Toyota',
    make_id: 1,
    model: 'Land Cruiser',
    model_id: 9,
    price: 25000000,
    year: 2016,
    created_at: '2026-09-03T08:30:00',
    status: 'active',
    photos: [landCruiser, landCruiser2],
    description:
      'Reliable SUV with a comfortable interior and smooth ride.',

    odometer: 2,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 2,
    interior_color: 7,

    city: 1,
    state: 1,
    advertiser_id: 8,
    advertiser: 'Toyota Sudan',
    ads_count: 10,
    followers: 200,
    views: 1890,
    shares: 135,

    viewsHistory: [
      { date: '2026-09-07', views: 28 },
      { date: '2026-09-08', views: 35 },
      { date: '2026-09-09', views: 42 },
      { date: '2026-09-10', views: 50 },
      { date: '2026-09-11', views: 58 },
      { date: '2026-09-12', views: 65 },
      { date: '2026-09-13', views: 72 },
    ],

    whatsapp: '249977777777',
    phone: '+249977777777',
    advertiser_photo: null,
  },

  {
    id: 10,
    name: 'Toyota Camry 2017',
    make: 'Toyota',
    make_id: 1,
    model: 'Camry',
    model_id: 8,
    price: 18000000,
    year: 2017,
    created_at: '2026-09-03T08:30:00',
    status: 'active',
    photos: [toyotacamry, toyotacamry2],
    description:
      'Reliable sedan with a comfortable interior and smooth ride.',

    odometer: 2,
    cylinders: 1,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 1,
    exterior_color: 2,
    interior_color: 7,

    city: 1,
    state: 1,
    advertiser_id: 8,
    advertiser: 'Toyota Sudan',
    ads_count: 10,
    followers: 200,
    views: 1890,
    shares: 135,

    viewsHistory: [
      { date: '2026-09-07', views: 28 },
      { date: '2026-09-08', views: 35 },
      { date: '2026-09-09', views: 42 },
      { date: '2026-09-10', views: 50 },
      { date: '2026-09-11', views: 58 },
      { date: '2026-09-12', views: 65 },
      { date: '2026-09-13', views: 72 },
    ],

    whatsapp: '249977777777',
    phone: '+249977777777',
    advertiser_photo: null,
  },

  {
    id: 11,
    name: 'Nissan Sentra 2015',
    make: 'Nissan',
    make_id: 6,
    model: 'Sentra',
    model_id: 6,
    price: 22000000,
    year: 2009,
    created_at: '2026-09-09T14:00:00',
    status: 'pending',
    photos: [nissanSentra],
    description:
      'Spacious SUV suitable for family and long-distance driving.',

    odometer: 4,
    cylinders: 3,
    transmission: 1,
    keys: 2,
    option: 1,
    fuel_type: 1,
    drive_line: 3,
    exterior_color: 2,
    interior_color: 7,

    city: 1,
    state: 1,
    advertiser_id: 2,
    advertiser: 'Sudan Auto',
    ads_count: 8,
    followers: 95,
    views: 980,
    shares: 54,

    viewsHistory: [
      { date: '2026-09-07', views: 12 },
      { date: '2026-09-08', views: 18 },
      { date: '2026-09-09', views: 24 },
      { date: '2026-09-10', views: 20 },
      { date: '2026-09-11', views: 29 },
      { date: '2026-09-12', views: 35 },
      { date: '2026-09-13', views: 31 },
    ],

    whatsapp: '249911111111',
    phone: '+249911111111',
    advertiser_photo: null,
  },

]

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

adsData.forEach((ad) => {
  const today = new Date()

  ad.viewsHistory = ad.viewsHistory.map((entry, index, history) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (history.length - 1 - index))

    return {
      ...entry,
      date: formatDate(date),
    }
  })
})
