import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { etudiantService, Etudiant } from '../services/etudiantService';

export type Option = 'GAMIX' | 'SE' | 'SIM' | 'NIDS';

interface EtudiantFormProps {
  etudiant?: Etudiant;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const options: Option[] = ['GAMIX', 'SE', 'SIM', 'NIDS'];

const EtudiantForm: React.FC<EtudiantFormProps> = ({ etudiant, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState<Etudiant>({
    prenomE: '',
    nomE: '',
    op: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (etudiant) {
      setFormData(etudiant);
    }
  }, [etudiant]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.prenomE.trim()) newErrors.prenomE = 'First name is required';
    if (!formData.nomE.trim()) newErrors.nomE = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await etudiantService.updateEtudiant(formData);
      } else {
        await etudiantService.addEtudiant(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                {isEdit ? 'Edit Student' : 'Add Student'}
              </h2>
            </div>
            <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name *
              </label>
              <input
                  type="text"
                  name="prenomE"
                  value={formData.prenomE}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      errors.prenomE
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-700 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter first name"
              />
              {errors.prenomE && <p className="mt-1 text-sm text-red-400">{errors.prenomE}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name *
              </label>
              <input
                  type="text"
                  name="nomE"
                  value={formData.nomE}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      errors.nomE
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-700 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter last name"
              />
              {errors.nomE && <p className="mt-1 text-sm text-red-400">{errors.nomE}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Option
              </label>
              <select
                  name="op"
                  value={formData.op || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Option --</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition font-semibold"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50"
              >
                {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEdit ? 'Update' : 'Create'}
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EtudiantForm;
