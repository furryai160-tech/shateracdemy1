
export class CreateEnrollmentDto {
    courseId: string;
    userId: string; // Typically inferred from JWT, but good to have DTO structure
}
