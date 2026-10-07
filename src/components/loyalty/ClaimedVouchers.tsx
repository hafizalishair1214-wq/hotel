import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Ticket, Copy, Check, Clock, Sparkles } from 'lucide-react';

export const ClaimedVouchers: React.FC = () => {
  const { claimedRewards, setActiveTab } = useLoyalty();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (claimedRewards.length === 0) {
    return (
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <Ticket className="w-6 h-6 text-amber-400" />
        </div>
        <h4 className="font-royal text-base font-bold text-stone-200">No Vouchers Redeemed Yet</h4>
        <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto mb-5">
          You haven't claimed any reward vouchers yet. Browse the Royal Privileges catalog to unlock complimentary dishes, dining credits, and VIP feasts!
        </p>
        <button
          onClick={() => setActiveTab('rewards')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition inline-flex items-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Browse Available Rewards</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-royal text-lg font-bold text-stone-100">
            Active Dining Vouchers & Passes ({claimedRewards.length})
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Present code to your server or paste into checkout notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {claimedRewards.map((voucher) => {
          const isCopied = copiedId === voucher.id;

          return (
            <div
              key={voucher.id}
              className="relative overflow-hidden bg-stone-950 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block mb-1">
                    Valid Privilege
                  </span>
                  <h4 className="font-royal text-sm font-bold text-stone-100">{voucher.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">-{voucher.pointsSpent} Pts</span>
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="my-3 p-2.5 rounded-lg bg-stone-900 border border-stone-700/60 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                  {voucher.promoCode}
                </span>
                <button
                  onClick={() => handleCopyCode(voucher.id, voucher.promoCode)}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-stone-800 text-[10px] text-stone-300 hover:text-white transition cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-800/80">
                <span>Claimed: {voucher.claimedDate}</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>Expires: {voucher.expiresAt}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
