import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserLoyalty,
  RewardItem,
  ClaimedReward,
  LoyaltyTransaction,
  MembershipTier,
  TierInfo,
  ActiveTab
} from '../types/loyalty';
import {
  INITIAL_USER,
  DEMO_USERS,
  INITIAL_REWARDS,
  INITIAL_TRANSACTIONS,
  TIERS_INFO
} from '../data/loyaltyData';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface LoyaltyContextType {
  user: UserLoyalty;
  allUsers: UserLoyalty[];
  switchUser: (userId: string) => void;
  rewards: RewardItem[];
  claimedRewards: ClaimedReward[];
  transactions: LoyaltyTransaction[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tierInfo: TierInfo;
  nextTier: TierInfo | null;
  pointsToNextTier: number;
  progressPercent: number;
  redeemReward: (rewardId: string) => boolean;
  earnPointsFromBill: (billPKR: number, description?: string) => void;
  notifications: ToastNotification[];
  removeNotification: (id: string) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
  transactionFilter: 'all' | 'earned' | 'redeemed' | 'bonus';
  setTransactionFilter: (filter: 'all' | 'earned' | 'redeemed' | 'bonus') => void;
  selectedRewardForModal: RewardItem | null;
  setSelectedRewardForModal: (reward: RewardItem | null) => void;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserLoyalty>(() => {
    const saved = localStorage.getItem('zr_loyalty_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('zr_loyalty_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>(() => {
    const saved = localStorage.getItem('zr_loyalty_claimed');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>(() => {
    const saved = localStorage.getItem('zr_loyalty_tx');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'earned' | 'redeemed' | 'bonus'>('all');
  const [selectedRewardForModal, setSelectedRewardForModal] = useState<RewardItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('zr_loyalty_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zr_loyalty_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('zr_loyalty_claimed', JSON.stringify(claimedRewards));
  }, [claimedRewards]);

  useEffect(() => {
    localStorage.setItem('zr_loyalty_tx', JSON.stringify(transactions));
  }, [transactions]);

  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Determine Tier Info
  const tierInfo = TIERS_INFO[user.membershipTier] || TIERS_INFO['Silver Noble'];

  let nextTier: TierInfo | null = null;
  let pointsToNextTier = 0;
  let progressPercent = 100;

  if (user.membershipTier === 'Silver Noble') {
    nextTier = TIERS_INFO['Gold Aristocrat'];
    pointsToNextTier = Math.max(0, 500 - user.lifetimePoints);
    progressPercent = Math.min(100, Math.round((user.lifetimePoints / 500) * 100));
  } else if (user.membershipTier === 'Gold Aristocrat') {
    nextTier = TIERS_INFO['Royal Platinum'];
    pointsToNextTier = Math.max(0, 1500 - user.lifetimePoints);
    progressPercent = Math.min(100, Math.round(((user.lifetimePoints - 500) / 1000) * 100));
  } else {
    nextTier = null;
    pointsToNextTier = 0;
    progressPercent = 100;
  }

  // Switch demo persona
  const switchUser = (userId: string) => {
    const target = DEMO_USERS.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      showNotification('Patron Profile Switched', `Logged in as ${target.name} (${target.membershipTier})`, 'info');
    }
  };

  // Redeem a reward
  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) {
      showNotification('Reward Not Found', 'This reward could not be identified in the royal treasury.', 'error');
      return false;
    }

    if (user.accumulatedPoints < reward.pointsRequired) {
      showNotification(
        'Insufficient Royal Points',
        `You need ${reward.pointsRequired} points. Current treasury balance is ${user.accumulatedPoints} pts.`,
        'error'
      );
      return false;
    }

    if (reward.stockLeft <= 0) {
      showNotification('Offer Exhausted', 'This reward allocation has reached capacity.', 'error');
      return false;
    }

    const newBalance = user.accumulatedPoints - reward.pointsRequired;
    const nowStr = new Date().toISOString().split('T')[0];

    // 1. Update user
    setUser((prev) => ({
      ...prev,
      accumulatedPoints: newBalance
    }));

    // 2. Decrement reward stock
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, stockLeft: Math.max(0, r.stockLeft - 1) } : r))
    );

    // 3. Add to claimed rewards
    const newClaim: ClaimedReward = {
      id: `claim-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      pointsSpent: reward.pointsRequired,
      claimedDate: nowStr,
      promoCode: `${reward.promoCode}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };
    setClaimedRewards((prev) => [newClaim, ...prev]);

    // 4. Log transaction
    const newTx: LoyaltyTransaction = {
      id: `tx-${Date.now()}`,
      date: nowStr,
      description: `Redeemed for ${reward.title}`,
      type: 'redeemed',
      pointsChange: -reward.pointsRequired,
      balanceAfter: newBalance,
      orderRef: newClaim.promoCode
    };
    setTransactions((prev) => [newTx, ...prev]);

    showNotification(
      'Royal Reward Claimed! 👑',
      `Redeemed ${reward.title} for ${reward.pointsRequired} pts. Code: ${newClaim.promoCode}`,
      'success'
    );
    setSelectedRewardForModal(null);
    return true;
  };

  // Earn points from bill calculation
  const earnPointsFromBill = (billPKR: number, description?: string) => {
    if (billPKR <= 0) return;
    const basePoints = Math.floor(billPKR / 100);
    const earned = Math.round(basePoints * tierInfo.multiplierRate);
    const newPoints = user.accumulatedPoints + earned;
    const newLifetime = user.lifetimePoints + earned;
    const nowStr = new Date().toISOString().split('T')[0];

    // Check tier promotion
    let updatedTier = user.membershipTier;
    if (newLifetime >= 1500) {
      updatedTier = 'Royal Platinum';
    } else if (newLifetime >= 500) {
      updatedTier = 'Gold Aristocrat';
    }

    if (updatedTier !== user.membershipTier) {
      showNotification(
        'Elevated Nobility Rank! 🌟',
        `Congratulations! You have ascended to ${updatedTier} with ${tierInfo.multiplierText} privilege!`,
        'success'
      );
    }

    setUser((prev) => ({
      ...prev,
      accumulatedPoints: newPoints,
      lifetimePoints: newLifetime,
      membershipTier: updatedTier,
      diningVisits: prev.diningVisits + 1
    }));

    const orderRef = `ZR-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: LoyaltyTransaction = {
      id: `tx-${Date.now()}`,
      date: nowStr,
      description: description || `Earned on Feast Order of PKR ${billPKR.toLocaleString()}`,
      type: 'earned',
      pointsChange: earned,
      balanceAfter: newPoints,
      orderRef,
      billTotalPKR: billPKR
    };

    setTransactions((prev) => [newTx, ...prev]);

    showNotification(
      'Royal Points Awarded! ✨',
      `+${earned} Royal Points credited to your treasury (${tierInfo.multiplierText} multiplier applied).`,
      'success'
    );
  };

  return (
    <LoyaltyContext.Provider
      value={{
        user,
        allUsers: DEMO_USERS,
        switchUser,
        rewards,
        claimedRewards,
        transactions,
        activeTab,
        setActiveTab,
        tierInfo,
        nextTier,
        pointsToNextTier,
        progressPercent,
        redeemReward,
        earnPointsFromBill,
        notifications,
        removeNotification,
        searchFilter,
        setSearchFilter,
        transactionFilter,
        setTransactionFilter,
        selectedRewardForModal,
        setSelectedRewardForModal
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};
