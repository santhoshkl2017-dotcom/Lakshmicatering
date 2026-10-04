import { useEffect, useRef, useState } from 'react'
import { business, fullAddress } from './data/business'
import { initializeAnalytics, trackEvent, type AnalyticsEvent } from './utils/analytics'
import './App.css'

type Language = 'en' | 'kn'

const currentYear = new Date().getFullYear()
const publicImage = (fileName: string) =>
  `${import.meta.env.BASE_URL}images/${fileName}`

const copy = {
  en: {
    home: 'Home',
    about: 'About',
    dailyCatering: 'Daily catering',
    eventCatering: 'Event catering',
    menu: 'Menu',
    products: 'Products',
    gallery: 'Gallery',
    vision: 'Our vision',
    contact: 'Contact',
    language: 'ಕನ್ನಡ',
    eyebrow: 'HOME MADE · 100% PURE VEG',
    heroTitle: 'Homemade Pure Vegetarian Food, Made With Love.',
    heroText:
      'Fresh and hygienic South Indian, North Indian and Chinese food for daily meals, family gatherings and special occasions.',
    orderDaily: 'Order daily meals',
    getQuote: 'Get catering quote',
    viewMenu: 'View menu',
    whatsapp: 'Join WhatsApp group',
    peopleRange: 'Catering for 2 to 100 people',
    trustItems: [
      '100% Vegetarian',
      'Homemade taste',
      'Fresh & hygienic',
      '2–100 people',
      'Around 5 km',
      'Made with care',
    ],
    heroImageAlt: 'A family sharing a home-style vegetarian meal',
    aboutEyebrow: 'A LITTLE ABOUT US',
    aboutTitle: 'Traditional flavours, made at home.',
    aboutText:
      'Lakshmi Catering Services brings home-made, pure vegetarian food to your everyday table and your most meaningful celebrations. From familiar South Indian favourites to North Indian and Chinese dishes, each order is prepared with care.',
    cuisine: ['South Indian', 'North Indian', 'Chinese'],
    cuisineTitle: 'Three cuisines, made vegetarian.',
    cuisineDescriptions: [
      'Comforting South Indian flavours for everyday meals and special gatherings.',
      'North Indian favourites, freshly prepared for sharing around the table.',
      'Vegetarian Chinese choices made fresh for your meal or occasion.',
    ],
    servicesEyebrow: 'WHAT WE DO',
    servicesTitle: 'Good food for every kind of day.',
    dailyCateringTitle: 'Fresh homely food, every day.',
    dailyCateringText:
      'Freshly prepared vegetarian meals with the comfort of homemade taste. For two people, your family, an office team or a regular group.',
    dailyCategories: [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Family meals',
      'Small groups',
      'Office & team meals',
      'Regular daily orders',
    ],
    eventCateringTitle: 'Make every occasion delicious.',
    eventCateringText:
      'Thoughtful vegetarian catering for celebrations, religious functions, work events and small gatherings.',
    eventCategories: [
      'Weddings & receptions',
      'Birthdays',
      'Housewarmings',
      'Pooja & religious functions',
      'Corporate events',
      'Kitty parties',
      'Family functions & small gatherings',
      'Special occasions',
    ],
    dailyButton: 'Enquire for daily meals',
    eventButton: 'Get event catering quote',
    cuisinesEyebrow: 'OUR CUISINES',
    servingEyebrow: 'SMALL OR BIG, YOU’RE WELCOME',
    servingTitle: 'From 2 to 100 people.',
    servingText:
      'Whether it is a meal for your family or catering for a special occasion, we serve fresh, hygienic and homely vegetarian food. Serving Chunchghatta and surrounding areas; contact us to check availability for your location.',
    servingButton: 'Plan your order',
    menuEyebrow: 'A MENU FOR YOUR TABLE',
    menuTitle: 'Meals planned around your day.',
    menuText:
      'Explore breakfast, lunch, dinner, regional cuisines, snacks, sweets, special meals and party menus. Ask us what can be prepared for your date and group.',
    menuCategories: [
      'Breakfast',
      'Lunch',
      'Dinner',
      'South Indian',
      'North Indian',
      'Chinese',
      'Sweets',
      'Snacks',
      'Special meals',
      'Party menu',
    ],
    productsEyebrow: 'FROM OUR KITCHEN',
    productsTitle: 'Homemade favourites to take home.',
    productsText:
      'A selection of the premixes, spice blends and sweets featured in our product range. Ask us about availability, pack sizes and fresh catering menus.',
    premixTitle: 'Breakfast & meal premixes',
    premixAlt: 'Lakshmi homemade premix powders and prices',
    spiceTitle: 'Traditional spice mixes',
    spiceAlt: 'Lakshmi homemade South Indian spice blends',
    sweetsTitle: 'Homemade sweets',
    premixes: [
      ['Rava Idli Premix', '₹220 / 1 kg'],
      ['Uppit Premix', '₹200 / 1 kg'],
      ['Gojjavalakki Premix', '₹240 / 1 kg'],
      ['Pongal Premix', '₹260 / 1 kg'],
      ['Kesari Bath Premix', '₹480 / 1 kg'],
    ],
    spiceText:
      'Sambar powder · Rasam powder · Menthe Hittu · Vangi Bath and Bisibele Bath mixes · Puliyogare powder and gojju · Chutney powder',
    sweetsText:
      'Millet malt powder and homemade laddus. Dry fruit laddoos are made with pure ghee, no added sugar and no preservatives. Besan laddoos are made with Nandini ghee, cashews and raisins, and 100% gram flour with no maida.',
    traditionalPacks: 'Available packs: 250 g / 500 g / 1 kg',
    productOrder: 'Ask in WhatsApp group',
    galleryEyebrow: 'A TASTE OF WHAT WE MAKE',
    galleryTitle: 'From our kitchen to your table.',
    viewImage: 'View image',
    closeImage: 'Close image',
    familyAlt: 'Family sharing a homemade vegetarian meal together',
    premixGalleryAlt: 'Homemade rava idli, uppit, gojjavalakki, pongal and kesari bath premixes',
    sweetsAlt: 'Millet malt powder, dry fruit laddus and besan laddus',
    spicesAlt: 'Traditional homemade South Indian spice powders and mixes',
    visionEyebrow: 'OUR VISION',
    visionTitle: 'Homely Taste. Happy Families. Memorable Occasions.',
    visionText:
      'To become a trusted and preferred catering service known for hygienic, delicious and homely vegetarian food, bringing traditional South Indian and North Indian flavours to every occasion with love, quality and affordability.',
    visionPoints: [
      ['Pure & hygienic food', 'Fresh ingredients and clean preparation.'],
      ['Homely taste', 'Traditional flavours made with care and love.'],
      ['Quality first', 'Consistent taste and high-quality ingredients.'],
      ['Customer happiness', 'Every meal served with warmth and respect.'],
      ['Affordable & reliable', 'Delicious food at reasonable prices.'],
      ['Grow with trust', 'Building long-lasting relationships with every customer.'],
    ],
    contactEyebrow: 'LET’S TALK FOOD',
    contactTitle: 'Tell us what you’re celebrating.',
    contactText:
      'Share your date, guest count, food preferences and location. We’ll help you plan a menu for 2 to 100 people.',
    callNow: 'Call now',
    directions: 'Get directions',
    mapLabel: 'Find us on Google Maps',
    serviceArea: 'Serving Chunchghatta and surrounding areas. Contact us to check availability for your location.',
    addressLabel: 'Visit or get directions',
    phoneLabel: 'Call or WhatsApp group',
    footer: 'Home Made · 100% Pure Veg · Made with care',
    backToTop: 'BACK TO TOP ↑',
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    dailyCatering: 'ದಿನನಿತ್ಯದ ಊಟ',
    eventCatering: 'ಸಮಾರಂಭದ ಕ್ಯಾಟರಿಂಗ್',
    menu: 'ಮೆನು',
    products: 'ಉತ್ಪನ್ನಗಳು',
    gallery: 'ಚಿತ್ರಗಳು',
    vision: 'ನಮ್ಮ ದೃಷ್ಟಿ',
    contact: 'ಸಂಪರ್ಕ',
    language: 'English',
    eyebrow: 'ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ್ದು · 100% ಶುದ್ಧ ಸಸ್ಯಾಹಾರ',
    heroTitle: 'ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಿದ ಮನೆಯ ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ ಊಟ.',
    heroText:
      'ದಿನನಿತ್ಯದ ಊಟ, ಕುಟುಂಬದ ಕೂಟ ಮತ್ತು ವಿಶೇಷ ಸಮಾರಂಭಗಳಿಗಾಗಿ ತಾಜಾ, ಶುಚಿಯಾದ ದಕ್ಷಿಣ, ಉತ್ತರ ಭಾರತೀಯ ಹಾಗೂ ಚೈನೀಸ್ ಸಸ್ಯಾಹಾರಿ ಅಡುಗೆ.',
    orderDaily: 'ದಿನನಿತ್ಯದ ಊಟ ಆರ್ಡರ್ ಮಾಡಿ',
    getQuote: 'ಕ್ಯಾಟರಿಂಗ್ ಅಂದಾಜು ಪಡೆಯಿರಿ',
    viewMenu: 'ಮೆನು ನೋಡಿ',
    whatsapp: 'ವಾಟ್ಸಾಪ್ ಗುಂಪಿಗೆ ಸೇರಿ',
    peopleRange: '2 ರಿಂದ 100 ಜನರಿಗೆ ಕ್ಯಾಟರಿಂಗ್',
    trustItems: [
      '100% ಸಸ್ಯಾಹಾರ',
      'ಮನೆಯ ರುಚಿ',
      'ತಾಜಾ ಮತ್ತು ಶುಚಿ',
      '2–100 ಜನ',
      'ಸುಮಾರು 5 ಕಿ.ಮೀ.',
      'ಪ್ರೀತಿಯ ತಯಾರಿ',
    ],
    heroImageAlt: 'ಮನೆಯ ಶೈಲಿಯ ಸಸ್ಯಾಹಾರಿ ಊಟವನ್ನು ಹಂಚಿ ಸವಿಯುತ್ತಿರುವ ಕುಟುಂಬ',
    aboutEyebrow: 'ನಮ್ಮ ಬಗ್ಗೆ ಸ್ವಲ್ಪ',
    aboutTitle: 'ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿ, ಮನೆಯ ತಯಾರಿ.',
    aboutText:
      'ಲಕ್ಷ್ಮಿ ಕ್ಯಾಟರಿಂಗ್ ಸರ್ವೀಸಸ್ ನಿಮ್ಮ ದಿನನಿತ್ಯದ ಊಟ ಮತ್ತು ವಿಶೇಷ ಸಂಭ್ರಮಗಳಿಗೆ ಮನೆಯಲ್ಲೇ ತಯಾರಿಸಿದ ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ ಅಡುಗೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ದಕ್ಷಿಣ ಭಾರತೀಯ ಮೆಚ್ಚಿನ ರುಚಿಗಳಿಂದ ಉತ್ತರ ಭಾರತೀಯ ಮತ್ತು ಚೈನೀಸ್ ಅಡುಗೆಯವರೆಗೆ, ಪ್ರತಿ ಆರ್ಡರ್ ಅನ್ನು ಕಾಳಜಿಯಿಂದ ತಯಾರಿಸುತ್ತೇವೆ.',
    cuisine: ['ದಕ್ಷಿಣ ಭಾರತೀಯ', 'ಉತ್ತರ ಭಾರತೀಯ', 'ಚೈನೀಸ್'],
    cuisineTitle: 'ಮೂರು ಬಗೆಯ ಸಸ್ಯಾಹಾರಿ ಅಡುಗೆ.',
    cuisineDescriptions: [
      'ದಿನನಿತ್ಯದ ಊಟ ಮತ್ತು ವಿಶೇಷ ಕೂಟಗಳಿಗೆ ದಕ್ಷಿಣ ಭಾರತೀಯ ಮನೆಯ ರುಚಿ.',
      'ಒಟ್ಟಾಗಿ ಸವಿಯಲು ತಾಜಾವಾಗಿ ತಯಾರಿಸಿದ ಉತ್ತರ ಭಾರತೀಯ ಮೆಚ್ಚಿನ ಅಡುಗೆ.',
      'ನಿಮ್ಮ ಊಟ ಅಥವಾ ಸಮಾರಂಭಕ್ಕಾಗಿ ತಾಜಾವಾಗಿ ತಯಾರಿಸಿದ ಸಸ್ಯಾಹಾರಿ ಚೈನೀಸ್ ಅಡುಗೆ.',
    ],
    servicesEyebrow: 'ನಮ್ಮ ಸೇವೆಗಳು',
    servicesTitle: 'ಪ್ರತಿ ದಿನಕ್ಕೂ ರುಚಿಯಾದ ಊಟ.',
    dailyCateringTitle: 'ಪ್ರತಿದಿನ ತಾಜಾ ಮನೆಯೂಟ.',
    dailyCateringText:
      'ಮನೆಯ ರುಚಿಯೊಂದಿಗೆ ತಾಜಾವಾಗಿ ತಯಾರಿಸಿದ ಸಸ್ಯಾಹಾರಿ ಊಟ. ಇಬ್ಬರಿಗೆ, ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ, ಕಚೇರಿ ತಂಡಕ್ಕೆ ಅಥವಾ ನಿಯಮಿತ ಕೂಟಕ್ಕೆ.',
    dailyCategories: [
      'ಉಪಾಹಾರ',
      'ಮಧ್ಯಾಹ್ನದ ಊಟ',
      'ರಾತ್ರಿ ಊಟ',
      'ಕುಟುಂಬದ ಊಟ',
      'ಸಣ್ಣ ಗುಂಪುಗಳು',
      'ಕಚೇರಿ ಮತ್ತು ತಂಡದ ಊಟ',
      'ನಿಯಮಿತ ದಿನನಿತ್ಯದ ಆರ್ಡರ್',
    ],
    eventCateringTitle: 'ಪ್ರತಿ ಸಂಭ್ರಮಕ್ಕೂ ರುಚಿಯ ಮೆರುಗು.',
    eventCateringText:
      'ಸಂಭ್ರಮ, ಧಾರ್ಮಿಕ ಕಾರ್ಯಕ್ರಮ, ಕೆಲಸದ ಕೂಟ ಮತ್ತು ಸಣ್ಣ ಸಮಾರಂಭಗಳಿಗಾಗಿ ವಿಶೇಷ ಸಸ್ಯಾಹಾರಿ ಕ್ಯಾಟರಿಂಗ್.',
    eventCategories: [
      'ಮದುವೆ ಮತ್ತು ಆರತಕ್ಷತೆ',
      'ಹುಟ್ಟುಹಬ್ಬ',
      'ಗೃಹಪ್ರವೇಶ',
      'ಪೂಜೆ ಮತ್ತು ಧಾರ್ಮಿಕ ಕಾರ್ಯಕ್ರಮ',
      'ಕಾರ್ಪೊರೇಟ್ ಕಾರ್ಯಕ್ರಮ',
      'ಕಿಟ್ಟಿ ಪಾರ್ಟಿ',
      'ಕುಟುಂಬ ಸಮಾರಂಭ ಮತ್ತು ಸಣ್ಣ ಕೂಟ',
      'ವಿಶೇಷ ಸಂದರ್ಭಗಳು',
    ],
    dailyButton: 'ದಿನನಿತ್ಯದ ಊಟಕ್ಕಾಗಿ ವಿಚಾರಿಸಿ',
    eventButton: 'ಸಮಾರಂಭದ ಕ್ಯಾಟರಿಂಗ್ ವಿಚಾರಿಸಿ',
    cuisinesEyebrow: 'ನಮ್ಮ ಅಡುಗೆಗಳು',
    servingEyebrow: 'ಸಣ್ಣದಾಗಲಿ ದೊಡ್ಡದಾಗಲಿ, ಸ್ವಾಗತ',
    servingTitle: '2 ರಿಂದ 100 ಜನರಿಗೆ.',
    servingText:
      'ನಿಮ್ಮ ಕುಟುಂಬದ ಊಟವಾಗಲಿ ಅಥವಾ ವಿಶೇಷ ಸಮಾರಂಭದ ಕ್ಯಾಟರಿಂಗ್ ಆಗಲಿ, ತಾಜಾ, ಶುಚಿಯಾದ ಮತ್ತು ಮನೆಯ ರುಚಿಯ ಸಸ್ಯಾಹಾರಿ ಅಡುಗೆ ನೀಡುತ್ತೇವೆ. ಚುಂಚಘಟ್ಟ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸೇವೆ; ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ಲಭ್ಯತೆ ವಿಚಾರಿಸಿ.',
    servingButton: 'ನಿಮ್ಮ ಆರ್ಡರ್ ಯೋಜಿಸಿ',
    menuEyebrow: 'ನಿಮ್ಮ ಊಟದ ಮೆನು',
    menuTitle: 'ನಿಮ್ಮ ದಿನಕ್ಕೆ ತಕ್ಕ ಊಟದ ಯೋಜನೆ.',
    menuText:
      'ಉಪಾಹಾರ, ಮಧ್ಯಾಹ್ನದ ಊಟ, ರಾತ್ರಿ ಊಟ, ಪ್ರಾದೇಶಿಕ ಅಡುಗೆಗಳು, ತಿಂಡಿ, ಸಿಹಿತಿಂಡಿ, ವಿಶೇಷ ಊಟ ಮತ್ತು ಸಮಾರಂಭದ ಮೆನು ಆಯ್ಕೆಮಾಡಿ. ನಿಮ್ಮ ದಿನ ಮತ್ತು ಗುಂಪಿಗೆ ಏನು ತಯಾರಿಸಬಹುದು ಎಂದು ವಿಚಾರಿಸಿ.',
    menuCategories: [
      'ಉಪಾಹಾರ',
      'ಮಧ್ಯಾಹ್ನದ ಊಟ',
      'ರಾತ್ರಿ ಊಟ',
      'ದಕ್ಷಿಣ ಭಾರತೀಯ',
      'ಉತ್ತರ ಭಾರತೀಯ',
      'ಚೈನೀಸ್',
      'ಸಿಹಿತಿಂಡಿಗಳು',
      'ತಿಂಡಿಗಳು',
      'ವಿಶೇಷ ಊಟ',
      'ಸಮಾರಂಭದ ಮೆನು',
    ],
    productsEyebrow: 'ನಮ್ಮ ಅಡುಗೆಮನೆಯಿಂದ',
    productsTitle: 'ಮನೆಗೆ ಕೊಂಡೊಯ್ಯುವ ಮನೆಯ ಮೆಚ್ಚಿನ ರುಚಿಗಳು.',
    productsText:
      'ನಮ್ಮ ಉತ್ಪನ್ನಗಳಲ್ಲಿ ಲಭ್ಯವಿರುವ ಪ್ರಿಮಿಕ್ಸ್, ಮಸಾಲೆ ಮತ್ತು ಸಿಹಿತಿಂಡಿಗಳ ಆಯ್ಕೆ. ಲಭ್ಯತೆ, ಪ್ಯಾಕ್ ಗಾತ್ರ ಮತ್ತು ಕ್ಯಾಟರಿಂಗ್ ಮೆನುಗಾಗಿ ವಿಚಾರಿಸಿ.',
    premixTitle: 'ತಿಂಡಿ ಮತ್ತು ಊಟದ ಪ್ರಿಮಿಕ್ಸ್',
    premixAlt: 'ಲಕ್ಷ್ಮಿ ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ಪ್ರಿಮಿಕ್ಸ್ ಪುಡಿಗಳು ಮತ್ತು ಬೆಲೆಗಳು',
    spiceTitle: 'ಸಾಂಪ್ರದಾಯಿಕ ಮಸಾಲೆ ಮಿಶ್ರಣಗಳು',
    spiceAlt: 'ಲಕ್ಷ್ಮಿ ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ದಕ್ಷಿಣ ಭಾರತೀಯ ಮಸಾಲೆಗಳು',
    sweetsTitle: 'ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ಸಿಹಿತಿಂಡಿಗಳು',
    premixes: [
      ['ರವಾ ಇಡ್ಲಿ ಪ್ರಿಮಿಕ್ಸ್', '₹220 / 1 ಕೆ.ಜಿ.'],
      ['ಉಪ್ಪಿಟ್ಟು ಪ್ರಿಮಿಕ್ಸ್', '₹200 / 1 ಕೆ.ಜಿ.'],
      ['ಗೊಜ್ಜವಲಕ್ಕಿ ಪ್ರಿಮಿಕ್ಸ್', '₹240 / 1 ಕೆ.ಜಿ.'],
      ['ಪೊಂಗಲ್ ಪ್ರಿಮಿಕ್ಸ್', '₹260 / 1 ಕೆ.ಜಿ.'],
      ['ಕೇಸರಿ ಬಾತ್ ಪ್ರಿಮಿಕ್ಸ್', '₹480 / 1 ಕೆ.ಜಿ.'],
    ],
    spiceText:
      'ಸಾಂಬಾರ್ ಪುಡಿ · ರಸಂ ಪುಡಿ · ಮೆಂತೆ ಹಿಟ್ಟು · ವಾಂಗೀ ಬಾತ್ ಮತ್ತು ಬಿಸಿಬೇಳೆ ಬಾತ್ ಮಿಶ್ರಣ · ಪುಳಿಯೋಗರೆ ಪುಡಿ ಮತ್ತು ಗೊಜ್ಜು · ಚಟ್ನಿ ಪುಡಿ',
    sweetsText:
      'ರಾಗಿ ಮಾಲ್ಟ್ ಪುಡಿ ಮತ್ತು ಮನೆಯ ಲಡ್ಡುಗಳು. ಒಣಹಣ್ಣಿನ ಲಡ್ಡುಗಳು ಶುದ್ಧ ತುಪ್ಪದಿಂದ, ಸಕ್ಕರೆ ಸೇರಿಸದೆ ಮತ್ತು ಸಂರಕ್ಷಕಗಳಿಲ್ಲದೆ ತಯಾರಾಗುತ್ತವೆ. ಕಡಲೆಹಿಟ್ಟಿನ ಲಡ್ಡುಗಳು ನಂದಿನಿ ತುಪ್ಪ, ಗೋಡಂಬಿ, ಒಣದ್ರಾಕ್ಷಿ ಮತ್ತು ಮೈದಾ ಇಲ್ಲದ ಶುದ್ಧ ಕಡಲೆಹಿಟ್ಟಿನಿಂದ ತಯಾರಾಗುತ್ತವೆ.',
    traditionalPacks: 'ಲಭ್ಯವಿರುವ ಪ್ಯಾಕ್‌ಗಳು: 250 ಗ್ರಾಂ / 500 ಗ್ರಾಂ / 1 ಕೆ.ಜಿ.',
    productOrder: 'ವಾಟ್ಸಾಪ್ ಗುಂಪಿನಲ್ಲಿ ವಿಚಾರಿಸಿ',
    galleryEyebrow: 'ನಮ್ಮ ಅಡುಗೆಯ ಒಂದು ನೋಟ',
    galleryTitle: 'ನಮ್ಮ ಅಡುಗೆಮನೆಯಿಂದ ನಿಮ್ಮ ಮನೆಗೆ.',
    viewImage: 'ಚಿತ್ರ ನೋಡಿ',
    closeImage: 'ಚಿತ್ರ ಮುಚ್ಚಿ',
    familyAlt: 'ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ಸಸ್ಯಾಹಾರಿ ಊಟವನ್ನು ಒಟ್ಟಿಗೆ ಸವಿಯುತ್ತಿರುವ ಕುಟುಂಬ',
    premixGalleryAlt: 'ರವಾ ಇಡ್ಲಿ, ಉಪ್ಪಿಟ್ಟು, ಗೊಜ್ಜವಲಕ್ಕಿ, ಪೊಂಗಲ್ ಮತ್ತು ಕೇಸರಿ ಬಾತ್ ಪ್ರಿಮಿಕ್ಸ್',
    sweetsAlt: 'ರಾಗಿ ಮಾಲ್ಟ್ ಪುಡಿ, ಒಣಹಣ್ಣಿನ ಲಡ್ಡು ಮತ್ತು ಕಡಲೆಹಿಟ್ಟಿನ ಲಡ್ಡು',
    spicesAlt: 'ಸಾಂಪ್ರದಾಯಿಕ ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ದಕ್ಷಿಣ ಭಾರತೀಯ ಮಸಾಲೆ ಪುಡಿಗಳು',
    visionEyebrow: 'ನಮ್ಮ ದೃಷ್ಟಿ',
    visionTitle: 'ಮನೆಯ ರುಚಿ. ಸಂತೋಷದ ಕುಟುಂಬಗಳು. ಸ್ಮರಣೀಯ ಸಂಭ್ರಮಗಳು.',
    visionText:
      'ಪ್ರೀತಿ, ಗುಣಮಟ್ಟ ಮತ್ತು ಕೈಗೆಟುಕುವ ಬೆಲೆಯೊಂದಿಗೆ ಪ್ರತಿ ಸಂದರ್ಭಕ್ಕೂ ಸಾಂಪ್ರದಾಯಿಕ ದಕ್ಷಿಣ ಮತ್ತು ಉತ್ತರ ಭಾರತೀಯ ರುಚಿಗಳನ್ನು ತರುವ, ಶುಚಿಯಾದ, ರುಚಿಯಾದ ಮತ್ತು ಮನೆಯ ಸಸ್ಯಾಹಾರಿ ಊಟಕ್ಕೆ ನಂಬಿಕೆಯ ಮೆಚ್ಚಿನ ಕ್ಯಾಟರಿಂಗ್ ಸೇವೆಯಾಗುವುದು ನಮ್ಮ ಗುರಿ.',
    visionPoints: [
      ['ಶುದ್ಧ ಮತ್ತು ಶುಚಿಯಾದ ಆಹಾರ', 'ತಾಜಾ ಪದಾರ್ಥಗಳು ಮತ್ತು ಸ್ವಚ್ಛ ತಯಾರಿ.'],
      ['ಮನೆಯ ರುಚಿ', 'ಪ್ರೀತಿ ಮತ್ತು ಕಾಳಜಿಯಿಂದ ತಯಾರಿಸಿದ ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿ.'],
      ['ಗುಣಮಟ್ಟಕ್ಕೆ ಮೊದಲ ಆದ್ಯತೆ', 'ಸ್ಥಿರವಾದ ರುಚಿ ಮತ್ತು ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಪದಾರ್ಥಗಳು.'],
      ['ಗ್ರಾಹಕರ ಸಂತೋಷ', 'ಪ್ರತಿ ಊಟದಲ್ಲೂ ಆತ್ಮೀಯತೆ ಮತ್ತು ಗೌರವ.'],
      ['ಕೈಗೆಟುಕುವ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ', 'ಸಮಂಜಸ ಬೆಲೆಯಲ್ಲಿ ರುಚಿಯಾದ ಅಡುಗೆ.'],
      ['ನಂಬಿಕೆಯಿಂದ ಬೆಳವಣಿಗೆ', 'ಪ್ರತಿ ಗ್ರಾಹಕರೊಂದಿಗೆ ದೀರ್ಘಕಾಲದ ಸಂಬಂಧ.'],
    ],
    contactEyebrow: 'ಊಟದ ಬಗ್ಗೆ ಮಾತನಾಡೋಣ',
    contactTitle: 'ನಿಮ್ಮ ಸಂಭ್ರಮದ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
    contactText:
      'ದಿನಾಂಕ, ಅತಿಥಿಗಳ ಸಂಖ್ಯೆ, ಆಹಾರದ ಆಯ್ಕೆ ಮತ್ತು ಸ್ಥಳ ತಿಳಿಸಿ. 2 ರಿಂದ 100 ಜನರಿಗೆ ಮೆನು ಯೋಜಿಸಲು ನೆರವಾಗುತ್ತೇವೆ.',
    callNow: 'ಈಗ ಕರೆ ಮಾಡಿ',
    directions: 'ದಾರಿ ನೋಡಿ',
    mapLabel: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ನೋಡಿ',
    serviceArea: 'ಚುಂಚಘಟ್ಟ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸೇವೆ. ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ಲಭ್ಯತೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ.',
    addressLabel: 'ವಿಳಾಸ ಮತ್ತು ದಾರಿ',
    phoneLabel: 'ಕರೆ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಗುಂಪು',
    footer: 'ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ್ದು · 100% ಶುದ್ಧ ಸಸ್ಯಾಹಾರ · ಪ್ರೀತಿಯ ತಯಾರಿ',
    backToTop: 'ಮೇಲಕ್ಕೆ ಹಿಂತಿರುಗಿ ↑',
  },
} as const

const whatsappUrl = business.whatsappGroupInvite

const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

const analyticsEvents: Record<string, AnalyticsEvent> = {
  daily_catering_enquiry: 'daily_catering_enquiry',
  event_catering_enquiry: 'event_catering_enquiry',
  product_enquiry: 'product_enquiry',
}

function App() {
  const [language, setLanguage] = useState<Language>(() =>
    window.localStorage.getItem('lakshmi-language') === 'kn' ? 'kn' : 'en',
  )
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)
  const imageViewer = useRef<HTMLDialogElement>(null)
  const t = copy[language]
  const directionsUrl = mapsSearchUrl(`${fullAddress} ${business.name}`)

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('lakshmi-language', language)
  }, [language])

  useEffect(() => {
    initializeAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID)
  }, [])

  useEffect(() => {
    if (activeImage && imageViewer.current && !imageViewer.current.open) {
      imageViewer.current.showModal()
    }
  }, [activeImage])

  return (
    <main
      onClick={(event) => {
        const target = event.target
        if (!(target instanceof Element)) {
          return
        }

        const link = target.closest<HTMLAnchorElement>('a')
        if (!link) {
          return
        }

        if (link.href.startsWith('tel:')) {
          trackEvent('phone_click')
        } else if (link.href.includes('chat.whatsapp.com')) {
          const eventName = link.dataset.analyticsEvent
          trackEvent(analyticsEvents[eventName ?? ''] ?? 'whatsapp_click')
        } else if (link.href.includes('google.com/maps')) {
          trackEvent('directions_click')
        }
      }}
    >
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Lakshmi Catering Services home">
          <img
            className="brand-logo"
            src={publicImage('lakshmi-logo.jpg')}
            alt="Lakshmi Catering Services — Home Made, Pure Veg"
          />
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">{t.home}</a>
          <a href="#daily-catering">{t.dailyCatering}</a>
          <a href="#event-catering">{t.eventCatering}</a>
          <a href="#menu">{t.menu}</a>
          <a href="#products">{t.products}</a>
          <a href="#vision">{t.vision}</a>
          <a href="#gallery">{t.gallery}</a>
          <a href="#about">{t.about}</a>
          <a href="#contact">{t.contact}</a>
        </nav>

        <div className="header-actions">
          <button
            className="language-switch"
            type="button"
            onClick={() => {
              trackEvent('language_change')
              setLanguage(language === 'en' ? 'kn' : 'en')
            }}
            aria-label={`Switch language to ${t.language}`}
          >
            <span className="language-dot" />
            {t.language}
          </button>
          <a className="button button-small" href={whatsappUrl} target="_blank" rel="noreferrer">
            {t.whatsapp}<span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><span />{t.eyebrow}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-actions">
            <a className="button" data-analytics-event="daily_catering_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t.orderDaily}<span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" data-analytics-event="event_catering_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t.getQuote}<span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="hero-note">
            <span className="note-icon" aria-hidden="true">✳</span>
            <span>{t.peopleRange}</span>
          </div>
          <div className="cuisine-tags" aria-label="Cuisines served">
            {t.cuisine.map((cuisine) => <span key={cuisine}>{cuisine}</span>)}
          </div>
        </div>
        <div className="hero-visual">
          <img src={publicImage('family-meal.jpg')} alt={t.heroImageAlt} />
          <div className="hero-stamp" aria-hidden="true">
            <span>100% PURE</span>
            <strong>✳</strong>
            <span>VEGETARIAN</span>
          </div>
          <div className="image-caption">
            <span className="caption-line" />
            <span>HOME MADE · PURE VEG</span>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">01 <span /> 06</div>
      </section>

      <section className="trust-bar" aria-label="Why choose Lakshmi Catering Services">
        {t.trustItems.map((item, index) => (
          <div className="trust-item" key={item}><span aria-hidden="true">{['🌿', '⌂', '✳', '♡', '⌖', '✦'][index]}</span>{item}</div>
        ))}
      </section>

      <section className="intro section-wrap" id="about">
        <div className="section-kicker"><span>01</span>{t.aboutEyebrow}</div>
        <div className="intro-content">
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutText}</p>
        </div>
        <span className="intro-sun" aria-hidden="true">✳</span>
      </section>

      <section className="food-section" id="services">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <div className="section-kicker"><span>02</span>{t.servicesEyebrow}</div>
              <h2>{t.servicesTitle}</h2>
            </div>
          </div>
          <div className="primary-services">
            <article className="primary-service-card" id="daily-catering">
              <div className="primary-service-icon" aria-hidden="true">⌂</div>
              <span className="service-number">01 · DAILY MEALS</span>
              <h3>{t.dailyCateringTitle}</h3>
              <p>{t.dailyCateringText}</p>
              <div className="service-chip-list">
                {t.dailyCategories.map((category) => <span key={category}>{category}</span>)}
              </div>
              <a className="button" data-analytics-event="daily_catering_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
                {t.dailyButton}<span aria-hidden="true">↗</span>
              </a>
            </article>
            <article className="primary-service-card event-service-card" id="event-catering">
              <div className="primary-service-icon" aria-hidden="true">✳</div>
              <span className="service-number">02 · SPECIAL OCCASIONS</span>
              <h3>{t.eventCateringTitle}</h3>
              <p>{t.eventCateringText}</p>
              <div className="service-chip-list">
                {t.eventCategories.map((category) => <span key={category}>{category}</span>)}
              </div>
              <a className="button" data-analytics-event="event_catering_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
                {t.eventButton}<span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>
          <div className="serving-note">
            <span className="serving-icon" aria-hidden="true">✳</span>
            <div><span>{t.servingEyebrow}</span><h3>{t.servingTitle}</h3><p>{t.servingText}</p></div>
            <a className="button" data-analytics-event="daily_catering_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t.servingButton}<span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="cuisine-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="section-kicker"><span>03</span>{t.cuisinesEyebrow}</div>
            <h2>{t.cuisineTitle}</h2>
          </div>
        </div>
        <div className="cuisine-grid">
          {t.cuisine.map((cuisine, index) => (
            <article className="cuisine-card" key={cuisine}>
              <span>0{index + 1}</span><h3>{cuisine}</h3><p>{t.cuisineDescriptions[index]}</p>
            </article>
          ))}
        </div>
        <a className="text-link cuisine-menu-link" href="#menu">{t.viewMenu}<span aria-hidden="true">→</span></a>
      </section>

      <section className="meal-menu-section section-wrap" id="menu">
        <div className="section-heading">
          <div>
            <div className="section-kicker"><span>04</span>{t.menuEyebrow}</div>
            <h2>{t.menuTitle}</h2>
          </div>
          <p>{t.menuText}</p>
        </div>
        <div className="menu-category-list">
          {t.menuCategories.map((category) => <span key={category}>{category}</span>)}
        </div>
        <a className="button" href={whatsappUrl} target="_blank" rel="noreferrer">
          {t.orderDaily}<span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="menu-section" id="products">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <div className="section-kicker"><span>05</span>{t.productsEyebrow}</div>
              <h2>{t.productsTitle}</h2>
            </div>
            <p>{t.productsText}</p>
          </div>
          <div className="menu-grid">
            <article className="menu-card menu-card-featured">
              <img src={publicImage('homemade-premixes.jpg')} alt={t.premixAlt} loading="lazy" />
              <div className="menu-card-copy">
                <div className="menu-card-heading"><h3>{t.premixTitle}</h3><span>01</span></div>
                <ul className="price-list">
                  {t.premixes.map(([name, price]) => (
                    <li key={name}>
                      <span>{name}</span><strong>{price}</strong>
                      <a
                        className="product-order-link"
                        data-analytics-event="product_enquiry"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${t.productOrder}: ${name}`}
                      >↗</a>
                    </li>
                  ))}
                </ul>
                <a className="text-link product-category-link" data-analytics-event="product_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
                  {t.productOrder}<span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
            <article className="menu-card">
              <img src={publicImage('traditional-spice-mixes.jpg')} alt={t.spiceAlt} loading="lazy" />
              <div className="menu-card-copy">
                <div className="menu-card-heading"><h3>{t.spiceTitle}</h3><span>02</span></div>
                <p>{t.spiceText}</p>
                <p className="product-pack-note">{t.traditionalPacks}</p>
                <a className="text-link" data-analytics-event="product_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
                  {t.productOrder}<span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
            <article className="menu-card">
              <img src={publicImage('millet-malt-sweets.jpg')} alt={t.sweetsAlt} loading="lazy" />
              <div className="menu-card-copy">
                <div className="menu-card-heading"><h3>{t.sweetsTitle}</h3><span>03</span></div>
                <p>{t.sweetsText}</p>
                <a className="text-link" data-analytics-event="product_enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
                  {t.productOrder}<span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <div className="section-kicker"><span>06</span>{t.galleryEyebrow}</div>
              <h2>{t.galleryTitle}</h2>
            </div>
          </div>
          <div className="gallery-grid">
            <figure className="gallery-item gallery-family">
              <button className="gallery-image-button" type="button" onClick={() => setActiveImage({ src: publicImage('family-meal.jpg'), alt: t.familyAlt })} aria-label={`${t.viewImage}: ${t.familyAlt}`}>
                <img src={publicImage('family-meal.jpg')} alt={t.familyAlt} loading="lazy" />
              </button>
              <figcaption>{t.familyAlt}</figcaption>
            </figure>
            <figure className="gallery-item">
              <button className="gallery-image-button" type="button" onClick={() => setActiveImage({ src: publicImage('homemade-premixes.jpg'), alt: t.premixGalleryAlt })} aria-label={`${t.viewImage}: ${t.premixGalleryAlt}`}>
                <img src={publicImage('homemade-premixes.jpg')} alt={t.premixGalleryAlt} loading="lazy" />
              </button>
              <figcaption>{t.premixTitle}</figcaption>
            </figure>
            <figure className="gallery-item">
              <button className="gallery-image-button" type="button" onClick={() => setActiveImage({ src: publicImage('millet-malt-sweets.jpg'), alt: t.sweetsAlt })} aria-label={`${t.viewImage}: ${t.sweetsAlt}`}>
                <img src={publicImage('millet-malt-sweets.jpg')} alt={t.sweetsAlt} loading="lazy" />
              </button>
              <figcaption>{t.sweetsTitle}</figcaption>
            </figure>
            <figure className="gallery-item">
              <button className="gallery-image-button" type="button" onClick={() => setActiveImage({ src: publicImage('traditional-spice-mixes.jpg'), alt: t.spicesAlt })} aria-label={`${t.viewImage}: ${t.spicesAlt}`}>
                <img src={publicImage('traditional-spice-mixes.jpg')} alt={t.spicesAlt} loading="lazy" />
              </button>
              <figcaption>{t.spiceTitle}</figcaption>
            </figure>
            <figure className="gallery-item">
              <button className="gallery-image-button" type="button" onClick={() => setActiveImage({ src: publicImage('dry-fruit-laddus.jpg'), alt: t.sweetsAlt })} aria-label={`${t.viewImage}: ${t.sweetsAlt}`}>
                <img src={publicImage('dry-fruit-laddus.jpg')} alt={t.sweetsAlt} loading="lazy" />
              </button>
              <figcaption>{t.sweetsTitle}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="vision-section section-wrap" id="vision">
        <div className="vision-photo">
          <img src={publicImage('family-meal.jpg')} alt={t.familyAlt} loading="lazy" />
        </div>
        <p className="vision-caption">{t.visionTitle}</p>
        <div className="vision-copy">
          <div className="section-kicker"><span>07</span>{t.visionEyebrow}</div>
          <h2>{t.visionTitle}</h2>
          <p>{t.visionText}</p>
          <a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">
            {t.whatsapp}<span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="vision-points">
          {t.visionPoints.map(([point, description], index) => (
            <div className="vision-point" key={point}><span aria-hidden="true">{['🥗', '❤️', '🌿', '🙏', '💚', '✨'][index]}</span><div><strong>{point}</strong><p>{description}</p></div></div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <div className="section-kicker"><span>08</span>{t.contactEyebrow}</div>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactText}</p>
          <div className="contact-actions">
            <a className="button" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t.whatsapp}<span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href={`tel:${business.phone}`}>{t.callNow}<span aria-hidden="true">→</span></a>
          </div>
          <div className="contact-details">
            <div><span>{t.phoneLabel}</span><a href={`tel:${business.phone}`}>{business.phone}</a></div>
            <div><span>{t.addressLabel}</span><a href={directionsUrl} target="_blank" rel="noreferrer">{fullAddress}</a></div>
            <p>{t.serviceArea} ({business.serviceRadius})</p>
          </div>
        </div>
        <div className="map-frame">
          <iframe
            title="Lakshmi Catering Services location in Chunchghatta, Bengaluru"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${fullAddress} ${business.name}`)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="map-link" href={directionsUrl} target="_blank" rel="noreferrer">
            <span className="map-pin" aria-hidden="true">⌖</span>
            {t.mapLabel}<span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand brand-footer" href="#home" aria-label="Lakshmi Catering Services home">
          <img className="brand-logo" src={publicImage('lakshmi-logo.jpg')} alt="Lakshmi Catering Services" />
        </a>
        <span className="footer-note">{t.footer}</span>
        <a className="back-top" href="#home">{t.backToTop}</a>
        <span className="footer-copyright">© {currentYear} {business.name}</span>
      </footer>

      <dialog className="image-viewer" ref={imageViewer} onClose={() => setActiveImage(null)}>
        <button className="image-viewer-close" type="button" onClick={() => imageViewer.current?.close()} aria-label={t.closeImage}>×</button>
        {activeImage && <img src={activeImage.src} alt={activeImage.alt} />}
        {activeImage && <p>{activeImage.alt}</p>}
      </dialog>

      <a
        className="whatsapp-float"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={t.whatsapp}
      >
        <span aria-hidden="true">◉</span>{t.whatsapp}
      </a>

      <nav className="mobile-action-bar" aria-label="Quick actions">
        <a href={`tel:${business.phone}`}><span aria-hidden="true">☎</span>{t.callNow}</a>
        <a href={whatsappUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">◉</span>{t.whatsapp}</a>
        <a href={directionsUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span>{t.directions}</a>
      </nav>
    </main>
  )
}

export default App
