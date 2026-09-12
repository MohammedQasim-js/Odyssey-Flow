import React, { useState } from 'react';
import { Settings, CheckCircle2, Building2, Clock, ShieldCheck, Bell, HeartPulse, Save } from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { ClinicSettings } from '../../types';

export const ClinicSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<ClinicSettings>(() => DataStore.getClinicSettings());
  const [saved, setSaved] = useState(false);
  const [deptInput, setDeptInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.updateClinicSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddDept = () => {
    if (!deptInput.trim()) return;
    if (!settings.departments || !settings.departments.includes(deptInput.trim())) {
      setSettings({
        ...settings,
        departments: [...(settings.departments || []), deptInput.trim()],
      });
      setDeptInput('');
    }
  };

  const handleRemoveDept = (name: string) => {
    setSettings({
      ...settings,
      departments: settings.departments.filter(d => d !== name),
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-stone-700" />
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Clinic Operations &amp; Queue Policy Configuration
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure clinical intake windows, senior-review DPS thresholds, and empathetic pacing parameters.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Persisted</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Clinic Identity & Address */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Clinic Identity &amp; Physical Premises
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Clinic Name</label>
              <input
                type="text"
                value={settings.clinicName}
                onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactNumber}
                onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">Full Clinic Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Departments */}
          <div>
            <label className="font-bold text-stone-700 block mb-1.5 text-xs">Active Departments</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.departments.map(d => (
                <span 
                  key={d}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <span>{d}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveDept(d)}
                    className="text-stone-400 hover:text-stone-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={deptInput}
                onChange={(e) => setDeptInput(e.target.value)}
                placeholder="Add new specialty department..."
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs flex-1"
              />
              <button
                type="button"
                onClick={handleAddDept}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Consultation Windows & Policy */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Consultation Windows &amp; Queue Policy Engine
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Standard Intake Window</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={settings.defaultConsultationMin}
                  onChange={(e) => setSettings({ ...settings, defaultConsultationMin: Number(e.target.value) })}
                  className="w-20 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center font-bold text-stone-900"
                />
                <span className="text-stone-500">minutes</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Adjusted Intake (DPS Stagnant)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={settings.extendedConsultationMin}
                  onChange={(e) => setSettings({ ...settings, extendedConsultationMin: Number(e.target.value) })}
                  className="w-20 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center font-bold text-emerald-800"
                />
                <span className="text-stone-500">minutes</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Senior Review Threshold (DPS)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={settings.seniorReviewThresholdDPS}
                  onChange={(e) => setSettings({ ...settings, seniorReviewThresholdDPS: Number(e.target.value) })}
                  className="w-20 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center font-bold text-amber-800"
                />
                <span className="text-stone-500">/ 100 DPS</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="font-bold text-stone-700 block mb-1 text-xs">Queue Dispatch Policy</label>
            <select
              value={settings.queuePolicy}
              onChange={(e) => setSettings({ ...settings, queuePolicy: e.target.value as any })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800"
            >
              <option value="dps_stagnation_priority">
                DPS Stagnation Priority (Recommended: Elevates high ambiguity / multi-test patients)
              </option>
              <option value="acuity_first">
                Acuity &amp; Symptom Severity First
              </option>
              <option value="strict_fifo">
                Strict FIFO (First-In, First-Out traditional order)
              </option>
            </select>
          </div>
        </div>

        {/* Pulse & Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <HeartPulse className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Sanctuary Pulse &amp; Patient Pacing Settings
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/70 cursor-pointer">
              <div>
                <span className="font-bold text-stone-900 block">Empathetic Wait Pacing</span>
                <span className="text-[11px] text-stone-500">
                  Transmit clinical context (e.g. "Doctor reviewing history") instead of frozen countdowns.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.pulseEmpatheticPacing}
                onChange={(e) => setSettings({ ...settings, pulseEmpatheticPacing: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/70 cursor-pointer">
              <div>
                <span className="font-bold text-stone-900 block">SMS &amp; WhatsApp Live Token Ping</span>
                <span className="text-[11px] text-stone-500">
                  Broadcast token position changes to patient mobile devices automatically.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationSMS}
                onChange={(e) => setSettings({ ...settings, notificationSMS: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-xs font-bold shadow-xs flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Save Operational Parameters</span>
          </button>
        </div>

      </form>

    </div>
  );
};
