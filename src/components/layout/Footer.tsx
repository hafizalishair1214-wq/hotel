import React from 'react';
import { Crown, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="font-royal text-base font-bold text-stone-100 tracking-wider">
                ZAIQA ROYALE
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Authentic Lahori & Mughal culinary traditions, celebrating rich slow-simmered handis, Shinwari karahis, and coal-fired kebabs.
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h5 className="font-royal text-xs font-bold uppercase tracking-wider text-amber-300">
              Imperial Location
            </h5>
            <div className="flex items-start space-x-2 text-stone-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Plot 14-C, Main Boulevard, Gulberg III, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center space-x-2 text-stone-400 pt-1">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>+92 300 1234567</span>
            </div>
          </div>

          {/* Privilege Terms */}
          <div className="space-y-2">
            <h5 className="font-royal text-xs font-bold uppercase tracking-wider text-amber-300">
              Club Privileges
            </h5>
            <ul className="space-y-1 text-stone-400">
              <li>• Points never expire for active patrons</li>
              <li>• Redeemable on dine-in, takeaway & delivery</li>
              <li>• Tier status evaluated dynamically</li>
              <li>• Valid across all Zaiqa Royale banquets</li>
            </ul>
          </div>

          {/* Guarantee */}
          <div className="space-y-2">
            <h5 className="font-royal text-xs font-bold uppercase tracking-wider text-amber-300">
              Heritage Guarantee
            </h5>
            <div className="flex items-start space-x-2 text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>100% Halal Certified, Desi Ghee preparation, and master chefs trained in royal Mughal spice formulation.</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 Zaiqa Royale Lahore. All Rights Reserved.</p>
          <p>Shahi Dastarkhwan Loyalty & Rewards Architecture</p>
        </div>
      </div>
    </footer>
  );
};
