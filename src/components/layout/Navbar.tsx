import React from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Crown, Sparkles, Bell, Ticket, Gift, Award } from 'lucide-react';
import { SparklePointsDisplay } from '../loyalty/SparklePointsDisplay';

export const Navbar: React.FC = () => {
  const { user, claimedRewards, activeTab, setActiveTab } = useLoyalty();

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-royal text-base sm:text-lg font-bold tracking-widest text-amber-100">
                  ZAIQA ROYALE
                </span>
                <span className="text-[10px] font-mono text-amber-400/80 px-1 rounded bg-amber-500/10 border border-amber-500/20">
                  LAHORE
                </span>
              </div>
              <p className="text-[10px] text-stone-400 tracking-wider font-light uppercase">
                A Royal Taste of Lahore
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: Crown },
              { id: 'rewards', label: 'Privileges & Rewards', icon: Gift },
              { id: 'vouchers', label: 'My Vouchers', icon: Ticket, badge: claimedRewards.length },
              { id: 'calculator', label: 'Simulator', icon: Sparkles }
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;

              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{nav.label}</span>
                  {nav.badge !== undefined && nav.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-stone-950 font-bold">
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Active Points Chip & Patron Badge */}
          <div className="flex items-center space-x-3">
            {/* Points Chip */}
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-950/60 to-stone-900 border border-amber-500/40 hover:border-amber-400 rounded-full px-3 py-1 shadow-md transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex items-baseline space-x-1">
                <SparklePointsDisplay
                  points={user.accumulatedPoints}
                  size="sm"
                />
                <span className="text-[10px] text-amber-300 font-semibold uppercase">Pts</span>
              </div>
            </button>

            {/* Patron Profile */}
            <div className="flex items-center space-x-2 pl-2 border-l border-stone-800">
              <div className="w-8 h-8 rounded-full border border-amber-500/50 overflow-hidden bg-stone-900 shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-amber-400">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-stone-200 block leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium">
                  {user.membershipTier}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
