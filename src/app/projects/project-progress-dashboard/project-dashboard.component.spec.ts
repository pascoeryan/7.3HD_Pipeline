// Edge cases and error handling tests for OnTrack dashboard (submission and deadline handling)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDashboardComponent } from './project-progress-dashboard.coffee';

describe('ProjectDashboardComponent - Edge Cases', () => {
  let component: ProjectDashboardComponent;
  let fixture: ComponentFixture<ProjectDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should prevent submission when deadline has passed', () => {
    const pastProject = {
      id: 99,
      dueDate: '01/06/2026',   // Past date
      status: 'Not Started'
    } as any;

    component.currentProject = pastProject;
    const canSubmit = component.canMakeSubmission();

    expect(canSubmit).toBeFalse();
    expect(component.submissionError).toContain('deadline');
  });

  it('should allow submission when deadline is still open', () => {
    const futureProject = {
      id: 100,
      dueDate: '25/07/2026',   // Future date
      status: 'Not Started'
    } as any;

    component.currentProject = futureProject;
    expect(component.canMakeSubmission()).toBeTrue();
  });
});