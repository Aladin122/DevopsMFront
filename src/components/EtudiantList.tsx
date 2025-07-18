import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Users } from 'lucide-react';
import { etudiantService, Etudiant } from '../services/etudiantService';

interface EtudiantListProps {
  onEdit: (etudiant: Etudiant) => void;
  onView: (etudiant: Etudiant) => void;
  onAdd: () => void;
  refresh: boolean;
}

const EtudiantList: React.FC<EtudiantListProps> = ({ onEdit, onView, onAdd, refresh }) => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEtudiants, setFilteredEtudiants] = useState<Etudiant[]>([]);

  useEffect(() => {
    fetchEtudiants();
  }, [refresh]);

  useEffect(() => {
    const filtered = etudiants.filter(etudiant =>
        etudiant.nomE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.prenomE.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEtudiants(filtered);
  }, [searchTerm, etudiants]);

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      const data = await etudiantService.getEtudiants();
      setEtudiants(data);
      setFilteredEtudiants(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await etudiantService.deleteEtudiant(id);
        fetchEtudiants();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
    );
  }

  return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold">Student Management</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full table-auto">
            <thead className="bg-slate-800">
            <tr>
              <th className="text-left py-3 px-4 text-slate-300">ID</th>
              <th className="text-left py-3 px-4 text-slate-300">First Name</th>
              <th className="text-left py-3 px-4 text-slate-300">Last Name</th>
              <th className="text-left py-3 px-4 text-slate-300">Option</th>
              <th className="text-right py-3 px-4 text-slate-300">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredEtudiants.map((etudiant) => (
                <tr key={etudiant.idEtudiant} className="hover:bg-slate-700/50 transition">
                  <td className="py-3 px-4">{etudiant.idEtudiant}</td>
                  <td className="py-3 px-4">{etudiant.prenomE}</td>
                  <td className="py-3 px-4">{etudiant.nomE}</td>
                  <td className="py-3 px-4 text-slate-400">{etudiant.op || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                          onClick={() => onView(etudiant)}
                          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                          title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => onEdit(etudiant)}
                          className="p-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white"
                          title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => etudiant.idEtudiant && handleDelete(etudiant.idEtudiant)}
                          className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                          title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          {filteredEtudiants.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No students found matching your search.
              </div>
          )}
        </div>

        <div className="mt-4 flex justify-between text-sm text-slate-400">
          <span>Total: {filteredEtudiants.length}</span>
          <span>Showing {filteredEtudiants.length} of {etudiants.length}</span>
        </div>
      </div>
  );
};

export default EtudiantList;
