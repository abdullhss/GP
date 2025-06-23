"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
type Prior = {
    id: number;
    name: string;
    description?: string;
};

type ScorerType = {
    id: number;
    title: string;
};

type Run = {
    id: number;
    title: string;
    creation_date: string;
    model?: {
        name: string;
    };
};

type Molecule = {
    id: number;
    SMILES: string;
    score: number;
    run_id: number;
};

export default function MainPage() {

    const [activeTab, setActiveTab] = useState("Sample Molecules");
    const [priors, setPriors] = useState<Prior[]>([]);
    const [scorerTypes, setScorerTypes] = useState<ScorerType[]>([]);
    const [runs, setRuns] = useState<Run[]>([]);
    const [sampleMolecules, setSampleMolecules] = useState<Molecule[]>([]);


    const tabs = [
        "Sample Molecules",
        "Transfer Learning",
        "Staged Learning",
        "View Molecules",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [priorsRes, scorersRes, runsRes, moleculesRes] = await Promise.all([
                    fetch("/api/priors"),
                    fetch("/api/scorers/types"),
                    fetch("/api/runs"),
                    fetch("/api/run/molecules?run_id=1")
                ]);

                const [priorsData, scorersData, runsData, moleculesData] = await Promise.all([
                    priorsRes.json(),
                    scorersRes.json(),
                    runsRes.json(),
                    moleculesRes.json()
                ]);

                setPriors(priorsData);
                setScorerTypes(scorersData);
                setRuns(runsData);
                setSampleMolecules(moleculesData);
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white px-8 py-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-center text-cyan-400 drop-shadow-md">
                    Model Run Management
                </h1>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-cyan-400/30 shadow-lg">
                        <label className="block mb-2 text-sm font-medium text-cyan-300">
                            Select Prior
                        </label>
                        <select className="w-full bg-black/20 border border-cyan-300 rounded-md px-3 py-2 text-white">
                            <option>Select Prior</option>
                            {priors.map((prior) => (
                                <option key={prior.id} value={prior.id}>{prior.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-purple-400/30 shadow-lg space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-purple-300">
                                Scorer (optional)
                            </label>
                            <select className="w-full bg-black/20 border border-purple-300 rounded-md px-3 py-2 text-white">
                                <option>Select Scorer Type</option>
                                {scorerTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.title}</option>
                                ))}
                            </select>
                        </div>
                        <input className="w-full bg-black/20 border border-purple-300 rounded-md px-3 py-2 text-white" placeholder="Parameter 1" />
                        <button className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md">
                            Create Scorer
                        </button>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-pink-400/30 shadow-lg space-y-4">
                        <input className="w-full bg-black/20 border border-pink-300 rounded-md px-3 py-2 text-white" placeholder="Run Title" />
                        <input className="w-full bg-black/20 border border-pink-300 rounded-md px-3 py-2 text-white" placeholder="Model Name" />
                        <button className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-2 rounded-md">
                            Create Run
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/10">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-4">Runs List</h2>
                    <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                        <thead className="text-cyan-400">
                            <tr>
                                <th>Run Title</th>
                                <th>Model Name</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-white/90">
                            {runs.map((run) => (
                                <tr key={run.id} className="bg-white/5 hover:bg-cyan-600/10 transition rounded-lg">
                                    <td className="py-2 px-3">{run.title}</td>
                                    <td className="py-2 px-3">{run.model?.name}</td>
                                    <td className="py-2 px-3">{new Date(run.creation_date).toLocaleDateString()}</td>
                                    <td className="py-2 px-3">
                                        <button className="text-cyan-400 hover:underline">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <div className="flex space-x-2 mb-6">
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
                        <div>
                            <button className="mb-4 bg-cyan-600 hover:bg-cyan-700 transition text-white px-4 py-2 rounded-md">
                                Sample
                            </button>
                            <table className="w-full text-sm border-separate border-spacing-y-2">
                                <thead className="text-cyan-300">
                                    <tr>
                                        <th>SMILES</th>
                                        <th>Score</th>
                                        <th>Run ID</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/90">
                                    {sampleMolecules.map((mol) => (
                                        <tr key={mol.id} className="bg-white/5 hover:bg-cyan-600/10 transition rounded-lg">
                                            <td className="py-2 px-3">{mol.SMILES}</td>
                                            <td className="py-2 px-3">{mol.score}</td>
                                            <td className="py-2 px-3">{mol.run_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
