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
      console.error('Error fetching students:', error);
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400"></div>
        </div>
    );
  }

  return (
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Students by Department</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Departments */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Departments</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {departments.map((dept) => (
                  <button
                      key={dept.idDepartement}
                      onClick={() => handleDepartmentSelect(dept.idDepartement)}
                      className={`w-full text-left p-4 rounded-xl border shadow-sm transition-all ${
                          selectedDepartmentId === dept.idDepartement
                              ? 'bg-purple-600/30 border-purple-500/60 text-white'
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

          {/* Students */}
          <div className="lg:col-span-2">
            {selectedDepartmentId ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {departments.find((d) => d.idDepartement === selectedDepartmentId)?.nomDepart}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{etudiants.length} students</span>
                    </div>
                  </div>

                  {fetchingStudents ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-cyan-400"></div>
                      </div>
                  ) : etudiants.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {etudiants.map((etudiant) => (
                            <div
                                key={etudiant.idEtudiant}
                                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-cyan-600/20 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
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
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No students found in this department</p>
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

export default EtudiantsByDepartement;
