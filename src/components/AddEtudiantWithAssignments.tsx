import React, { useState, useEffect } from 'react';
import { Users, FileText, Building2, Save, X } from 'lucide-react';
import { etudiantService, Etudiant } from '../services/etudiantService';
import { getContrats } from '../services/contratService';
import { getEquipes } from '../services/equipeService';

interface Contract {
  idContrat: number;
  dateDebutContrat: string;
  dateFinContrat: string;
  specialite: string;
  archive: boolean;
}

interface Equipe {
  idEquipe: number;
  nomEquipe: string;
  niveau: string;
}

interface AddEtudiantWithAssignmentsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddEtudiantWithAssignments: React.FC<AddEtudiantWithAssignmentsProps> = ({
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Etudiant>({
    prenomE: '',
    nomE: '',
    op: ''
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [selectedEquipeId, setSelectedEquipeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contractsRes, equipesRes] = await Promise.all([
        getContrats(),
        getEquipes()
      ]);
      setContracts(contractsRes.data);
      setEquipes(equipesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.prenomE.trim()) {
      newErrors.prenomE = 'First name is required';
    }
    if (!formData.nomE.trim()) {
      newErrors.nomE = 'Last name is required';
    }
    if (!selectedContractId) {
      newErrors.contract = 'Please select a contract';
    }
    if (!selectedEquipeId) {
      newErrors.equipe = 'Please select a team';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedContractId || !selectedEquipeId) {
      return;
    }

    try {
      setSaving(true);
      await etudiantService.addEtudiantWithEquipeAndContract(
        formData,
        selectedContractId,
        selectedEquipeId
      );
      onSuccess();
    } catch (error) {
      console.error('Error saving student with assignments:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add Student with Assignments</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="prenomE"
                value={formData.prenomE}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/20 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
                  errors.prenomE ? 'border-red-500 focus:ring-red-500' : 'border-white/30 focus:ring-blue-500'
                }`}
                placeholder="Enter first name"
              />
              {errors.prenomE && <p className="mt-1 text-sm text-red-400">{errors.prenomE}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="nomE"
                value={formData.nomE}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/20 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
                  errors.nomE ? 'border-red-500 focus:ring-red-500' : 'border-white/30 focus:ring-blue-500'
                }`}
                placeholder="Enter last name"
              />
              {errors.nomE && <p className="mt-1 text-sm text-red-400">{errors.nomE}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Option
            </label>
            <input
              type="text"
              name="op"
              value={formData.op || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter option (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Contract *
            </label>
            <div className={`space-y-2 max-h-40 overflow-y-auto border rounded-xl p-3 ${
              errors.contract ? 'border-red-500' : 'border-white/30'
            }`}>
              {contracts.map((contract) => (
                <label
                  key={contract.idContrat}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedContractId === contract.idContrat
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="contract"
                    value={contract.idContrat}
                    checked={selectedContractId === contract.idContrat}
                    onChange={() => {
                      setSelectedContractId(contract.idContrat);
                      if (errors.contract) {
                        setErrors(prev => ({ ...prev, contract: '' }));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedContractId === contract.idContrat
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedContractId === contract.idContrat && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <FileText className="w-4 h-4 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{contract.specialite}</p>
                    <p className="text-sm text-gray-400">
                      {contract.dateDebutContrat} - {contract.dateFinContrat}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.contract && <p className="mt-1 text-sm text-red-400">{errors.contract}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Team *
            </label>
            <div className={`space-y-2 max-h-40 overflow-y-auto border rounded-xl p-3 ${
              errors.equipe ? 'border-red-500' : 'border-white/30'
            }`}>
              {equipes.map((equipe) => (
                <label
                  key={equipe.idEquipe}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedEquipeId === equipe.idEquipe
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="equipe"
                    value={equipe.idEquipe}
                    checked={selectedEquipeId === equipe.idEquipe}
                    onChange={() => {
                      setSelectedEquipeId(equipe.idEquipe);
                      if (errors.equipe) {
                        setErrors(prev => ({ ...prev, equipe: '' }));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedEquipeId === equipe.idEquipe
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedEquipeId === equipe.idEquipe && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{equipe.nomEquipe}</p>
                    <p className="text-sm text-gray-400">Level: {equipe.niveau}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.equipe && <p className="mt-1 text-sm text-red-400">{errors.equipe}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create with Assignments
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddEtudiantWithAssignments