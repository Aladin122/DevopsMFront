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
      color: 'from-blue-500 to-cyan-400',
      trend: '+12%',
      trendUp: true,
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
            University Dashboard
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Real-time analytics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Student Analytics</h3>
              </div>
              <StudentAnalyticsChart />
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Recent Students</h3>
              </div>
              <RecentStudentsTable />

            </div>
          </div>
        </div>
        <EtudiantManagement />
      </div>
    </div>
  );
};

export default Dashboard;
