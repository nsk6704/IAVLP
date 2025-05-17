"use client";

import React from "react";
import { GitGraph, Mail, Phone, User, BookOpen, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Team member interface
interface TeamMember {
  name: string;
  branch: string;
  icon: React.ReactNode;
}

// Team members data
const teamMembers: TeamMember[] = [
  {
    name: "Ayush Ojha",
    branch: "Computer Science Engineering (Data Science)",
    icon: <Code className="w-10 h-10 text-purple-500" />
  },
  {
    name: "KMS Siddharth",
    branch: "Computer Science Engineering (Data Science)",
    icon: <Code className="w-10 h-10 text-purple-500" />
  },
  {
    name: "Nagendra Saketh Kashyap",
    branch: "Computer Science Engineering",
    icon: <Code className="w-10 h-10 text-purple-500" />
  },
  {
    name: "Manu Bhat",
    branch: "Information Science & Engineering",
    icon: <Code className="w-10 h-10 text-purple-500" />
  },
  {
    name: "Siddesh",
    branch: "Information Science & Engineering",
    icon: <Code className="w-10 h-10 text-purple-500" />
  }
];

// Background pattern component
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-[250px] -right-[250px] animate-pulse" />
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-[250px] -left-[250px] animate-pulse delay-1000" />
  </div>
);

// Team member card component
const TeamMemberCard = ({ name, branch, icon }: TeamMember) => (
  <div className="relative group">
    <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gray-900/70 backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{name}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Branch: {branch}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ContactPage() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <BackgroundPattern />
      
      {/* Using universal header - custom header removed */}

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text py-2">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The brilliant minds behind AlgoViz - bringing algorithm visualization to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard 
                key={index}
                name={member.name}
                branch={member.branch}
                icon={member.icon}
              />
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Have questions about our project or want to collaborate? Feel free to reach out to us.
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>ayushojha.cd22@rvce.edu.in</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>+91 9741381693</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
