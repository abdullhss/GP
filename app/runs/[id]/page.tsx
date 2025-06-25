"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white px-8 py-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-cyan-400">
                        Run: {run?.title || "..."}
                    </h1>
                    <span className="text-sm text-white/70">
                        Created: {run ? new Date(run.creation_date).toLocaleDateString() : "..."}
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
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-white/80">
                        <p>Transfer learning config UI goes here...</p>
                    </div>
                )}

                {activeTab === "Staged Learning" && (
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-white/80">
                        <p>Staged learning config UI goes here...</p>
                    </div>
                )}

                {activeTab === "View Molecules" && (
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-white/80">
                        <p>View Molecules UI goes here...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
