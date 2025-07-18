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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const newErrors: { [key: string]: string } = {};

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
        <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500"></div>
        </div>
    );
  }

  return (
      <div className="fixed inset-0 bg-zinc-900/70 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-600 rounded-2xl p-6 w-full max-w-3xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-indigo-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">New Student Entry</h2>
            </div>
            <button
                onClick={onCancel}
                className="text-zinc-300 hover:text-white hover:bg-zinc-600 p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-zinc-300 mb-1">First Name *</label>
                <input
                    name="prenomE"
                    value={formData.prenomE}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`w-full p-3 rounded-lg bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 ${
                        errors.prenomE ? 'border-red-500 ring-red-400' : 'border-zinc-600 focus:ring-indigo-500'
                    }`}
                />
                {errors.prenomE && <p className="text-red-400 text-sm mt-1">{errors.prenomE}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Last Name *</label>
                <input
                    name="nomE"
                    value={formData.nomE}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`w-full p-3 rounded-lg bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 ${
                        errors.nomE ? 'border-red-500 ring-red-400' : 'border-zinc-600 focus:ring-indigo-500'
                    }`}
                />
                {errors.nomE && <p className="text-red-400 text-sm mt-1">{errors.nomE}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">Option</label>
              <input
                  name="op"
                  value={formData.op || ''}
                  onChange={handleChange}
                  placeholder="Enter option (optional)"
                  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">Select Contract *</label>
              <div className={`space-y-2 border rounded-lg p-3 overflow-y-auto max-h-48 ${errors.contract ? 'border-red-500' : 'border-zinc-600'}`}>
                {contracts.map(contract => (
                    <label
                        key={contract.idContrat}
                        className={`flex items-center gap-3 p-2 rounded-md transition-all cursor-pointer ${
                            selectedContractId === contract.idContrat
                                ? 'bg-indigo-600/30 border border-indigo-500'
                                : 'hover:bg-zinc-700 border border-transparent'
                        }`}
                    >
                      <input
                          type="radio"
                          name="contract"
                          value={contract.idContrat}
                          checked={selectedContractId === contract.idContrat}
                          onChange={() => setSelectedContractId(contract.idContrat)}
                          className="hidden"
                      />
                      <FileText className="w-5 h-5 text-indigo-400" />
                      <div className="text-white">
                        <p className="font-medium">{contract.specialite}</p>
                        <p className="text-sm text-zinc-400">{contract.dateDebutContrat} - {contract.dateFinContrat}</p>
                      </div>
                    </label>
                ))}
              </div>
              {errors.contract && <p className="text-red-400 text-sm mt-1">{errors.contract}</p>}
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">Select Team *</label>
              <div className={`space-y-2 border rounded-lg p-3 overflow-y-auto max-h-48 ${errors.equipe ? 'border-red-500' : 'border-zinc-600'}`}>
                {equipes.map(equipe => (
                    <label
                        key={equipe.idEquipe}
                        className={`flex items-center gap-3 p-2 rounded-md transition-all cursor-pointer ${
                            selectedEquipeId === equipe.idEquipe
                                ? 'bg-purple-600/30 border border-purple-500'
                                : 'hover:bg-zinc-700 border border-transparent'
                        }`}
                    >
                      <input
                          type="radio"
                          name="equipe"
                          value={equipe.idEquipe}
                          checked={selectedEquipeId === equipe.idEquipe}
                          onChange={() => setSelectedEquipeId(equipe.idEquipe)}
                          className="hidden"
                      />
                      <Building2 className="w-5 h-5 text-purple-400" />
                      <div className="text-white">
                        <p className="font-medium">{equipe.nomEquipe}</p>
                        <p className="text-sm text-zinc-400">Level: {equipe.niveau}</p>
                      </div>
                    </label>
                ))}
              </div>
              {errors.equipe && <p className="text-red-400 text-sm mt-1">{errors.equipe}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {saving ? (
                    <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                ) : (
                    <>
                      <Save className="w-5 h-5" /> Save Student
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddEtudiantWithAssignments;