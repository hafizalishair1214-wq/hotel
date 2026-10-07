import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Crown, Sparkles, Copy, Check, ShieldCheck, QrCode } from 'lucide-react';
import { SparklePointsDisplay } from './SparklePointsDisplay';

export const MembershipCard: React.FC = () => {
  const { user, tierInfo } = useLoyalty();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group perspective-1000">
      {/* Decorative Outer Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/30 via-yellow-400/20 to-amber-700/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

      {/* Main Card Canvas */}
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br ${tierInfo.cardGradient} p-6 sm:p-8 text-stone-100 shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
        {/* Mughal Geometric Motif Watermark */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 border-8 border-amber-500/10 rounded-full pointer-events-none transform rotate-45"></div>
        <div className="absolute -right-4 -bottom-4 w-48 h-48 border border-amber-400/15 rounded-full pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-amber-400/10 to-transparent pointer-events-none"></div>

        {/* Top Card Row */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] uppercase tracking-widest text-amber-300/90 font-semibold">Shahi Dastarkhwan</span>
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              </div>
              <h3 className="font-royal text-base sm:text-lg font-bold text-amber-100 tracking-wider">
                ZAIQA ROYALE
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${tierInfo.badgeColor} shadow-inner`}>
              {user.membershipTier}
            </span>
            <span className="text-[10px] text-stone-400 mt-1">Multiplier: {tierInfo.multiplierText}</span>
          </div>
        </div>

        {/* Chip & Micro-pattern simulation */}
        <div className="relative z-10 my-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border border-yellow-100/50 shadow-md flex flex-col justify-around p-1.5">
              <div className="w-full h-[1px] bg-amber-900/60"></div>
              <div className="w-2/3 h-[1px] bg-amber-900/60"></div>
              <div className="w-full h-[1px] bg-amber-900/60"></div>
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono tracking-tighter">NFC PRIVILEGE</span>
          </div>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-900/80 border border-amber-500/30 text-xs text-amber-300 hover:bg-stone-800 transition cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="text-[11px]">{showQr ? 'Hide Code' : 'Scan Card'}</span>
          </button>
        </div>

        {/* QR Code Pop-in */}
        {showQr && (
          <div className="relative z-10 mb-4 p-4 rounded-xl bg-stone-950/90 border border-amber-500/40 text-center animate-fade-in flex flex-col items-center">
            <div className="p-2 bg-white rounded-lg shadow-md mb-2">
              <div className="w-28 h-28 bg-stone-900 flex items-center justify-center p-1 rounded">
                {/* SVG mock QR */}
                <svg className="w-full h-full text-stone-900 fill-white" viewBox="0 0 100 100">
                  <path d="M0 0h30v30H0zm5 5v20h20V5zm45-5h30v30H50zm5 5v20h20V5zM0 50h30v30H0zm5 5v20h20V55zm40 5h10v10H45zm15-5h10v10H60zm15 15h15v15H75zm-15 0h10v10H60zm-20 0h10v10H40zm35-35h15v15H75zm15 35h10v10H90zm-50 5h10v10H40z"/>
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-amber-200 font-mono tracking-wider">{user.memberId}</p>
            <p className="text-[10px] text-stone-400">Present to captain during dine-in for table credit</p>
          </div>
        )}

        {/* Member ID & Name */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="uppercase tracking-widest text-[10px]">Patron Pass</span>
            <button
              onClick={handleCopyId}
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-200 transition cursor-pointer"
              title="Copy Member ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-mono">{copied ? 'Copied' : user.memberId}</span>
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-royal tracking-wide text-white drop-shadow-sm">
            {user.name}
          </h2>
        </div>

        {/* Points & Stats Footer */}
        <div className="relative z-10 pt-4 border-t border-amber-500/20 flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-400/90 font-medium block mb-1">Accumulated Treasury</span>
            <div className="flex items-baseline space-x-2">
              <SparklePointsDisplay
                points={user.accumulatedPoints}
                size="lg"
                showLabel={true}
              />
            </div>
            <span className="text-[10px] text-stone-400 block mt-1">
              ≈ PKR {(user.accumulatedPoints).toLocaleString()} dining credit
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 text-emerald-400 text-xs mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wide">VERIFIED PATRON</span>
            </div>
            <span className="text-[10px] text-stone-400">Member Since {user.memberSince}</span>
            <div className="text-[10px] text-stone-300 font-medium">{user.diningVisits} Imperial Banquets</div>
          </div>
        </div>
      </div>
    </div>
  );
};
