import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Users,
  Building,
  FileText
} from 'lucide-react';
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Students Management</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">ID</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">First Name</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Name</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Option</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEtudiants.map((etudiant) => (
              <tr key={etudiant.idEtudiant} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-white">{etudiant.idEtudiant}</td>
                <td className="py-3 px-4 text-white">{etudiant.prenomE}</td>
                <td className="py-3 px-4 text-white">{etudiant.nomE}</td>
                <td className="py-3 px-4 text-gray-300">{etudiant.op || 'N/A'}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(etudiant)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(etudiant)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => etudiant.idEtudiant && handleDelete(etudiant.idEtudiant)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
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
          <div className="text-center py-8 text-gray-400">
            No students found matching your search criteria.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <span>Total: {filteredEtudiants.length} students</span>
        <span>Showing {filteredEtudiants.length} of {etudiants.length} students</span>
      </div>
    </div>
  );
};


export default EtudiantList