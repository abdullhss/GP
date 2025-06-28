"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CloudArrowUpIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { 
  DocumentTextIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

type Molecule = {
    id: number;
    SMILES: string;
    score: number;
    run_id: number;
};

type Run = {
    id: number;
    title: string;
    creation_date: string;
    model?: {
        name: string;
    };
};

export default function RunDetailsPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("Sample Molecules");
    const [run, setRun] = useState<Run | null>(null);
    const [molecules, setMolecules] = useState<Molecule[]>([]);
    const [selectedScorers, setSelectedScorers] = useState<string[]>([]);
    const [maxScore, setMaxScore] = useState<number>(1.0);
    const [minSteps, setMinSteps] = useState<number>(10);
    const [maxSteps, setMaxSteps] = useState<number>(100);
    const [epochs, setEpochs] = useState<number>(100);
    const [batchSize, setBatchSize] = useState<number>(128);
    const [smilesFile, setSmilesFile] = useState<File | null>(null);

    // Update molecularWeight state to include name
    const [molecularWeight, setMolecularWeight] = useState({
    name: "Molecular Weight",
    weight: 0.7,
    low: 100,
    high: 500
    });

    // Update customAlert state to include name
    const [customAlert, setCustomAlert] = useState({
    name: "Custom Alerts",
    weight: 0.5,
    file: null as File | null
    });

    // Update handleScorerChange to handle string values
    const handleScorerChange = (
    scorer: 'molecularWeight' | 'customAlert', 
    field: string, 
    value: number | string  // Now accepts strings too
    ) => {
    if (scorer === 'molecularWeight') {
        setMolecularWeight(prev => ({ ...prev, [field]: value }));
    } else {
        setCustomAlert(prev => ({ ...prev, [field]: value }));
    }
    };

    // Handle scorer selection
    const handleScorerToggle = (scorerId: string) => {
    setSelectedScorers(prev => 
        prev.includes(scorerId)
        ? prev.filter(id => id !== scorerId)
        : [...prev, scorerId]
    );
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setCustomAlert(prev => ({ ...prev, file: e.target.files![0] }));
    }
    };
    const handleSmilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Simple file type validation
        const validTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
        const extension = file.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['csv', 'txt', 'smi'];
        
        if (
        validTypes.includes(file.type) || 
        (extension && validExtensions.includes(extension))
        ) {
        setSmilesFile(file);
        } else {
        alert('Please upload a valid SMILES file (.csv, .txt, .smi)');
        }
    }
    };


    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [runRes, molsRes] = await Promise.all([
                    fetch(`/api/runs/${id}`),
                    fetch(`/api/run/molecules?run_id=${id}`),
                ]);

                const [runData, moleculesData] = await Promise.all([
                    runRes.json(),
                    molsRes.json(),
                ]);

                setRun(runData);
                setMolecules(moleculesData);
            } catch (err) {
                console.error("Error loading run details:", err);
            }
        };

        fetchData();
    }, [id]);

    const tabs = [
        "Sample Molecules",
        "Transfer Learning",
        "Staged Learning",
        "View Molecules",
    ];

    const viewMolecules = [
  { id: 1, SMILES: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", score: 0.9234 },
  { id: 2, SMILES: "C1=CC=C(C=C1)C=O", score: 0.8452 },
  { id: 3, SMILES: "CC(=O)OC1=CC=CC=C1C(=O)O", score: 0.7812 },
  { id: 4, SMILES: "C1CCCCC1", score: 0.6543 },
  { id: 5, SMILES: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", score: 0.5987 },
  { id: 6, SMILES: "CN(C)C1=CC=C(C=C1)C=O", score: 0.5123 },
  { id: 7, SMILES: "C1=CC=C2C(=C1)C=CC=C2", score: 0.4321 },
  { id: 8, SMILES: "CC(C)C1=CC(=C(C=C1)O)C(C)C", score: 0.3210 },
  { id: 9, SMILES: "C1COC2=CC=CC=C2O1", score: 0.2109 },
  { id: 10, SMILES: "C1CN2CCN1CC2", score: 0.0987 },
];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white px-8 py-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-cyan-400">
                        Run: {localStorage.getItem("title")|| "..."}
                    </h1>
                    <span className="text-sm text-white/70">
                        Created: {localStorage.getItem("date") || "..."}
                    </span>
                </div>

                <div className="flex space-x-2 mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${activeTab === tab
                                    ? "bg-cyan-500 text-black border-cyan-400"
                                    : "bg-black/20 text-white border-white/10 hover:bg-white/10"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Sample Molecules" && (
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-semibold text-cyan-300">
                                Sample Molecules
                            </h2>
                            <button className="bg-cyan-600 hover:bg-cyan-700 transition text-white px-4 py-2 rounded-md">
                                Sample
                            </button>
                        </div>
                        <table className="w-full text-sm border-separate border-spacing-y-2">
                            <thead className="text-cyan-300">
                                <tr>
                                    <th>SMILES</th>
                                    <th>Score</th>
                                    <th>Run ID</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/90">
                                {molecules.map((mol) => (
                                    <tr
                                        key={mol.id}
                                        className="bg-white/5 hover:bg-cyan-600/10 transition rounded-lg"
                                    >
                                        <td className="py-2 px-3">{mol.SMILES}</td>
                                        <td className="py-2 px-3">{mol.score}</td>
                                        <td className="py-2 px-3">{mol.run_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "Transfer Learning" && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-cyan-300 mb-6">Transfer Learning Configuration</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm text-white/80 mb-2">Epochs</label>
                        <div className="relative">
                        <input
                            type="number"
                            value={epochs}
                            onChange={(e) => setEpochs(parseInt(e.target.value))}
                            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            min="1"
                            max="1000"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-white/50">iterations</span>
                        </div>
                        </div>
                        <div className="mt-2">
                        <input
                            type="range"
                            min="1"
                            max="500"
                            value={epochs}
                            onChange={(e) => setEpochs(parseInt(e.target.value))}
                            className="w-full accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-white/60 px-1">
                            <span>1</span>
                            <span>100</span>
                            <span>200</span>
                            <span>300</span>
                            <span>400</span>
                            <span>500</span>
                        </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm text-white/80 mb-2">Batch Size</label>
                        <div className="relative">
                        <input
                            type="number"
                            value={batchSize}
                            onChange={(e) => setBatchSize(parseInt(e.target.value))}
                            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            min="1"
                            max="512"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-white/50">molecules</span>
                        </div>
                        </div>
                        <div className="mt-2">
                        <input
                            type="range"
                            min="8"
                            max="512"
                            value={batchSize}
                            onChange={(e) => setBatchSize(parseInt(e.target.value))}
                            className="w-full accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-white/60 px-1">
                            <span>8</span>
                            <span>128</span>
                            <span>256</span>
                            <span>384</span>
                            <span>512</span>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="mb-8">
                    <label className="block text-sm text-white/80 mb-2">SMILES Dataset</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                        <label className="cursor-pointer">
                            <div className={`bg-black/30 border rounded-lg p-6 text-center transition-all
                            ${smilesFile 
                                ? "border-green-500/50 bg-green-500/10" 
                                : "border-dashed border-white/20 hover:bg-white/5"}`}
                            >
                            {smilesFile ? (
                                <div className="text-green-400">
                                <DocumentTextIcon className="w-10 h-10 mx-auto" />
                                <p className="mt-3 font-medium truncate">{smilesFile.name}</p>
                                <p className="text-sm text-white/60 mt-1">
                                    {(smilesFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <p className="text-xs bg-black/30 rounded-full px-3 py-1 mt-3 inline-block">
                                    Ready for transfer learning
                                </p>
                                </div>
                            ) : (
                                <div className="text-white/70">
                                <CloudArrowUpIcon className="w-10 h-10 mx-auto" />
                                <p className="mt-3 font-medium">Upload SMILES Dataset</p>
                                <p className="text-sm mt-1">Drag & drop or click to browse</p>
                                <p className="text-xs text-white/50 mt-3">Supports .csv, .txt, .smi</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept=".csv,.txt,.smi"
                                onChange={handleSmilesUpload}
                            />
                            </div>
                        </label>
                        </div>
                        
                        <div className="sm:w-1/3 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg border border-white/10 p-4">
                        <div className="flex items-start gap-2">
                            <InformationCircleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-white/80">
                            <p className="font-medium text-white mb-1">Dataset Requirements</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>File should contain one SMILES per line</li>
                                <li>CSV files should have SMILES in first column</li>
                                <li>Maximum file size: 100MB</li>
                                <li>Recommended: 10k-1M molecules</li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span>
                        {smilesFile 
                            ? "Dataset ready for processing" 
                            : "Upload dataset to enable transfer learning"}
                        </span>
                    </div>
                    
                    <button 
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                        ${smilesFile
                            ? "bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 text-white"
                            : "bg-gray-700 text-white/50 cursor-not-allowed"}`}
                        disabled={!smilesFile}
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Start Transfer Learning
                    </button>
                    </div>
                </div>
                )}

                {activeTab === "Staged Learning" && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-cyan-300 mb-6">Staged Learning Configuration</h2>
                    
                    {/* Top-level parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-black/20 p-4 rounded-xl border border-white/10">
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Max Score</label>
                        <input
                        type="number"
                        value={maxScore}
                        onChange={(e) => setMaxScore(parseFloat(e.target.value))}
                        className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        min="0"
                        step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Min Steps</label>
                        <input
                        type="number"
                        value={minSteps}
                        onChange={(e) => setMinSteps(parseInt(e.target.value))}
                        className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Max Steps</label>
                        <input
                        type="number"
                        value={maxSteps}
                        onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                        className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        min="1"
                        />
                    </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Molecular Weight Scorer */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-white/10 p-5 relative">
                        <div className="absolute top-3 left-3">
                        <input
                            type="checkbox"
                            checked={selectedScorers.includes('molecularWeight')}
                            onChange={() => handleScorerToggle('molecularWeight')}
                            className="h-5 w-5 rounded-full bg-black/50 border border-cyan-400 checked:bg-cyan-500 focus:ring-0"
                        />
                        </div>
                        
                        <div className="ml-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                            Molecular Weight Scorer
                            </h3>
                            <span className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-xs">
                            Penalty
                            </span>
                        </div>
                        
                        {/* Name field added */}
                        <div className="mb-3">
                            <label className="block text-sm text-white/80 mb-1">Scorer Name</label>
                            <input
                            type="text"
                            value={molecularWeight.name}
                            onChange={(e) => handleScorerChange('molecularWeight', 'name', e.target.value)}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="Enter name"
                            />
                        </div>
                        
                        {selectedScorers.includes('molecularWeight') && (
                            <div className="space-y-4 mt-2">
                            <div>
                                <label className="block text-sm text-white/80 mb-1">Weight Importance</label>
                                <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={molecularWeight.weight}
                                    onChange={(e) => handleScorerChange('molecularWeight', 'weight', parseFloat(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                                <span className="absolute right-0 top-0 bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                                    {molecularWeight.weight.toFixed(2)}
                                </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                <label className="block text-sm text-white/80 mb-1">Min Weight</label>
                                <input
                                    type="number"
                                    value={molecularWeight.low}
                                    onChange={(e) => handleScorerChange('molecularWeight', 'low', parseInt(e.target.value))}
                                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                                </div>
                                
                                <div>
                                <label className="block text-sm text-white/80 mb-1">Max Weight</label>
                                <input
                                    type="number"
                                    value={molecularWeight.high}
                                    onChange={(e) => handleScorerChange('molecularWeight', 'high', parseInt(e.target.value))}
                                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                                </div>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Custom Alert Scorer */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-white/10 p-5 relative">
                        <div className="absolute top-3 left-3">
                        <input
                            type="checkbox"
                            checked={selectedScorers.includes('customAlert')}
                            onChange={() => handleScorerToggle('customAlert')}
                            className="h-5 w-5 rounded-full bg-black/50 border border-cyan-400 checked:bg-cyan-500 focus:ring-0"
                        />
                        </div>
                        
                        <div className="ml-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                            Custom Alert Scorer
                            </h3>
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                            Custom
                            </span>
                        </div>
                        
                        {/* Name field added */}
                        <div className="mb-3">
                            <label className="block text-sm text-white/80 mb-1">Scorer Name</label>
                            <input
                            type="text"
                            value={customAlert.name}
                            onChange={(e) => handleScorerChange('customAlert', 'name', e.target.value)}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Enter name"
                            />
                        </div>
                        
                        {selectedScorers.includes('customAlert') && (
                            <div className="space-y-4 mt-2">
                            <div>
                                <label className="block text-sm text-white/80 mb-1">Weight Importance</label>
                                <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={customAlert.weight}
                                    onChange={(e) => handleScorerChange('customAlert', 'weight', parseFloat(e.target.value))}
                                    className="w-full accent-purple-500"
                                />
                                <span className="absolute right-0 top-0 bg-purple-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                                    {customAlert.weight.toFixed(2)}
                                </span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-white/80 mb-1">Alert File</label>
                                <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <div className="bg-black/30 border border-dashed border-white/20 rounded-lg py-8 text-center hover:bg-white/5 transition-colors">
                                    {customAlert.file ? (
                                        <div className="text-green-400">
                                        <DocumentIcon className="w-8 h-8 mx-auto" />
                                        <p className="mt-2 truncate px-4">{customAlert.file.name}</p>
                                        <p className="text-xs text-white/60 mt-1">
                                            {(customAlert.file.size / 1024).toFixed(1)} KB
                                        </p>
                                        </div>
                                    ) : (
                                        <div className="text-white/60">
                                        <CloudArrowUpIcon className="w-8 h-8 mx-auto" />
                                        <p className="mt-2">Click to upload</p>
                                        <p className="text-xs mt-1">.CSV or .TXT files</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".csv,.txt"
                                        onChange={handleFileUpload}
                                    />
                                    </div>
                                </label>
                                </div>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>

                    <div className="flex justify-end mt-8">
                    <button 
                        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                        disabled={selectedScorers.length === 0}
                    >
                        Start Staged Learning
                    </button>
                    </div>
                </div>
                )}
                {activeTab === "View Molecules" && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-cyan-300">Molecules Explorer</h2>
                    <div className="flex gap-3">
                        <div className="relative">
                        <input
                            type="text"
                            placeholder="Search molecules..."
                            className="bg-black/30 border border-white/20 rounded-full px-4 py-2 text-white pl-10 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64"
                        />
                        <svg 
                            className="w-5 h-5 text-white/50 absolute left-3 top-2.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        </div>
                        <button className="bg-cyan-600 hover:bg-cyan-700 transition text-white px-4 py-2 rounded-md flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                        </button>
                    </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
                        <tr>
                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">ID</th>
                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">SMILES</th>
                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Score</th>
                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Visualize</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                        {viewMolecules.map((mol) => (
                            <tr 
                            key={mol.id} 
                            className="hover:bg-white/5 transition-colors group"
                            >
                            <td className="py-3 px-4 font-mono text-cyan-400/90">{mol.id}</td>
                            <td className="py-3 px-4">
                                <div className="flex items-center justify-between">
                                <span className="font-mono">{mol.SMILES}</span>
                                <button 
                                    className="text-xs text-white/50 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => navigator.clipboard.writeText(mol.SMILES)}
                                >
                                    Copy
                                </button>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-700 rounded-full h-2">
                                    <div 
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                                    style={{ width: `${mol.score * 100}%` }}
                                    ></div>
                                </div>
                                <span className={mol.score > 0.7 ? "text-green-400" : mol.score > 0.4 ? "text-yellow-400" : "text-red-400"}>
                                    {mol.score.toFixed(4)}
                                </span>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <button className="text-sm bg-white/10 hover:bg-cyan-600 transition-colors px-3 py-1 rounded-md">
                                View 3D
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/20">
                        <div className="text-sm text-white/70">
                        Showing 10 of 127 molecules
                        </div>
                        <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-md bg-black/30 border border-white/10 hover:bg-white/10">
                            Previous
                        </button>
                        <button className="px-3 py-1 rounded-md bg-cyan-600 text-white">
                            1
                        </button>
                        <button className="px-3 py-1 rounded-md bg-black/30 border border-white/10 hover:bg-white/10">
                            2
                        </button>
                        <button className="px-3 py-1 rounded-md bg-black/30 border border-white/10 hover:bg-white/10">
                            3
                        </button>
                        <button className="px-3 py-1 rounded-md bg-black/30 border border-white/10 hover:bg-white/10">
                            Next
                        </button>
                        </div>
                    </div>
                    </div>
                    
                    <div className="mt-8 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-white/10 p-5">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">Distribution of Scores</h3>
                    <div className="h-40 w-full flex items-end gap-1">
                        {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/50 transition-colors relative group"
                            style={{ height: `${Math.random() * 80 + 10}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {((i + 1) * 0.05).toFixed(2)}: {Math.floor(Math.random() * 20) + 5}
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/60 px-2">
                        <span>0.0</span>
                        <span>0.5</span>
                        <span>1.0</span>
                    </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
