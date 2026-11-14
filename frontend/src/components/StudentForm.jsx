import React, { useState, useEffect } from 'react';

export default function StudentForm({ initialData, onSubmit, isEditing = false, loading = false }) {
  const [form, setForm] = useState({
    name: '', roll_number: '', mathematics: '', coa: '', programming: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        roll_number: initialData.roll_number || '',
        mathematics: initialData.mathematics ?? '',
        coa: initialData.coa ?? '',
        programming: initialData.programming ?? '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Student name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.roll_number.trim()) e.roll_number = 'Roll number is required';

    ['mathematics', 'coa', 'programming'].forEach(f => {
      const label = f === 'coa' ? 'Computer Organization' : f.charAt(0).toUpperCase() + f.slice(1);
      const v = form[f];
      if (v === '' || v === null || v === undefined) e[f] = `${label} marks are required`;
      else {
        const n = Number(v);
        if (isNaN(n) || !Number.isInteger(n)) e[f] = 'Must be a whole number';
        else if (n < 0 || n > 100) e[f] = 'Must be between 0 and 100';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      mathematics: parseInt(form.mathematics),
      coa: parseInt(form.coa),
      programming: parseInt(form.programming),
    });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) =>
    `w-full bg-white/5 border ${errors[field] ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Student Name</label>
          <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)}
            className={inputClass('name')} placeholder="Enter student name" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Roll Number</label>
          <input type="text" value={form.roll_number} onChange={e => handleChange('roll_number', e.target.value)}
            className={inputClass('roll_number')} placeholder="e.g. CSE2024011" />
          {errors.roll_number && <p className="text-red-400 text-xs mt-1">{errors.roll_number}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { field: 'mathematics', label: 'Mathematics' },
          { field: 'coa', label: 'Computer Organization' },
          { field: 'programming', label: 'Programming' },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
            <input type="number" min="0" max="100" value={form[field]}
              onChange={e => handleChange(field, e.target.value)}
              className={inputClass(field)} placeholder="0 - 100" />
            {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold rounded-lg hover:from-electric-600 hover:to-electric-700 transition-all duration-200 shadow-lg shadow-electric-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Processing...' : isEditing ? 'Update Student' : 'Calculate Result'}
      </button>
    </form>
  );
}
