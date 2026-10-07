import React from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Crown, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TIERS_INFO } from '../../data/loyaltyData';

export const TierProgress: React.FC = () => {
  const { user, tierInfo, nextTier, pointsToNextTier, progressPercent } = useLoyalty();

  const tiersList = Object.values(TIERS_INFO);

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-royal text-lg font-bold text-stone-100">
              Imperial Nobility Progression
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Lifetime Points: <span className="font-semibold text-amber-300">{user.lifetimePoints.toLocaleString()}</span> • Ascend tiers by savoring authentic Lahori feasts.
          </p>
        </div>

        {nextTier ? (
          <div className="flex items-center space-x-2 bg-amber-950/40 border border-amber-500/30 rounded-xl px-3.5 py-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <div className="text-right">
              <span className="text-[11px] text-stone-400 block">Next Ascendance:</span>
              <span className="text-xs font-bold text-amber-300">{pointsToNextTier} pts to {nextTier.tier}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-yellow-950/50 border border-yellow-500/40 rounded-xl px-3.5 py-2">
            <Crown className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-bold text-yellow-300">Supreme Imperial Rank</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-stone-300 font-medium">
            Current: <strong className="text-amber-300">{user.membershipTier}</strong> ({tierInfo.multiplierText} Earning Multiplier)
          </span>
          {nextTier && (
            <span className="text-stone-400">
              Target: <strong className="text-stone-200">{nextTier.tier}</strong> ({progressPercent}% achieved)
            </span>
          )}
        </div>

        <div className="w-full bg-stone-950 rounded-full h-3.5 border border-stone-800 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 transition-all duration-1000 shadow-md relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiersList.map((t) => {
          const isCurrent = user.membershipTier === t.tier;
          const isUnlocked = user.lifetimePoints >= t.minPoints;

          return (
            <div
              key={t.tier}
              className={`rounded-xl p-4 sm:p-5 border transition-all duration-200 ${
                isCurrent
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/30'
                  : isUnlocked
                  ? 'bg-stone-950/40 border-stone-700/60 opacity-80'
                  : 'bg-stone-950/20 border-stone-800/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-royal text-sm font-bold text-stone-200">{t.tier}</span>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Active
                  </span>
                )}
                {!isCurrent && isUnlocked && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                    Achieved
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-1.5 mb-2">
                <span className="text-xl font-bold font-royal text-amber-400">{t.multiplierText}</span>
                <span className="text-xs text-stone-400">Points Multiplier</span>
              </div>

              <p className="text-[11px] text-stone-400 mb-3 font-mono">
                {t.minPoints === 0 ? '0 – 500 pts' : t.maxPoints > 10000 ? '1,500+ lifetime pts' : `${t.minPoints} – ${t.maxPoints} pts`}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                {t.perks.slice(0, 3).map((perk, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-stone-300 text-[11px]">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCurrent ? 'text-amber-400' : 'text-stone-500'}`} />
                    <span className="line-clamp-2">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
