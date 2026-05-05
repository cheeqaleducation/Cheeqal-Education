
export type View = 'dashboard' | 'generator' | 'materi' | 'settings';

export interface ModulAjar {
  id: string;
  title: string;
  subject: string;
  grade: string;
  curriculum: string;
  createdAt: string;
  content: string;
}

export interface TeacherProfile {
  name: string;
  school: string;
  subjects: string[];
}
