import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { RewardItem, RewardCategory } from '../../types/loyalty';
import { Ticket, Utensils, Coffee, Crown, Gift, Percent, Sparkles, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';

export const AvailableRewards: React.FC = () => {
  const {
    user,
    rewards,
    redeemReward,
    selectedRewardForModal,
    setSelectedRewardForModal
  } = useLoyalty();

  const [activeCategory, setActiveCategory] = useState<'all' | RewardCategory>('all');
  const [search, setSearch] = useState('');

  const renderIcon = (name: string) => {
    switch (name) {
      case 'ticket':
        return <Ticket className="w-5 h-5 text-amber-400" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'crown':
        return <Crown className="w-5 h-5 text-yellow-300" />;
      case 'percent':
        return <Percent className="w-5 h-5 text-emerald-400" />;
      default:
        return <Gift className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const matchCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Privileges' },
            { id: 'voucher', label: 'Cash Vouchers' },
            { id: 'delicacy', label: 'Complimentary Dishes' },
            { id: 'beverage', label: 'Royal Beverages' },
            { id: 'experience', label: 'VIP Experiences' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-amber-500/40 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search rewards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-stone-900 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3.5 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRewards.map((reward) => {
          const canAfford = user.accumulatedPoints >= reward.pointsRequired;
          const pointsNeeded = reward.pointsRequired - user.accumulatedPoints;
          const percentProgress = Math.min(100, Math.round((user.accumulatedPoints / reward.pointsRequired) * 100));

          return (
            <div
              key={reward.id}
              className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Banner Tag */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition">
                    {renderIcon(reward.iconName)}
                  </div>
                  {reward.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {reward.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-royal text-base font-bold text-stone-100 group-hover:text-amber-200 transition">
                  {reward.title}
                </h4>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5 mb-2">
                  {reward.subtitle}
                </p>
                <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed mb-4">
                  {reward.description}
                </p>
              </div>

              {/* Bottom Actions & Points */}
              <div className="pt-3 border-t border-stone-800/80">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Redemption Cost</span>
                    <span className="text-lg font-bold font-royal gold-gradient-text">
                      {reward.pointsRequired} Pts
                    </span>
                  </div>

                  {reward.discountAmountPKR && (
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      PKR {reward.discountAmountPKR.toLocaleString()} Value
                    </span>
                  )}
                </div>

                {/* Progress bar if not affordable */}
                {!canAfford && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                      <span>Treasury Progress</span>
                      <span>{pointsNeeded} more pts needed</span>
                    </div>
                    <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500/80 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Claim Button */}
                <button
                  onClick={() => setSelectedRewardForModal(reward)}
                  disabled={!canAfford || reward.stockLeft <= 0}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    canAfford && reward.stockLeft > 0
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 hover:brightness-110 shadow-md hover:shadow-amber-500/20 active:scale-98'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {reward.stockLeft <= 0
                      ? 'Reward Out of Stock'
                      : canAfford
                      ? `Redeem for ${reward.pointsRequired} Points`
                      : `Requires ${pointsNeeded} More Points`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Promo Code Modal */}
      {selectedRewardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl text-stone-100">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRewardForModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Icon */}
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
              {renderIcon(selectedRewardForModal.iconName)}
            </div>

            <h3 className="font-royal text-xl font-bold text-amber-200 mb-1">
              Confirm Reward Redemption
            </h3>
            <p className="text-xs text-stone-400 mb-4">{selectedRewardForModal.title}</p>

            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 mb-4 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Current Points:</span>
                <span className="font-semibold text-amber-300">{user.accumulatedPoints} pts</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Redemption Cost:</span>
                <span className="font-bold text-rose-400">-{selectedRewardForModal.pointsRequired} pts</span>
              </div>
              <div className="pt-2 border-t border-stone-800 flex justify-between text-xs font-bold">
                <span className="text-stone-200">Remaining Balance:</span>
                <span className="text-emerald-400">
                  {user.accumulatedPoints - selectedRewardForModal.pointsRequired} pts
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 bg-amber-950/20 border border-amber-500/20 p-3 rounded-lg mb-6 leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-1">Terms of Privilege:</span>
              {selectedRewardForModal.terms}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedRewardForModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => redeemReward(selectedRewardForModal.id)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 transition cursor-pointer shadow-lg shadow-amber-950/40"
              >
                Confirm & Issue Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
