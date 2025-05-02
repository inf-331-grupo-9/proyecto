const raceData = require('../../src/handlers/raceHandlers');
const { RaceModel } = require('../../src/model/race');

describe('Race Data Layer', () => {
  const mockRace = {
    _id: '1',
    name: 'Mock Race',
    location: 'Test City',
    date: '2025-01-01',
    organizer: 'Test Org',
    description: 'Test desc'
  };

  beforeEach(() => {
    spyOn(RaceModel, 'find').and.returnValue(Promise.resolve([mockRace]));
    spyOn(RaceModel, 'findById').and.returnValue(Promise.resolve(mockRace));
    spyOn(RaceModel, 'findByIdAndUpdate').and.returnValue(Promise.resolve({ ...mockRace, name: 'Updated Race' }));
    spyOn(RaceModel, 'findByIdAndDelete').and.returnValue(Promise.resolve(mockRace));
    spyOn(RaceModel.prototype, 'save').and.returnValue(Promise.resolve(mockRace));
  });

  it('should get all races', async () => {
    const result = await raceData.getAllRaces();
    expect(RaceModel.find).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Mock Race');
  });

  it('should get race by ID', async () => {
    const result = await raceData.getRaceById('1');
    expect(RaceModel.findById).toHaveBeenCalledWith('1');
    expect(result.name).toBe('Mock Race');
  });

  it('should create a new race', async () => {
    const result = await raceData.createRace(mockRace);
    expect(RaceModel.prototype.save).toHaveBeenCalled();
    expect(result.name).toBe('Mock Race');
  });

  it('should update a race', async () => {
    const updated = await raceData.updateRace('1', { name: 'Updated Race' });
    expect(RaceModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated Race' }, { new: true });
    expect(updated.name).toBe('Updated Race');
  });

  it('should delete a race', async () => {
    const result = await raceData.deleteRace('1');
    expect(RaceModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(result._id).toBe('1');
  });
});
