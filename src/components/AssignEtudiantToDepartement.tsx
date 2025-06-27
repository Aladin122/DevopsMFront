import React, { useState, useEffect } from 'react';
import { Building, Users, ArrowRight } from 'lucide-react';
import { etudiantService } from '../services/etudiantService';
import { getDepartements } from '../services/departementService';

interface Department {
  idDepartement: number;
  nomDepart: string;
}

interface AssignEtudiantToDepartementProps {
  etudiantId: number;
  etudiantName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AssignEtudiantToDepartement: React.FC<AssignEtudiantToDepartementProps> = ({
  etudiantId,
  etudiantName,
  onSuccess,
  onCancel
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

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

  const handleAssign = async () => {
    if (!selectedDepartmentId) return;

    try {
      setAssigning(true);
      await etudiantService.assignEtudiantToDepartement(etudiantId, selectedDepartmentId);
      onSuccess();
    } catch (error) {
      console.error('Error assigning student to department:', error);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Assign to Department</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Student</p>
              <p className="text-white font-medium">{etudiantName}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Department
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {departments.map((dept) => (
                <label
                  key={dept.idDepartement}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDepartmentId === dept.idDepartement
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="department"
                    value={dept.idDepartement}
                    checked={selectedDepartmentId === dept.idDepartement}
                    onChange={() => setSelectedDepartmentId(dept.idDepartement)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedDepartmentId === dept.idDepartement
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedDepartmentId === dept.idDepartement && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-white">{dept.nomDepart}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedDepartmentId || assigning}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium disabled:opacity-50"
          >
            {assigning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Assign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignEtudiantToDepartement