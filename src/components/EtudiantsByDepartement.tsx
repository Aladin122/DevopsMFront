import React, { useState, useEffect } from 'react';
import { Building, Users, Search } from 'lucide-react';
import { etudiantService, Etudiant } from '../services/etudiantService';
import { getDepartements } from '../services/departementService';

interface Department {
  idDepartement: number;
  nomDepart: string;
}

const EtudiantsByDepartement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartements();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByDepartment = async (departmentId: number) => {
    try {
      setFetchingStudents(true);
      const students = await etudiantService.getEtudiantsByDepartement(departmentId);
      setEtudiants(students);
    } catch (error) {
      console.error('Error fetching students by department:', error);
      setEtudiants([]);
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleDepartmentSelect = (departmentId: number) => {
    setSelectedDepartmentId(departmentId);
    fetchStudentsByDepartment(departmentId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
          <Building className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Students by Department</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Select Department</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {departments.map((dept) => (
              <button
                key={dept.idDepartement}
                onClick={() => handleDepartmentSelect(dept.idDepartement)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedDepartmentId === dept.idDepartement
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5" />
                  <span className="font-medium">{dept.nomDepart}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDepartmentId ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Students in {departments.find(d => d.idDepartement === selectedDepartmentId)?.nomDepart}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{etudiants.length} students</span>
                </div>
              </div>

              {fetchingStudents ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {etudiants.length > 0 ? (
                    etudiants.map((etudiant) => (
                      <div
                        key={etudiant.idEtudiant}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {etudiant.prenomE} {etudiant.nomE}
                              </p>
                              <p className="text-sm text-gray-400">
                                ID: {etudiant.idEtudiant}
                                {etudiant.op && ` • ${etudiant.op}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No students found in this department</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a department to view students</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EtudiantsByDepartement