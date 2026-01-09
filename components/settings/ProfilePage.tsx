
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, PageHeader, PrimaryButton } from '../widgets/SharedWidgets';
import { UserRole } from '../../types';

interface ProfilePageProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onLogout }) => {
  const { userRole, userProfile } = useAppStore();
  const isPro = userRole === UserRole.PROFESSIONAL;

  return (
    <div className="flex flex-col gap-12 animate-era-in pb-32">
      <PageHeader
        title="Profil / System"
        description="Administrer virksomhetens parametre og juridiske rammeverk."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            {/* FIRMA INFO */}
            <AuraCard className="p-10 bg-[#0A0A0B] border-white/5">
                <h3 className="text-sm font-bold text-white mb-8 flex items-center gap-3">
                    <Icons.Briefcase size={18} className="text-indigo-400" />
                    Virksomhetsdata
                </h3>
                <div className="grid grid-cols-2 gap-8">
                    <InputField label="Firmanavn" value="Mesterfarge Oslo AS" />
                    <InputField label="Org. nummer" value="987 654 321" />
                    <InputField label="Ansvarlig leder" value={userProfile.name} />
                    <InputField label="Sertifisering" value="Mesterbedrift / Sentral Godkjenning" />
                </div>
            </AuraCard>

            {/* PÅSLAG / MARGIN */}
            <AuraCard className="p-10 bg-[#0A0A0B] border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold text-white flex items-center gap-3">
                        <Icons.Calculator size={18} className="text-indigo-400" />
                        Priskonfigurasjon
                    </h3>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Aktiv påslag</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <div>
                        <h4 className="text-base font-bold text-white">Standard fortjeneste</h4>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Beregnes automatisk på toppen av ERA Markedspris</p>
                    </div>
                    <div className="text-4xl font-black text-indigo-400 font-display">15%</div>
                </div>
            </AuraCard>

            {/* JURIDISK */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 ml-2">Juridisk rammeverk</h3>
                <LegalItem title="Partneravtale v2.2" date="Signert 12.01.2024" />
                <LegalItem title="Ansvarsforsikring" date="Gyldig til 31.12.2024" />
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <AuraCard className="p-8 bg-indigo-600/5 border-indigo-500/10">
                <Icons.Bell className="text-indigo-400 mb-6" size={24} />
                <h4 className="text-lg font-bold text-white mb-2">Systemvarsler</h4>
                <div className="space-y-3">
                    <Toggle label="Nye leads i sanntid" active />
                    <Toggle label="Ukesoppsummering" />
                    <Toggle label="Kritiske TG-varsler" active />
                </div>
            </AuraCard>

            <button
                onClick={onLogout}
                className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl text-zinc-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
            >
                Logg ut av systemet
            </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value }: any) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-1">{label}</label>
        <div className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white flex items-center font-medium">
            {value}
        </div>
    </div>
);

const Toggle = ({ label, active = false }: any) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-xs font-bold text-zinc-400">{label}</span>
        <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-zinc-800'}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
        </div>
    </div>
);

const LegalItem = ({ title, date }: any) => (
    <div className="p-6 bg-[#0A0A0B] border border-white/5 rounded-[32px] flex items-center justify-between group hover:border-white/15 transition-all">
        <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600"><Icons.FileText size={18} /></div>
            <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{date}</p>
            </div>
        </div>
        <Icons.ChevronRight className="text-zinc-800 group-hover:text-white" size={16} />
    </div>
);
