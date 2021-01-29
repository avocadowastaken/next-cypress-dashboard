export abstract class Injectable {
  protected container: DependencyContainer;

  public constructor(container: DependencyContainer) {
    this.container = container;
  }
}

interface DependencyConstructor<T extends Injectable = Injectable> {
  new (container: DependencyContainer): T;
}

function formatKey(key: DependencyConstructor): string {
  return JSON.stringify(key.name);
}

export class DependencyContainer {
  protected resolveStack?: Set<DependencyConstructor>;
  protected injected = new Map<DependencyConstructor, Injectable>();

  inject<T extends Injectable>(key: DependencyConstructor<T>, value: T): this {
    this.injected.set(key, value);

    return this;
  }

  eject<T extends Injectable>(key: DependencyConstructor<T>): this {
    this.injected.delete(key);

    return this;
  }

  resolve<T extends Injectable>(Class: DependencyConstructor<T>): T {
    let cls = this.injected.get(Class) as undefined | T;

    if (!cls) {
      const isRootCall = !this.resolveStack;

      if (!this.resolveStack) {
        this.resolveStack = new Set();
      }

      if (this.resolveStack.has(Class)) {
        const stack = Array.from(this.resolveStack, formatKey);

        stack.push(formatKey(Class));

        this.resolveStack = undefined;

        throw new Error(
          `DependencyContainer: circular dependency found: ${stack.join(
            " -> "
          )}`
        );
      }

      this.resolveStack.add(Class);

      cls = new Class(this);

      if (isRootCall) {
        this.resolveStack = undefined;
      }

      this.injected.set(Class, cls);
    }

    return cls;
  }
}
