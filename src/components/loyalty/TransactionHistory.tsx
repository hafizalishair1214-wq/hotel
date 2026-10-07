import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { History, ArrowDownRight, ArrowUpRight, Gift, FileText, Download, Filter } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const {
    transactions,
    transactionFilter,
    setTransactionFilter,
    user
  } = useLoyalty();

  const [dateSearch, setDateSearch] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchFilter = transactionFilter === 'all' || tx.type === transactionFilter;
    const matchSearch =
      tx.description.toLowerCase().includes(dateSearch.toLowerCase()) ||
      tx.date.includes(dateSearch) ||
      (tx.orderRef && tx.orderRef.toLowerCase().includes(dateSearch.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const counts = {
    all: transactions.length,
    earned: transactions.filter((t) => t.type === 'earned').length,
    redeemed: transactions.filter((t) => t.type === 'redeemed').length,
    bonus: transactions.filter((t) => t.type === 'bonus').length
  };

  const handleExportStatement = () => {
    const headers = 'ID,Date,Description,Type,Points Change,Balance After,Reference\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.date}","${t.description.replace(/"/g, '""')}","${t.type}","${t.pointsChange}","${t.balanceAfter}","${t.orderRef || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zaiqa_royale_points_statement_${user.memberId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-royal text-lg font-bold text-stone-100">
              Royal Points Ledger & Audit Trail
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Official chronological record of earned privileges, feast points, and voucher redemptions.
          </p>
        </div>

        <button
          onClick={handleExportStatement}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700/60 text-xs font-semibold text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        {/* Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `All Events (${counts.all})` },
            { id: 'earned', label: `Earned (+${counts.earned})` },
            { id: 'redeemed', label: `Redeemed (-${counts.redeemed})` },
            { id: 'bonus', label: `Bonuses (${counts.bonus})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTransactionFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                transactionFilter === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <input
          type="text"
          placeholder="Filter by description / ref..."
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
          className="bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none w-full sm:w-56"
        />
      </div>

      {/* Transactions Table / Cards */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-stone-950/40 rounded-xl border border-stone-800/50">
          <FileText className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h4 className="font-royal text-sm font-semibold text-stone-300">No Ledger Records Found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            No loyalty point events match your selected criteria. Try adjusting the filter or savor a new feast to earn points.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Activity & Details</th>
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3 text-right">Points Delta</th>
                <th className="py-3 px-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredTransactions.map((tx) => {
                const isEarned = tx.type === 'earned';
                const isRedeemed = tx.type === 'redeemed';
                const isBonus = tx.type === 'bonus';

                return (
                  <tr key={tx.id} className="hover:bg-stone-800/20 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-stone-400 text-[11px]">
                      {tx.date}
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isEarned
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : isRedeemed
                              ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isEarned && <ArrowUpRight className="w-4 h-4" />}
                          {isRedeemed && <ArrowDownRight className="w-4 h-4" />}
                          {isBonus && <Gift className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-medium text-stone-200 block text-xs">
                            {tx.description}
                          </span>
                          {tx.billTotalPKR && (
                            <span className="text-[10px] text-stone-500 block">
                              Bill Amount: PKR {tx.billTotalPKR.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Order Reference */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {tx.orderRef ? (
                        <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-[10px] font-mono text-amber-400/90">
                          {tx.orderRef}
                        </span>
                      ) : (
                        <span className="text-stone-600 font-mono text-[10px]">—</span>
                      )}
                    </td>

                    {/* Points Change */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span
                        className={`font-bold font-royal text-sm ${
                          isEarned || isBonus ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.pointsChange > 0 ? `+${tx.pointsChange}` : tx.pointsChange} Pts
                      </span>
                    </td>

                    {/* Balance After */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono text-stone-300 font-medium">
                      {tx.balanceAfter.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
