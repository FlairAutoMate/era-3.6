
import React, { useState, useRef } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { analyzeSnapshot } from '../../services/geminiService';
import { SlideOver, FileUpload, LoadingState } from '../widgets/SharedWidgets';
import { FDVEvent } from '../../types';

interface SnapshotModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ isOpen, onClose }) => {
    const { addDocument } = useAppStore();
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [successData, setSuccessData] = useState<any | null>(null);

    // Mock speech recognition
    const handleToggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true);
            setTranscript('');
            // Simulation of voice input
            setTimeout(() => {
                setTranscript("Byttet pakning på kjøkkenkrana, kostet 49 kroner på Obs Bygg");
                setIsRecording(false);
            }, 3000);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        const result = await analyzeSnapshot(transcript, image || undefined);
        setIsAnalyzing(false);
        if (result) {
            setSuccessData(result);
        }
    };

    const handleConfirm = () => {
        if (successData) {
            const newDoc: FDVEvent = {
                id: `snapshot-${Date.now()}`,
                title: successData.title || "Uten tittel",
                description: successData.description || transcript,
                cost: successData.cost || 0,
                category: (successData.category?.toLowerCase() || 'maintenance') as any,
                date: successData.date || new Date().toLocaleDateString('no-NO'),
                fileUrl: image ? URL.createObjectURL(image) : undefined
            };
            addDocument(newDoc);
            onClose();
            // Reset
            setSuccessData(null);
            setTranscript('');
            setImage(null);
        }
    };

    return (
        <SlideOver isOpen={isOpen} onClose={onClose} title="Snapshot Logg">
            <div className="pb-24 space-y-8">
                {isAnalyzing ? (
                   <LoadingState text="Analyserer stemme og bilde..." />
                ) : successData ? (
                   <div className="animate-era-in space-y-6">
                      <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto mb-4">
                         <Icons.Check size={32} />
                      </div>
                      <div className="text-center">
                         <h3 className="text-2xl font-bold text-white mb-2">{successData.title}</h3>
                         <p className="text-zinc-500 text-sm">{successData.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black uppercase text-zinc-700 block mb-1">Kategori</span>
                            <span className="text-sm font-bold text-white capitalize">{successData.category}</span>
                         </div>
                         <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black uppercase text-zinc-700 block mb-1">Kostnad</span>
                            <span className="text-sm font-bold text-white">{successData.cost},-</span>
                         </div>
                      </div>
                      <button
                         onClick={handleConfirm}
                         className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all"
                      >
                         Arkiver i FDV
                      </button>
                   </div>
                ) : (
                   <>
                    <p className="text-zinc-500 text-sm text-center leading-relaxed">
                       Hold knappen og si hva du har gjort, <br />eller ta et bilde av kvitteringen/arbeidet.
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        <button
                            onMouseDown={handleToggleRecording}
                            className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative ${isRecording ? 'bg-red-500 border-red-500/20 scale-110 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-white'}`}
                        >
                            {isRecording && <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />}
                            <Icons.Mic size={48} className={isRecording ? 'text-white' : 'text-zinc-500'} />
                        </button>
                        {transcript && (
                           <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl italic text-sm text-zinc-300 w-full animate-era-in">
                              "{transcript}"
                           </div>
                        )}
                    </div>

                    <div className="space-y-4">
                       <FileUpload label="Valgfritt bilde/kvittering" onFileSelect={setImage} />
                       {image && <p className="text-[10px] text-emerald-500 text-center font-bold">✓ Bilde lagt til</p>}
                    </div>

                    <button
                       disabled={!transcript && !image}
                       onClick={handleAnalyze}
                       className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3"
                    >
                       <Icons.Sparkles size={20} /> Analyser Snapshot
                    </button>
                   </>
                )}
            </div>
        </SlideOver>
    );
};
