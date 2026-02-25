
export class CreateCourseDto {
    title: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    tenantId: string;
    gradeLevel?: string;
}

