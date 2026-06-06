type Pauser = () => void;

let current: Pauser | null = null;

export function register(pauser: Pauser): () => void {
  if (current && current !== pauser) {
    try {
      current();
    } catch {
      // Ignore: previous instance may already be torn down.
    }
  }
  current = pauser;
  return () => {
    if (current === pauser) current = null;
  };
}

export function isCurrent(pauser: Pauser): boolean {
  return current === pauser;
}
