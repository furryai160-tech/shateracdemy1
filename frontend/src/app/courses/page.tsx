'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, User, Loader2 } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

export default function CourseCatalog() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        async function loadCourses() {
            try {
                // In a real app, this should be a public endpoint /public/courses that doesn't need auth
                // For MVP, we'll use the existing /courses endpoint (protected) or update it to be public for GET
                // Let's assume we update the backend controller or use a try/catch if unauthorized.
                // Or better: Let's create a public endpoint logic assumption.
                // Currently, `CoursesController` has `@UseGuards(AuthGuard('jwt'))`.
                // Students should be able to browse without logging in? usually yes.
                // We'll address backend auth in a moment. For now let's build the page.
                const data = await fetchAPI('/courses');
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setLoading(false);
            }
        }
        loadCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase());
        // const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <span className="font-bold text-lg dark:text-white">El Shate' Academy</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600">Log In</Link>
                        <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Sign Up</Link>
                    </div>
                </div>
            </header>

            {/* Search & Filter Section */}
            <div className="bg-white dark:bg-slate-800 py-12 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Explore Our Courses</h1>
                    <p className="text-slate-500 mb-8 max-w-2xl mx-auto">Discover a wide range of courses designed to help you start your career, learn a new skill, or pursue your passion.</p>

                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="What do you want to learn?"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-lg shadow-lg shadow-slate-200/50 dark:shadow-none transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {['All', 'Programming', 'Design', 'Marketing', 'Business'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${(cat === 'All' && !selectedCategory) || selectedCategory === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCourses.map((course) => (
                            <Link href={`/courses/${course.id}`} key={course.id}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all h-full flex flex-col group"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            {course.price > 0 ? `$${course.price}` : 'Free'}
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-3 uppercase tracking-wide">
                                            <span className="bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Development</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                                            {course.description || "No description available."}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>1.2k Students</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                <span>{course.lessons?.length || 0} Lessons</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BookOpen className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No courses found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
