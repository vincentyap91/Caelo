import React from 'react';
import wineGlass from '../assets/wine-glass.png';
import penguin from '../assets/penguin.png';

export default function Promos() {
    return (
        <section className="w-full flex flex-col md:flex-row gap-6 mt-6">
            {/* Banner 1: Special Welcome Bonus */}
            <div className="flex-1 bg-gradient-to-t from-[#8ccbf0] to-[#c5eefd] rounded-2xl h-[120px] relative border-2 border-white shadow-sm group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80')] bg-cover opacity-10 mix-blend-multiply"></div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1">
      
                    <h3 className="text-[#0072BC] font-bold tracking-tight text-lg leading-tight w-[280px]">
                        Special Welcome Bonus<br />For New Member
                    </h3>
                </div>
                <div className="absolute right-[6px] bottom-0 h-[150px] md:h-[150px] z-20 pointer-events-none group-hover:scale-[1.02] transition-transform origin-bottom">
                    <img
                        src={wineGlass}
                        alt="Welcome bonus woman"
                        className="h-full w-auto max-w-none object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.22)]"
                    />
                </div>
            </div>

            {/* Banner 2: Referral Bonus */}
            <div className="flex-1 bg-gradient-to-t from-[#8ccbf0] to-[#c5eefd] rounded-2xl h-[120px] relative border-2 border-white shadow-sm group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518081461904-9d8f136351c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80')] bg-cover opacity-10 mix-blend-multiply"></div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1">
  
                    <h3 className="text-[#0072BC] font-bold tracking-tight text-lg leading-tight w-[280px]">
                        Earn Referral Bonus
                    </h3>
                </div>
                <div className="absolute right-[-20px] bottom-0 w-[150px] h-[140px] bg-[#00AEEF]/20 blur-xl rounded-full"></div>
                <div className="absolute right-4 bottom-0 h-[150px] md:h-[150px] text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform origin-bottom">
                <img
                        src={penguin}
                        alt="Earn referral bonus"
                        className="h-full w-auto max-w-none object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.22)]"
                    />
                </div>
            </div>
        </section>
    );
}
