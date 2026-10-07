export type MembershipTier = 'Silver Noble' | 'Gold Aristocrat' | 'Royal Platinum';

export interface UserLoyalty {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
  membershipTier: MembershipTier;
  accumulatedPoints: number;
  lifetimePoints: number;
  memberSince: string;
  diningVisits: number;
  avatarUrl?: string;
}

export type RewardCategory = 'voucher' | 'delicacy' | 'beverage' | 'experience';

export interface RewardItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: RewardCategory;
  pointsRequired: number;
  discountAmountPKR?: number;
  badge?: string;
  iconName: 'ticket' | 'utensils' | 'coffee' | 'crown' | 'gift' | 'percent';
  image?: string;
  terms: string;
  stockLeft: number;
  promoCode: string;
}

export interface ClaimedReward {
  id: string;
  rewardId: string;
  title: string;
  pointsSpent: number;
  claimedDate: string;
  promoCode: string;
  status: 'active' | 'used' | 'expired';
  expiresAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  type: 'earned' | 'redeemed' | 'bonus';
  pointsChange: number;
  balanceAfter: number;
  orderRef?: string;
  billTotalPKR?: number;
}

export type ActiveTab = 'overview' | 'rewards' | 'vouchers' | 'transactions' | 'calculator' | 'card';

export interface TierInfo {
  tier: MembershipTier;
  minPoints: number;
  maxPoints: number;
  multiplierText: string;
  multiplierRate: number;
  perks: string[];
  cardGradient: string;
  accentColor: string;
  badgeColor: string;
}
