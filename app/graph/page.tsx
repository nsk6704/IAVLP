"use client";

import NetworkGraph from "@/components/NetworkGraph";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GraphPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Computer Science Knowledge Graph</h1>
          <p className="text-gray-400">
            Interactive visualization of Computer Science concepts and their relationships.
            Hover over nodes to see details and explore connections.
          </p>
        </div>
        
        <div className="rounded-xl overflow-hidden border border-white/10">
          <NetworkGraph />
        </div>
      </div>
    </div>
  );
}