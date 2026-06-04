// Unit tests for TaskListComponent
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './project-tasks-list.coffee';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter tasks by status correctly', () => {
    component.tasks = [
      { id: 1, status: 'In Progress', name: 'Task A' },
      { id: 2, status: 'Complete', name: 'Task B' },
      { id: 3, status: 'In Progress', name: 'Task C' }
    ];

    component.onStatusFilterChange('In Progress');
    
    expect(component.filteredTasks.length).toBe(2);
    expect(component.filteredTasks.every(t => t.status === 'In Progress')).toBeTrue();
  });
});