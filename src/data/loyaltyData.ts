import { RewardItem, TierInfo, UserLoyalty, LoyaltyTransaction } from '../types/loyalty';

export const TIERS_INFO: Record<string, TierInfo> = {
  'Silver Noble': {
    tier: 'Silver Noble',
    minPoints: 0,
    maxPoints: 500,
    multiplierText: '1.0x',
    multiplierRate: 1.0,
    perks: [
      '1 Royal Point for every PKR 100 spent',
      'Birthday Complimentary Dessert on dine-in',
      'Digital Card & Points Wallet access',
      'Exclusive seasonal menu invitations'
    ],
    cardGradient: 'from-zinc-900 via-stone-800 to-zinc-950',
    accentColor: '#C0C0C0',
    badgeColor: 'border-zinc-500 text-zinc-300 bg-zinc-800/80'
  },
  'Gold Aristocrat': {
    tier: 'Gold Aristocrat',
    minPoints: 500,
    maxPoints: 1500,
    multiplierText: '1.5x',
    multiplierRate: 1.5,
    perks: [
      '1.5x Points Multiplier on all dining & takeaways',
      '5% Flat privilege discount on banquet reservations',
      'Complimentary Tandoori Roghni Naan basket with every Karahi',
      'Priority table allocation during weekend peak hours',
      'Direct line to Executive Maître d\''
    ],
    cardGradient: 'from-stone-900 via-amber-950/60 to-zinc-950',
    accentColor: '#D4AF37',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60'
  },
  'Royal Platinum': {
    tier: 'Royal Platinum',
    minPoints: 1500,
    maxPoints: 999999,
    multiplierText: '2.0x',
    multiplierRate: 2.0,
    perks: [
      '2.0x Double Points on every rupee spent',
      '10% Flat privilege discount on all royal feasts',
      'Complimentary Chef\'s Tasting Dish on every dinner reservation',
      'Guaranteed VIP Shahi Chamber dining reservation',
      'Invitations to Private Royal Mughal Tasting Evenings',
      'Personal Butler service & customized spice profiles'
    ],
    cardGradient: 'from-amber-950/80 via-stone-900 to-purple-950/40',
    accentColor: '#F3E5AB',
    badgeColor: 'border-yellow-400 text-yellow-200 bg-yellow-950/80'
  }
};

export const INITIAL_USER: UserLoyalty = {
  id: 'usr-001',
  name: 'Sardar Tariq Khan',
  email: 'patron@zaiqaroyale.com',
  phone: '+92 300 9876543',
  memberId: 'ZR-8842-GOLD',
  membershipTier: 'Gold Aristocrat',
  accumulatedPoints: 450,
  lifetimePoints: 1250,
  memberSince: 'March 2024',
  diningVisits: 14,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
};

export const DEMO_USERS: UserLoyalty[] = [
  INITIAL_USER,
  {
    id: 'usr-002',
    name: 'Princess Fatima Al-Zahra',
    email: 'fatima@royale.pk',
    phone: '+92 333 1122334',
    memberId: 'ZR-1049-SLVR',
    membershipTier: 'Silver Noble',
    accumulatedPoints: 100,
    lifetimePoints: 100,
    memberSince: 'September 2026',
    diningVisits: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-003',
    name: 'Nawabzada Haris Qureshi',
    email: 'nawab.haris@zaiqaroyale.com',
    phone: '+92 321 4455667',
    memberId: 'ZR-9901-PLAT',
    membershipTier: 'Royal Platinum',
    accumulatedPoints: 1850,
    lifetimePoints: 3400,
    memberSince: 'January 2023',
    diningVisits: 38,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-01',
    title: 'PKR 500 Royal Karahi Voucher',
    subtitle: 'Direct discount off your next takeaway or dine-in feast',
    description: 'Redeemable on any order exceeding PKR 2,000. Valid for Shinwari Karahi, Dum Biryani, and Charcoal BBQ.',
    category: 'voucher',
    pointsRequired: 200,
    discountAmountPKR: 500,
    badge: 'Popular Choice',
    iconName: 'ticket',
    terms: 'Valid for 30 days from claiming. Cannot be combined with other promotional coupons.',
    stockLeft: 42,
    promoCode: 'ROYAL500-KHAN'
  },
  {
    id: 'rew-02',
    title: 'Tandoori Roghni Naan Basket',
    subtitle: 'Hot clay-oven baked naans with sesame & churned butter',
    description: 'Complimentary basket of 3 fresh Roghni Naans with garlic butter & nigella seeds (kalonji).',
    category: 'delicacy',
    pointsRequired: 120,
    discountAmountPKR: 350,
    badge: 'Chef Favorite',
    iconName: 'utensils',
    terms: 'Valid on any dine-in table or online delivery order.',
    stockLeft: 85,
    promoCode: 'NAAN-FEAST'
  },
  {
    id: 'rew-03',
    title: 'Peshawari Saffron Kahwa Kettle',
    subtitle: 'Simmered with cardamom, pure saffron & crushed almonds',
    description: 'A traditional royal copper kettle of Peshawari saffron green tea served with crystallized sugar.',
    category: 'beverage',
    pointsRequired: 150,
    discountAmountPKR: 380,
    badge: 'Signature',
    iconName: 'coffee',
    terms: 'Serves up to 2 guests. Dine-in only.',
    stockLeft: 30,
    promoCode: 'KAHWA-KETTLE'
  },
  {
    id: 'rew-04',
    title: 'PKR 1,000 Shahi Banquet Voucher',
    subtitle: 'Substantial reward for festive celebrations & gatherings',
    description: 'Redeemable on grand orders exceeding PKR 4,500. Perfect for family celebrations and dinner parties.',
    category: 'voucher',
    pointsRequired: 380,
    discountAmountPKR: 1000,
    badge: 'High Value',
    iconName: 'percent',
    terms: 'Valid for 45 days. Applicable for dine-in or doorstep delivery across Lahore.',
    stockLeft: 18,
    promoCode: 'SHAHI1000'
  },
  {
    id: 'rew-05',
    title: 'Shahi Kasora Pistachio Kheer',
    subtitle: 'Slow-simmered rice pudding crowned with edible silver vark',
    description: 'Two traditional terracotta kasoras of artisanal kheer with green cardamom, roasted pistachios and saffron.',
    category: 'delicacy',
    pointsRequired: 220,
    discountAmountPKR: 750,
    badge: 'Sweet Royale',
    iconName: 'gift',
    terms: 'Requires any main course order.',
    stockLeft: 25,
    promoCode: 'KASORA-KHEER'
  },
  {
    id: 'rew-06',
    title: 'VIP Chef’s Table Degustation',
    subtitle: 'Private curated 5-course tasting menu with Head Ustad',
    description: 'An exclusive dining experience at the Shahi Private Chamber with customized smoke profiles and off-menu recipes.',
    category: 'experience',
    pointsRequired: 800,
    discountAmountPKR: 3500,
    badge: 'Royal Platinum Exclusive',
    iconName: 'crown',
    terms: 'Reservation required 48 hours in advance. Valid for 2 guests.',
    stockLeft: 5,
    promoCode: 'VIP-DEGUST'
  }
];

export const INITIAL_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'tx-101',
    date: '2026-09-28',
    description: 'Earned on Royal Charcoal BBQ & Dum Handi Feast',
    type: 'earned',
    pointsChange: 140,
    balanceAfter: 450,
    orderRef: 'ZR-ORD-8821',
    billTotalPKR: 9350
  },
  {
    id: 'tx-102',
    date: '2026-09-14',
    description: 'Redeemed for PKR 500 Royal Karahi Voucher',
    type: 'redeemed',
    pointsChange: -200,
    balanceAfter: 310,
    orderRef: 'ZR-ORD-8742',
    billTotalPKR: 4200
  },
  {
    id: 'tx-103',
    date: '2026-09-02',
    description: 'Earned on Mutton Shinwari & Roghni Naan Platter',
    type: 'earned',
    pointsChange: 180,
    balanceAfter: 510,
    orderRef: 'ZR-ORD-8610',
    billTotalPKR: 12000
  },
  {
    id: 'tx-104',
    date: '2026-08-15',
    description: 'Independence Day Shahi Festival Bonus Points',
    type: 'bonus',
    pointsChange: 150,
    balanceAfter: 330
  },
  {
    id: 'tx-105',
    date: '2026-07-22',
    description: 'Earned on Royal Family Daawat Feast',
    type: 'earned',
    pointsChange: 80,
    balanceAfter: 180,
    orderRef: 'ZR-ORD-8401',
    billTotalPKR: 5400
  },
  {
    id: 'tx-106',
    date: '2026-03-10',
    description: 'Royal Welcome Bonus for joining Shahi Club',
    type: 'bonus',
    pointsChange: 100,
    balanceAfter: 100
  }
];
