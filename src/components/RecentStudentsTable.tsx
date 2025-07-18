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
        return 'text-green-500 bg-green-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'inactive':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-md shadow-sm">
                  <div className="w-10 h-10 bg-gray-500/40 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-500/30 rounded w-3/4" />
                    <div className="h-3 bg-gray-500/20 rounded w-1/2" />
                  </div>
                </div>
              </div>
          ))}
        </div>
    );
  }

  return (
      <div className="space-y-4">
        {students.map((student, index) => (
            <div
                key={student.id}
                className="group p-5 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-white/10 hover:border-cyan-400/30 hover:shadow-lg transition-all duration-300 backdrop-blur-lg animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 120}ms`,
                  animationFillMode: 'forwards',
                }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-inner">
                  <User className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold truncate group-hover:text-cyan-300 transition-colors">
                      {student.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
                  </div>

                  <p className="text-gray-300 text-sm truncate mb-1">
                    {student.email}
                  </p>

                  <div className="flex items-center gap-5 text-xs text-gray-400">
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
