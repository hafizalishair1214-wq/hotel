import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Calculator, Sparkles, TrendingUp, PlusCircle, ShoppingBag } from 'lucide-react';

export const PointsCalculator: React.FC = () => {
  const { user, tierInfo, earnPointsFromBill } = useLoyalty();
  const [billAmount, setBillAmount] = useState<number>(4500);

  const basePoints = Math.floor(billAmount / 100);
  const totalEarned = Math.round(basePoints * tierInfo.multiplierRate);
  const bonusMultiplierPoints = totalEarned - basePoints;
  const rupeeDiningValue = totalEarned; // 1 point = 1 PKR redemption value

  const handleSimulateOrder = () => {
    earnPointsFromBill(
      billAmount,
      `Simulated Dine-in Feast (Mutton Karahi & BBQ Platter)`
    );
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      <div className="flex items-center space-x-2">
        <Calculator className="w-5 h-5 text-amber-400" />
        <h3 className="font-royal text-lg font-bold text-stone-100">
          Royal Earning Simulator & Forecast
        </h3>
      </div>
      <p className="text-xs text-stone-400">
        Calculate your points yield based on your planned dining bill and current{' '}
        <strong className="text-amber-300">{user.membershipTier}</strong> multiplier ({tierInfo.multiplierText}).
      </p>

      {/* Bill Amount Input & Slider */}
      <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
            Estimated Feast Bill (PKR)
          </label>
          <div className="flex items-center space-x-1 bg-stone-900 border border-stone-700/60 px-3 py-1 rounded-lg">
            <span className="text-xs text-stone-400">PKR</span>
            <input
              type="number"
              step="500"
              min="500"
              max="50000"
              value={billAmount}
              onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
              className="w-24 text-right font-mono text-sm font-bold text-amber-300 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <input
          type="range"
          min="1000"
          max="25000"
          step="500"
          value={billAmount}
          onChange={(e) => setBillAmount(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-stone-500 font-mono">
          <span>PKR 1,000 (Casual Lunch)</span>
          <span>PKR 10,000 (Family Feast)</span>
          <span>PKR 25,000+ (Grand Banquet)</span>
        </div>
      </div>

      {/* Projected Earnings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-950/40 border border-stone-800 rounded-xl p-4 text-center">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Base Return (1%)</span>
          <span className="text-xl font-bold font-royal text-stone-200">{basePoints}</span>
          <span className="text-[10px] text-stone-500 block mt-0.5">1 pt per PKR 100</span>
        </div>

        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-center">
          <span className="text-[10px] uppercase tracking-wider text-amber-300 block mb-1">
            Tier Privilege ({tierInfo.multiplierText})
          </span>
          <span className="text-xl font-bold font-royal text-amber-400">+{bonusMultiplierPoints}</span>
          <span className="text-[10px] text-amber-400/80 block mt-0.5">Bonus multiplier</span>
        </div>

        <div className="bg-stone-950/40 border border-emerald-500/30 rounded-xl p-4 text-center">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 block mb-1">
            Total Points Yield
          </span>
          <span className="text-2xl font-extrabold font-royal text-emerald-300">+{totalEarned}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">≈ PKR {rupeeDiningValue} voucher power</span>
        </div>
      </div>

      {/* Instant Test CTA */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-200">Interactive State Simulation</h4>
            <p className="text-[11px] text-stone-400">
              Credit +{totalEarned} points to {user.name} now to observe live tier ascent and balance updates.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateOrder}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center justify-center space-x-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Credit +{totalEarned} Points</span>
        </button>
      </div>
    </div>
  );
};
