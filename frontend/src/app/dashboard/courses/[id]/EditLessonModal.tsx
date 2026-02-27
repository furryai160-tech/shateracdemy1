'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Video, Lock, Unlock, Loader2, Plus, FileQuestion, Trash2, ArrowLeft, Save } from 'lucide-react';
import { fetchAPI } from '../../../../lib/api';

interface EditLessonModalProps {
    lesson: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedLesson: any) => void;
}

export function EditLessonModal({ lesson, isOpen, onClose, onUpdate }: EditLessonModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'quiz'>('details');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoId: '',
        videoProvider: 'YOUTUBE', // Default
        videoDuration: 0,
        pdfUrl: '',
        pdfTitle: '',
        isFree: false,
        dripDelay: 0
    });
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);

            // Use the API_URL from env or default
            const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

            const response = await fetch(`${API_URL}/uploads`, {
                method: 'POST',
                body: formDataUpload,
                // Do not set Content-Type header, let browser set it with boundary
            });

            clearInterval(interval);
            setUploadProgress(100);

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                videoId: data.url,
                videoProvider: 'LOCAL' as any
            }));

        } catch (error) {
            console.error("Upload error", error);
            alert("Failed to upload video");
        } finally {
            setUploading(false);
        }
    };

    // Quiz State
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<any>(null); // If not null, we are editing a specific quiz

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title || '',
                description: lesson.description || '',
                videoId: lesson.videoId || '',
                videoProvider: lesson.videoProvider || 'YOUTUBE',
                videoDuration: lesson.videoDuration || 0,
                pdfUrl: lesson.pdfUrl || '',
                pdfTitle: lesson.pdfTitle || '',
                isFree: lesson.isFree || false,
                dripDelay: lesson.dripDelay || 0
            });
            // Reset quiz state
            setQuizzes([]);
            setEditingQuiz(null);
            setActiveTab('details');
        }
    }, [lesson]);

    // Load quizzes when tab changes to quiz
    useEffect(() => {
        if (activeTab === 'quiz' && lesson?.id) {
            loadQuizzes();
        }
    }, [activeTab, lesson]);

    const loadQuizzes = async () => {
        setIsLoadingQuizzes(true);
        try {
            // We probably need an endpoint to get quizzes by lessonId -> GET /quizzes?lessonId=...
            // For now, let's assume we fetch all and filter client side or the backend supports query
            // Or better: GET /lessons/:id includes quizzes.
            // Let's assume we can fetch quizzes for the lesson.
            // Since we don't have a specific endpoint yet, let's fetch individual quiz if we had the IDs,
            // or let's just fetch all quizzes and filter (inefficient but works for MVP small data)
            // OR better: Update backend to support filtering.
            // Let's try finding quizzes by filtering if the API supported it, but our generated controller might not.
            // Let's assume we updated the backend service to filter by lessonId? No I didn't.
            // I will assume for now I can fetch all quizzes and filter.
            const allQuizzes = await fetchAPI('/quizzes');
            const lessonQuizzes = allQuizzes.filter((q: any) => q.lessonId === lesson.id);
            setQuizzes(lessonQuizzes);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        } finally {
            setIsLoadingQuizzes(false);
        }
    };

    const handleUpdateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updated = await fetchAPI(`/lessons/${lesson.id}`, {
                method: 'PATCH',
                body: JSON.stringify(formData)
            });
            onUpdate(updated);
            onClose();
        } catch (error) {
            console.error('Failed to update lesson', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateQuiz = async () => {
        try {
            const newQuiz = await fetchAPI('/quizzes', {
                method: 'POST',
                body: JSON.stringify({
                    title: `Quiz for ${lesson.title}`,
                    lessonId: lesson.id,
                    questions: []
                })
            });
            setQuizzes([...quizzes, newQuiz]);
            setEditingQuiz(newQuiz);
        } catch (error) {
            console.error('Failed to create quiz', error);
        }
    };

    const handleDeleteQuiz = async (quizId: string) => {
        if (!confirm("Delete this quiz?")) return;
        try {
            await fetchAPI(`/quizzes/${quizId}`, { method: 'DELETE' });
            setQuizzes(quizzes.filter(q => q.id !== quizId));
        } catch (error) {
            console.error("Failed to delete quiz", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <h3 className="text-lg font-bold">
                                {editingQuiz ? 'Edit Quiz' : 'Edit Lesson Content'}
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Quiz Editor View (Full Screen Override) */}
                        {editingQuiz ? (
                            <QuizEditor
                                key="quiz-editor"
                                quiz={editingQuiz}
                                onBack={() => { setEditingQuiz(null); loadQuizzes(); }}
                            />
                        ) : (
                            <div key="lesson-details" className="flex flex-col h-full overflow-hidden" dir="rtl">
                                <div className="p-6 overflow-y-auto space-y-8">
                                    {/* Section 1: Video & Details */}
                                    <section className="space-y-6">
                                        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <Video size={18} className="text-blue-600" />
                                            محتوى الدرس (الفيديو)
                                        </h4>

                                        <form id="lesson-form" onSubmit={handleUpdateLesson} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">عنوان الدرس</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">مصدر الفيديو</label>
                                                <div
                                                    onClick={() => document.getElementById('video-upload')?.click()}
                                                    className={`border-2 border-dashed ${uploading ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'} rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer relative overflow-hidden`}
                                                >
                                                    {formData.videoId && formData.videoProvider === 'LOCAL' && !uploading && (
                                                        <div className="absolute inset-0 z-0 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                                            <div className="text-green-600 font-medium flex items-center gap-2">
                                                                <Video size={20} /> تم رفع الفيديو بنجاح
                                                            </div>
                                                        </div>
                                                    )}

                                                    {uploading ? (
                                                        <div className="flex flex-col items-center z-10">
                                                            <Loader2 size={32} className="animate-spin mb-2 text-blue-600" />
                                                            <p className="font-medium text-blue-600">جاري الرفع... {uploadProgress}%</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center z-10">
                                                            <Upload size={32} className="mb-2" />
                                                            <p className="font-medium">اضغط لرفع فيديو</p>
                                                            <p className="text-xs mt-1 text-slate-400">MP4, MOV حتى 2 جيجابايت</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    id="video-upload"
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-sm text-slate-400">أو</span>
                                                    <input
                                                        type="text"
                                                        placeholder="الصق رابط الفيديو (YouTube, VdoCipher, etc.)"
                                                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={formData.videoId}
                                                        onChange={(e) => setFormData({ ...formData, videoId: e.target.value, videoProvider: 'YOUTUBE' })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-2">رابط ملف الشرح (PDF)</label>
                                                    <input
                                                        type="url"
                                                        placeholder="رابط ملف الشرح إذا وجد"
                                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={formData.pdfUrl}
                                                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-2">عنوان ملف الشرح</label>
                                                    <input
                                                        type="text"
                                                        placeholder="مثال: ملزمة الدرس الأول"
                                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={formData.pdfTitle}
                                                        onChange={(e) => setFormData({ ...formData, pdfTitle: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${formData.isFree ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            {formData.isFree ? <Unlock size={20} /> : <Lock size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">مشاهدة مجانية (عرض تشويقي)</p>
                                                            <p className="text-xs text-slate-500">السماح للطلاب بالمشاهدة قبل الشراء</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.isFree ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                                        {formData.isFree && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={formData.isFree}
                                                        onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                                                    />
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">جدولة النشر (عدد الأيام بعد الاشتراك)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={formData.dripDelay}
                                                    onChange={(e) => setFormData({ ...formData, dripDelay: parseInt(e.target.value) || 0 })}
                                                />
                                                <p className="text-xs text-slate-500 mt-1">اتركه 0 للنشر فوراً عند الاشتراك.</p>
                                            </div>
                                        </form>
                                    </section>

                                    {/* Section 2: Quizzes */}
                                    <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <FileQuestion size={18} className="text-indigo-600" />
                                            الاختبارات والواجبات
                                        </h4>
                                        <p className="text-sm text-slate-500 -mt-4">
                                            إضافة اختبارات تظهر أسفل الفيديو لقياس استيعاب الطالب.
                                        </p>

                                        <div className="space-y-4">
                                            {isLoadingQuizzes ? (
                                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" /></div>
                                            ) : (
                                                <>
                                                    {quizzes.length === 0 ? (
                                                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                                            <p className="text-slate-500 mb-3 text-sm">لا توجد اختبارات مضافة لهذا الدرس.</p>
                                                            <button
                                                                onClick={handleCreateQuiz}
                                                                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
                                                            >
                                                                <Plus size={16} /> إنشاء اختبار جديد
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {quizzes.map((quiz) => (
                                                                <div key={quiz.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                                                            <FileQuestion size={20} />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-sm">{quiz.title}</h4>
                                                                            <p className="text-xs text-slate-500">
                                                                                {(quiz.questions && Array.isArray(quiz.questions)) ? quiz.questions.length : 0} سؤال
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => setEditingQuiz(quiz)}
                                                                            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors"
                                                                        >
                                                                            تعديل المحتوى
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteQuiz(quiz.id)}
                                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={handleCreateQuiz}
                                                                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all font-medium flex items-center justify-center gap-2 text-sm"
                                                            >
                                                                <Plus size={16} /> إضافة اختبار آخر
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                {/* Footer - Actions */}
                                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end shrink-0 z-10 gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        form="lesson-form"
                                        disabled={isSaving}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 size={16} className="animate-spin" />}
                                        حفظ الكل
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Sub-component for editing a specific quiz
function QuizEditor({ quiz, onBack }: { quiz: any; onBack: () => void }) {
    const [title, setTitle] = useState(quiz.title);
    const [questions, setQuestions] = useState<any[]>(
        Array.isArray(quiz.questions) ? quiz.questions : []
    );
    const [isSaving, setIsSaving] = useState(false);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now().toString(),
                text: '',
                options: ['', '', '', ''],
                correctAnswers: [0] // Array of correct option indices
            }
        ]);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
        setQuestions(newQuestions);
    };

    const deleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Need to update local quiz state first if we want immediate feedback, 
            // but we are relying on fetch. 
            // Note: The backend endpoint might be /quizzes/:id
            await fetchAPI(`/quizzes/${quiz.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title,
                    questions: questions.map(q => ({
                        text: q.text,
                        options: q.options,
                        correctAnswers: q.correctAnswers !== undefined ? q.correctAnswers : (q.correctAnswer !== undefined ? [q.correctAnswer] : [])
                    }))
                })
            });
            onBack();
        } catch (error) {
            console.error("Failed to save quiz", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 gap-1 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Quiz
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0" dir="ltr">
                <div dir="rtl">
                    <label className="block text-sm font-medium mb-2">عنوان الاختبار</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                </div>

                <div className="space-y-6 flex flex-col min-h-max pb-10" dir="rtl">
                    {questions.map((q, qIndex) => {
                        const currentAnswers = q.correctAnswers !== undefined ? q.correctAnswers : (q.correctAnswer !== undefined ? [q.correctAnswer] : []);
                        return (
                            <div key={q.id || qIndex} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {qIndex + 1}</span>
                                    <button
                                        onClick={() => deleteQuestion(qIndex)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={q.text}
                                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                        placeholder="Enter your question here..."
                                        className="w-full text-lg font-medium bg-transparent border-b border-slate-200 dark:border-slate-700 pb-2 focus:ring-0 focus:border-blue-500 placeholder-slate-300 outline-none transition-colors"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {q.options.map((option: string, oIndex: number) => (
                                        <div key={oIndex} className="flex items-center gap-3">
                                            <div
                                                onClick={() => {
                                                    if (currentAnswers.includes(oIndex)) {
                                                        updateQuestion(qIndex, 'correctAnswers', currentAnswers.filter((a: number) => a !== oIndex));
                                                    } else {
                                                        updateQuestion(qIndex, 'correctAnswers', [...currentAnswers, oIndex]);
                                                    }
                                                }}
                                                className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${currentAnswers.includes(oIndex) ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 hover:border-slate-400'}`}
                                            >
                                                {currentAnswers.includes(oIndex) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                            </div>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                placeholder={`الخيار ${oIndex + 1}`}
                                                className={`flex-1 px-4 py-2 rounded-lg border text-sm outline-none transition-all ${currentAnswers.includes(oIndex) ? 'border-green-200 bg-green-50 dark:bg-green-900/10 focus:border-green-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    <button
                        onClick={addQuestion}
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all font-medium flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> إضافة سؤال جديد
                    </button>
                </div>
            </div>
        </div>
    );
}
