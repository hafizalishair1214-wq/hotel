import React from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { MembershipCard } from './MembershipCard';
import { TierProgress } from './TierProgress';
import { AvailableRewards } from './AvailableRewards';
import { TransactionHistory } from './TransactionHistory';
import { PointsCalculator } from './PointsCalculator';
import { ClaimedVouchers } from './ClaimedVouchers';
import { SparklePointsDisplay } from './SparklePointsDisplay';
import {
  Crown,
  Sparkles,
  Gift,
  History,
  Calculator,
  Ticket,
  Users,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LoyaltyDashboard: React.FC = () => {
  const {
    user,
    allUsers,
    switchUser,
    activeTab,
    setActiveTab,
    rewards,
    claimedRewards,
    transactions
  } = useLoyalty();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Demo Persona Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-royal text-lg sm:text-xl font-bold text-stone-100">
                Shahi Dastarkhwan Privilege Club
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Official Patron Portal
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Welcome back, <strong className="text-stone-200">{user.name}</strong>. Enjoy tier privileges, dine-in perks, and reward redemptions.
            </p>
          </div>
        </div>

        {/* Persona Switcher for Quick Verification */}
        <div className="flex items-center space-x-2 self-start lg:self-auto bg-stone-950 border border-stone-800 rounded-xl p-1.5">
          <div className="flex items-center space-x-1.5 px-2 text-stone-400 text-xs">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium hidden sm:inline">Active Patron:</span>
          </div>
          <select
            value={user.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-stone-900 border border-stone-700/60 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.membershipTier} • {u.accumulatedPoints} pts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Card & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Membership Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <MembershipCard />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3 text-center flex flex-col items-center justify-between">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Available</span>
              <div className="my-0.5">
                <SparklePointsDisplay
                  points={user.accumulatedPoints}
                  size="md"
                />
              </div>
              <span className="text-[9px] text-stone-500 block">Royal Pts</span>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Vouchers</span>
              <span className="text-lg font-bold font-royal text-emerald-400">{claimedRewards.length}</span>
              <span className="text-[9px] text-stone-500 block">Active Passes</span>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Banquets</span>
              <span className="text-lg font-bold font-royal text-stone-200">{user.diningVisits}</span>
              <span className="text-[9px] text-stone-500 block">Feasts Enjoyed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Nobility Progression (7 cols) */}
        <div className="lg:col-span-7">
          <TierProgress />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-stone-800">
        <nav className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Rewards', icon: Gift, count: rewards.length },
            { id: 'rewards', label: 'Rewards Catalog', icon: Sparkles, count: rewards.length },
            { id: 'vouchers', label: 'My Claimed Vouchers', icon: Ticket, count: claimedRewards.length },
            { id: 'transactions', label: 'Points Ledger', icon: History, count: transactions.length },
            { id: 'calculator', label: 'Earning Calculator', icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h2 className="font-royal text-lg font-bold text-stone-100">
                    Handpicked Privileges For You
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Privileges</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <AvailableRewards />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-amber-400" />
                  <h2 className="font-royal text-lg font-bold text-stone-100">
                    Recent Treasury Ledger
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>View Full Statement</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <TransactionHistory />
            </section>
          </div>
        )}

        {activeTab === 'rewards' && <AvailableRewards />}

        {activeTab === 'vouchers' && <ClaimedVouchers />}

        {activeTab === 'transactions' && <TransactionHistory />}

        {activeTab === 'calculator' && <PointsCalculator />}
      </div>
    </div>
  );
};
