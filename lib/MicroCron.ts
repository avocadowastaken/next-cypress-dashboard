export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;

export function scheduleCron(
  every: typeof ONE_SECOND | typeof ONE_MINUTE | typeof ONE_HOUR,
  fn: () => void
): () => void {
  const startDelay = Date.now() % every;
  let intervalID: number | undefined = undefined;
  let timeoutID: number | undefined = window.setTimeout(() => {
    fn();
    timeoutID = undefined;
    intervalID = window.setInterval(fn, 0);
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
