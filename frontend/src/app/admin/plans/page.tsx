'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlansAdmin() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '30',
        features: '',
        isActive: true,
        isPopular: false
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await fetchAPI('/plans/admin');
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration),
                features: formData.features.split('\n').filter(f => f.trim() !== '')
            };

            if (editingPlan) {
                await fetchAPI(`/plans/${editingPlan.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                });
            } else {
                await fetchAPI('/plans', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }
            setShowModal(false);
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Failed to save plan');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            await fetchAPI(`/plans/${id}`, { method: 'DELETE' });
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan');
        }
    };

    const openModal = (plan?: any) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                description: plan.description || '',
                price: plan.price.toString(),
                duration: plan.duration.toString(),
                features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
                isActive: plan.isActive,
                isPopular: plan.isPopular
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                duration: '30',
                features: '',
                isActive: true,
                isPopular: false
            });
        }
        setShowModal(true);
    };

    if (loading) return <div className="p-8">Loading plans...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Subscription Plans</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Add Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 bg-white dark:bg-slate-800 rounded-2xl border ${plan.isPopular ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-slate-200 dark:border-slate-700'} relative`}
                    >
                        {plan.isPopular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs font-bold rounded-full">
                                Popular
                            </span>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold dark:text-white">{plan.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.duration} Days</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(plan)} className="text-slate-400 hover:text-blue-500 transition">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(plan.id)} className="text-slate-400 hover:text-red-500 transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold dark:text-white">{plan.price}</span>
                            <span className="text-slate-500 dark:text-slate-400"> EGP</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {(Array.isArray(plan.features) ? plan.features as string[] : []).map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className={`mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm font-medium ${plan.isActive ? 'text-green-500' : 'text-slate-400'}`}>
                            {plan.isActive ? 'Active (Visible)' : 'Hidden (Draft)'}
                        </div>
                    </motion.div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <XCircle size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">
                            {editingPlan ? 'Edit Plan' : 'Create Plan'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Plan Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Price (EGP)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Duration (Days)</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Features (One per line)</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.features}
                                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    placeholder="Feature 1\nFeature 2\nFeature 3"
                                />
                            </div>

                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer dark:text-white">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 focus:ring-blue-500"
                                    />
                                    Active (Visible)
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer dark:text-white">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPopular}
                                        onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 focus:ring-orange-500"
                                    />
                                    Mark as Popular
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Save Plan
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
