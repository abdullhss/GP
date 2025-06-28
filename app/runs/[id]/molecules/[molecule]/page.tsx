"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type MoleculeData = {
  id: number;
  SMILES: string;
  run_id: number;
  score: number;
  view: string;
};

export default function MoleculePage() {
  const { molecule } = useParams();
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [loading, setLoading] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMolecule = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${baseURL}run/molecule/${molecule}`);
        setMoleculeData(res.data);
      } catch (error) {
        console.error("Error fetching molecule data:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadMolHtml = async () => {
      try {
        const res = await fetch("/mol.html"); // أو `${molecule}.html` لو كل موليكيول ليه فايل
        const html = await res.text();

        if (viewerRef.current) {
          viewerRef.current.innerHTML = html;

          // Run all <script> inside the HTML
          const scripts = viewerRef.current.querySelectorAll("script");
          scripts.forEach((oldScript) => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach((attr) =>
              newScript.setAttribute(attr.name, attr.value)
            );
            newScript.textContent = oldScript.textContent;
            oldScript.replaceWith(newScript);
          });
        }
      } catch (err) {
        console.error("Failed to load mol.html", err);
      }
    };

    fetchMolecule();
    loadMolHtml();
  }, [molecule]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white px-8 py-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-cyan-400 text-center drop-shadow">
          Molecule Details
        </h1>

        {loading ? (
          <p className="text-center text-white/70">Loading...</p>
        ) : moleculeData ? (
          <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/10 space-y-6">
            <div>
              <p className="text-cyan-300 text-lg font-semibold">SMILES:</p>
              <p className="text-white/90">{moleculeData.SMILES}</p>
            </div>

            <div>
              <p className="text-cyan-300 text-lg font-semibold">Score:</p>
              <p className="text-white/90">{moleculeData.score}</p>
            </div>

            <div>
              <p className="text-cyan-300 text-lg font-semibold">Molecule View:</p>
              <div
                ref={viewerRef}
                className="mt-4 border border-white/20 rounded-md bg-black/10 p-4"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-400">Failed to load molecule data.</p>
        )}
      </div>
    </div>
  );
}
