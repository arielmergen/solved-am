import { prisma } from '../../index';
import { HistoryService } from '../../services/history.service';
import { CandidateStatus, ChangeRecord } from '../../types/candidate.types';

describe('History Service', () => {
  let historyService: HistoryService;

  beforeAll(() => {
    historyService = new HistoryService();
  });

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.candidateHistory.deleteMany(),
      prisma.candidate.deleteMany()
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createBasicCandidate = async () => {
    return await prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: `test.${Date.now()}.${Math.random()}@example.com`,
        status: CandidateStatus.DRAFT
      }
    });
  };

  it('should track changes when valid data is provided', async () => {
    const candidate = await createBasicCandidate();
    const changes: ChangeRecord[] = [
      {
        field: 'firstName',
        oldValue: candidate.firstName,
        newValue: 'Jane'
      }
    ];

    await historyService.trackChanges(candidate.id, changes);

    const history = await prisma.candidateHistory.findMany({
      where: { candidateId: candidate.id }
    });

    expect(history).toHaveLength(1);
    expect(JSON.parse(history[0].changes as string)).toEqual(changes);
  });

  it('should handle non-existent candidate', async () => {
    const nonExistentId = 999;
    const changes: ChangeRecord[] = [
      {
        field: 'firstName',
        oldValue: 'John',
        newValue: 'Jane'
      }
    ];

    await expect(
      historyService.trackChanges(nonExistentId, changes)
    ).rejects.toThrow('Candidate not found');
  });

  it('should handle database errors', async () => {
    const candidate = await createBasicCandidate();
    
    jest.spyOn(prisma.candidateHistory, 'create').mockRejectedValueOnce(
      new Error('DB Error')
    );

    const changes: ChangeRecord[] = [
      {
        field: 'firstName',
        oldValue: candidate.firstName,
        newValue: 'Jane'
      }
    ];

    await expect(
      historyService.trackChanges(candidate.id, changes)
    ).rejects.toThrow('Failed to track changes');
  });

  it('should handle invalid changes format', async () => {
    const candidate = await createBasicCandidate();
    const invalidChanges = [{ invalid: 'format' }] as any;

    await expect(
      historyService.trackChanges(candidate.id, invalidChanges)
    ).rejects.toThrow('Invalid changes format');
  });

  it('should handle empty changes array', async () => {
    const candidate = await createBasicCandidate();

    await expect(
      historyService.trackChanges(candidate.id, [])
    ).resolves.not.toThrow();

    const history = await prisma.candidateHistory.findMany({
      where: { candidateId: candidate.id }
    });

    expect(history).toHaveLength(0);
  });
}); 