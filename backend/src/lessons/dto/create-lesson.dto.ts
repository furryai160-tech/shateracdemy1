
export class CreateLessonDto {
    title: string;
    description?: string;
    order?: number;
    courseId: string;
    videoId?: string;
    videoProvider?: 'VDOCIPHER' | 'BUNNY' | 'YOUTUBE' | 'LOCAL';
    videoDuration?: number;
    isFree?: boolean;
    dripDelay?: number;
}
