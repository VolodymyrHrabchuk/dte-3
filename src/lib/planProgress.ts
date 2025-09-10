// lib/planProgress.ts
export type StepState = "locked" | "available" | "completed";
export type PlanProgress = {
  discover: StepState;
  train: StepState;
  execute: StepState;
};

const KEY = "planProgress";
const JUST_FINISHED_KEY = "__just_finished_all_done";

function defaultState(): PlanProgress {
  return { discover: "available", train: "locked", execute: "locked" };
}

export function readPlanProgress(): PlanProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<PlanProgress>;
    return {
      discover: parsed.discover ?? "available",
      train: parsed.train ?? "locked",
      execute: parsed.execute ?? "locked",
    };
  } catch {
    return defaultState();
  }
}

function writePlanProgress(p: PlanProgress) {
  localStorage.setItem(KEY, JSON.stringify(p));

  window.dispatchEvent(new CustomEvent("planprogress:updated"));
}

/** DISCOVER → TRAIN available */
export function completeDiscoverMakeTrainAvailable() {
  const p = readPlanProgress();
  writePlanProgress({ ...p, discover: "completed", train: "available" });
}

/** TRAIN → EXECUTE available */
export function completeTrainMakeExecuteAvailable() {
  const p = readPlanProgress();
  writePlanProgress({ ...p, train: "completed", execute: "available" });
}

/** EXECUTE completed */
export function completeExecuteMarkAllCompleted() {
  const p = readPlanProgress();
  writePlanProgress({ ...p, execute: "completed" });
  try {
    sessionStorage.setItem(JUST_FINISHED_KEY, "1");
  } catch {}
}


export function completeExecute() {
  completeExecuteMarkAllCompleted();
}


export function resetAllProgress() {
  try {
    localStorage.removeItem("answers");
    // попап-флаги текущей сессии
    sessionStorage.removeItem("__train_popup_once");
    sessionStorage.removeItem("__execute_popup_once");
  } catch {}
  writePlanProgress(defaultState());
}


export function consumeJustFinishedFlag(): boolean {
  try {
    if (sessionStorage.getItem(JUST_FINISHED_KEY) === "1") {
      sessionStorage.removeItem(JUST_FINISHED_KEY);
      return true;
    }
  } catch {}
  return false;
}