// Project service unit test
import { TestBed } from '@angular/core/testing';
import { ProjectService } from './services.coffee';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should create a new project with correct default values', () => {
    const project = service.createNewProject(5, 'Heavy');
    
    expect(project).toBeTruthy();
    expect(project.unitId).toBe(5);
    expect(project.targetGrade).toBe('Heavy');
    expect(project.status).toBe('Not Started');
  });

  it('should calculate project progress correctly', () => {
    const project = { tasksCompleted: 4, totalTasks: 10 } as any;
    expect(service.calculateProgress(project)).toBe(40);
  });
});