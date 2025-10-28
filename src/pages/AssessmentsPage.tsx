import { useQuery } from '@tanstack/react-query';
import { assessmentsApi, jobsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AssessmentsPage() {
  const { data: jobsData } = useQuery({
    queryKey: ['jobs', 'active'],
    queryFn: () => jobsApi.getAll({ status: 'active' }),
  });

  const jobs = jobsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage job-specific assessments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.slice(0, 6).map((job: any) => (
          <AssessmentCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function AssessmentCard({ job }: { job: any }) {
  const { data: assessmentsData } = useQuery({
    queryKey: ['assessments', job.id],
    queryFn: () => assessmentsApi.getByJobId(job.id),
  });

  const assessments = assessmentsData?.data || [];
  const hasAssessment = assessments.length > 0;
  const assessment = assessments[0];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>
          {hasAssessment ? `${assessment.sections.length} sections` : 'No assessment yet'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasAssessment ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>
                {assessment.sections.reduce((acc: number, s: any) => acc + s.questions.length, 0)} questions
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Updated {format(new Date(assessment.updatedAt), 'MMM dd, yyyy')}
              </span>
            </div>
            <Button variant="outline" className="w-full">
              Edit Assessment
            </Button>
          </>
        ) : (
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
