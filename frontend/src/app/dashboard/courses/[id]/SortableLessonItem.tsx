'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Video, FileText, Trash2, Pencil } from 'lucide-react';

interface SortableLessonItemProps {
    lesson: any;
    index: number;
    onEdit: (lesson: any) => void;
    onDelete: (id: string) => void;
}

export function SortableLessonItem({ lesson, index, onEdit, onDelete }: SortableLessonItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors mb-3"
        >
            <div
                {...attributes}
                {...listeners}
                className="text-slate-400 cursor-move hover:text-slate-600 focus:outline-none"
            >
                <GripVertical size={20} />
            </div>

            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                {index + 1}
            </div>

            <div className="flex-1">
                <h3 className="font-medium text-slate-800 dark:text-slate-200">{lesson.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                        <Video size={12} className={lesson.videoId ? "text-green-500" : "text-slate-400"} />
                        {lesson.videoDuration ? `${Math.round(lesson.videoDuration / 60)}m Video` : 'No Content'}
                    </span>
                    <span className="flex items-center gap-1">
                        {lesson.isFree ? (
                            <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">Free Preview</span>
                        ) : (
                            <span className="text-slate-400">Locked</span>
                        )}
                    </span>
                </div>
            </div>

            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <button
                    onClick={() => onEdit(lesson)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => onDelete(lesson.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
