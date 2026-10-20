/*
 * Uwem Ministries International — central public-site configuration.
 *
 * Update verified public links, contact details, the address, and service times
 * here. Service times below were transcribed from the supplied ministry banner
 * (IMG-20261010-WA0008.jpg) and the accompanying social-information PDF.
 * All times use Africa/Lagos (WAT).
 */
export const SITE_CONFIG = Object.freeze({
  name: 'Uwem Ministries International',
  tagline: 'Celebrating Jesus Christ Everyday',
  statement: "Raising Kingdom Champions, Transforming Lives, and Advancing God's Kingdom.",
  websiteUrl: 'https://www.uwemministries.org',
  timeZone: 'Africa/Lagos',
  timeZoneLabel: 'WAT',

  contacts: {
    phones: {
      nigeriaPrimary: { display: '+234 807 114 7348', tel: 'tel:+2348071147348' },
      nigeriaSecondary: { display: '+234 806 894 1773', tel: 'tel:+2348068941773' },
      international: { display: '+1 647-702-6906', tel: 'tel:+16477026906' },
      churchBus: { display: '+234 807 114 7348', tel: 'tel:+2348071147348' },
    },
    email: 'uwemministriesuyo@gmail.com',
  },

  location: {
    generalArea: 'Uyo, Akwa Ibom State, Nigeria',
    address: 'Aka–Obot Idim Road, by Ikot Odout U-turn, Uyo, Akwa Ibom State, Nigeria',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=AKA%20Obot%20Idim%20Road%20by%20Ikot%20Odout%20U-turn%2C%20Uyo%2C%20Akwa%20Ibom%20State%2C%20Nigeria',
    source: 'Address transcribed from the supplied ministry banner; no official map listing or coordinates were supplied.',
  },

  whatsapp: {
    // The project brief explicitly designates this number for general enquiries.
    generalNumber: '2348071147348',
    generalMessage: 'Hello Uwem Ministries International. I would like to make an enquiry.',
    communityUrl: 'https://chat.whatsapp.com/D4X3UQQcLE2G3GOQuXfQFU',
  },

  prayer: {
    tallyUrl: 'https://tally.so/r/o96vQP',
    embedUrl: 'https://tally.so/embed/o96vQP?alignLeft=1&hideTitle=1&transparentBackground=1',
  },

  social: {
    facebook: {
      label: 'Facebook',
      url: 'https://www.facebook.com/share/1dZwnExQ6j/',
    },
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/umi_church?exln=MTE0d2dkbmtxdWEwZg==',
    },
    tiktok: {
      label: 'TikTok',
      url: 'https://vm.tiktok.com/ZS9UfU47nsnGt-4vjQ2/',
    },
    youtube: {
      label: 'YouTube',
      url: 'https://youtube.com/@umi_church?si=AyKFOWw29-Nu94kI',
    },
  },

  services: {
    supernaturalSunday: {
      title: 'Supernatural Sunday',
      dayOfWeek: 0,
      time: '09:00',
      description: 'Sunday gathering · Supernatural Movement on the supplied ministry banner',
    },
    transformationService: {
      title: 'Transformation Service',
      dayOfWeek: 4,
      time: '17:30',
      description: 'Thursday midweek service',
    },
    redemptionNight: {
      title: 'Redemption Night',
      cadence: 'monthly-first-friday',
      time: '21:00',
      description: 'First Friday of every month',
    },
  },

  additionalSchedule: [
    { day: 'Monday', name: 'Miracle & Power Night', time: '10:00 PM – dawn' },
    { day: 'Wednesday', name: 'Fasting & Prayer', time: '6:00 AM – 12:00 noon' },
  ],
});
