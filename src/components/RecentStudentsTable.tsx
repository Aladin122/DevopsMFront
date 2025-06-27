import React, { useEffect, useState } from 'react';
import { etudiantService } from '../services/etudiantService';
import { User, Calendar, MapPin } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
}

const RecentStudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const fetched = await etudiantService.getEtudiants();

        const mapped: Student[] = fetched.slice(0, 5).map((etudiant: any, index: number) => ({
          id: etudiant.idEtudiant,
          name: `${etudiant.prenomE} ${etudiant.nomE}`,
          email: `${etudiant.prenomE.toLowerCase()}.${etudiant.nomE.toLowerCase()}@university.edu`,
          department: etudiant.departement?.nomDepart || 'Unknown Dept',
          joinDate: new Date(Date.now() - index * 86400000).toISOString(),
          status: ['active', 'pending', 'inactive'][index % 3] as Student['status'],
        }));

        setStudents(mapped);
      } catch (err) {
        console.error('Failed to load students', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-400 bg-emerald-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 bg-gray-600/50 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600/50 rounded w-3/4" />
                <div className="h-3 bg-gray-600/50 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {students.map((student, index) => (
        <div
          key={student.id}
          className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-slide-up opacity-0"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium truncate group-hover:text-cyan-300 transition-colors">
                  {student.name}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>

              <p className="text-gray-400 text-sm truncate mb-2">
                {student.email}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{student.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(student.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentStudentsTable;
