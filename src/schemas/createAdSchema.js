import { object, string, number } from 'yup'

// Export a factory that accepts a translator function `t`
export function buildCreateAdSchema(t) {
  return object({
    make: string().required(t('validation.make_required')),
    model: string().required(t('validation.model_required')),
    year: number()
      .typeError(t('validation.year_required'))
      .required(t('validation.year_required'))
      .min(1990, t('validation.year_min'))
      .max(new Date().getFullYear(), t('validation.year_max')),
    price: number()
      .typeError(t('validation.price_required'))
      .required(t('validation.price_required'))
      .min(1000, t('validation.price_min')),
    transmission: string().required(t('validation.transmission_required')),
    fuel_type: string().required(t('validation.fuel_type_required')),
    drive_line: string().required(t('validation.drive_line_required')),
    cylinders: string().required(t('validation.cylinders_required')),
    exterior_color: string().required(t('validation.exterior_color_required')),
    odometer: number()
      .typeError(t('validation.odometer_required'))
      .required(t('validation.odometer_required'))
      .min(0, t('validation.odometer_min')),
    interior_color: string().required(t('validation.interior_color_required')),
    option: string().required(t('validation.option_required')),
    keys: number()
      .typeError(t('validation.keys_required'))
      .required(t('validation.keys_required'))
      .min(1, t('validation.keys_min')),
    state: string().required(t('validation.state_required')),
    city: string().required(t('validation.city_required')),
    phone: string()
      .required(t('validation.phone_required'))
      .matches(/^[0-9]{10,15}$/, t('validation.phone_invalid')),
    whatsapp: string()
      .required(t('validation.whatsapp_required'))
      .matches(/^[1-9]{10,15}$/, t('validation.whatsapp_invalid')),
    description: string()
      .required(t('validation.description_required'))
      .min(2, t('validation.description_min')),
  })
}