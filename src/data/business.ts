export const business = {
  name: 'Lakshmi Catering Services',
  phone: '8904693562',
  whatsapp: '918904693562',
  whatsappGroupInvite: 'https://chat.whatsapp.com/KL6sCFdoAKNK8SlRJMZFjk',
  address: {
    line1: 'No. 21, "Poornashri"',
    line2: '9th Cross, Chunchghatta Main Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560062',
  },
  serviceRadius: 'Approximately 5 km',
  vegetarian: true,
  cuisines: ['South Indian', 'North Indian', 'Chinese'],
} as const

export const fullAddress = [
  business.address.line1,
  business.address.line2,
  business.address.city,
  business.address.state,
  business.address.pincode,
].join(', ')
