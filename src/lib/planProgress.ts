export type StepState = 'locked' | 'available' | 'completed';
export type PlanProgress = Partial<Record<'discover' | 'train' | 'execute', StepState>>;

export function readPlanProgress(): PlanProgress {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem('planProgress') ?? '{}'); } catch { return {}; }
}
export function writePlanProgress(next: PlanProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('planProgress', JSON.stringify(next));
}

export function completeDiscoverMakeTrainAvailable() { /* как было */ }
export function completeTrainMakeExecuteAvailable() { /* как было */ }

// ✅ новое:
export function completeExecute() {
  const prev = readPlanProgress();
  writePlanProgress({ ...prev, execute: 'completed' });
}