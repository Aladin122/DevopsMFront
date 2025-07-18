import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  GraduationCap,
  Users2,
  Building2,
  TrendingUp,
  Activity
} from 'lucide-react';
import StatCard from './StatCard';
import StudentAnalyticsChart from './StudentAnalyticsChart';
import RecentStudentsTable from './RecentStudentsTable';
import EtudiantManagement from './EtudiantManagement';
import LoadingSpinner from './LoadingSpinner';
import AnimatedBackground from './AnimatedBackground';

// Import API services
import { etudiantService } from '../services/etudiantService';
import { getContrats } from '../services/contratService';
import { getDepartements } from '../services/departementService';
import { getEquipes } from '../services/equipeService';
import { getUniversites } from '../services/universiteService';

interface DashboardStats {
  etudiants: number;
  contrats: number;
  departements: number;
  equipes: number;
  universites: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    etudiants: 0,
    contrats: 0,
    departements: 0,
    equipes: 0,
    universites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [etudiantsRes, contratsRes, departementsRes, equipesRes, universitesRes] = await Promise.all([
          etudiantService.getEtudiants(),
          getContrats(),
          getDepartements(),
          getEquipes(),
          getUniversites()
        ]);

        setStats({
          etudiants: etudiantsRes.length,
          contrats: contratsRes.data.length,
          departements: departementsRes.data.length,
          equipes: equipesRes.data.length,
          universites: universitesRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Students',
      value: stats.etudiants,
      icon: Users,
      color: 'from-indigo-500 via-purple-500 to-pink-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Contracts',
      value: stats.contrats,
      icon: FileText,
      color: 'from-emerald-400 via-teal-500 to-green-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Departments',
      value: stats.departements,
      icon: Building2,
      color: 'from-yellow-400 via-orange-500 to-red-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Teams',
      value: stats.equipes,
      icon: Users2,
      color: 'from-sky-500 via-blue-600 to-indigo-700',
      trend: '+10%',
      trendUp: true,
    },
    {
      title: 'Universities',
      value: stats.universites,
      icon: GraduationCap,
      color: 'from-pink-400 via-fuchsia-500 to-violet-600',
      trend: '+3%',
      trendUp: true,
    },
  ];

  return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
        <AnimatedBackground />

        <div className="relative z-10 p-6 md:p-12">
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              🎓 University Dashboard
            </h1>
            <p className="text-gray-300 text-lg mt-2">Real-time analytics and insights</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {statCards.map((card, index) => (
                <StatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    gradient={card.color}
                    trend={card.trend}
                    trendUp={card.trendUp}
                    delay={index * 100}
                />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-2">
              <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl hover:shadow-blue-500/40 transition duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">📊 Student Analytics</h3>
                </div>
                <StudentAnalyticsChart />
              </div>
            </div>

            <div>
              <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl hover:shadow-pink-500/40 transition duration-500 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-700 shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">🧑‍🎓 Recent Students</h3>
                </div>
                <RecentStudentsTable />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <EtudiantManagement />
          </div>
        </div>
      </div>
  );
};

export default Dashboard;