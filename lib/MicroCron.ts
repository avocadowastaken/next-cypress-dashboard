export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;

export function scheduleCron(
  step: typeof ONE_SECOND | typeof ONE_MINUTE | typeof ONE_HOUR,
  job: () => void
): () => void {
  const startDelay = Date.now() % step;
  let intervalID: number | undefined = undefined;
  let timeoutID: number | undefined = window.setTimeout(() => {
    timeoutID = undefined;
    intervalID = window.setInterval(job, 0);
    job();
  }, startDelay);

  return () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    if (intervalID) {
      clearInterval(intervalID);
    }
  };
}
