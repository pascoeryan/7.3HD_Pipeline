// CRUD and integration tests for UnitService
import { TestBed } from '@angular/core/testing';
import { UnitService } from './unit.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UnitService - Integration', () => {
  let service: UnitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnitService]
    });
    service = TestBed.inject(UnitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve enrolled units for current student', () => {
    const mockUnits = [{ id: 1, code: 'SIT223', name: 'Professional Practice in IT' }];

    service.getUnitsForStudent().subscribe(units => {
      expect(units).toEqual(mockUnits);
    });

    const req = httpMock.expectOne('/api/units?enrolled=true');
    expect(req.request.method).toBe('GET');
    req.flush(mockUnits);
  });
});