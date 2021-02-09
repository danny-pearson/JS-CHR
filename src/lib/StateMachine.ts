interface Transition {
  from: string;
  to: string;
  action: string;
}

type Handler = (state: string, payload?: any) => unknown;

type ActionHandlerHash = Map<string, Handler>;

interface Handlers {
  [key: string]: Handler;
}

interface StateMachineConfig {
  initial?: string;
  transitions: Transition[];
  handlers: Handlers;
  substates?: StateMachine[];
  store?;
}

const generateActionEventName = (action: string): string => {
  return ['on']
    .concat(action
      .split('_')
      .map((i) => i
        .toLowerCase()
        .replace(/^[a-z]/i, (m) => m.toUpperCase())
      ))
    .join('');
};

const createActionsMap = (transitions, handlers) => {
  const hash = new Map();

  transitions.forEach(transition => {
    hash.set(
      transition.action,
      handlers[generateActionEventName(transition.action)],
    );
  });

  return hash;
}

class StateMachine implements StateMachineConfig {
  readonly initial: string;
  readonly transitions: Transition[];
  readonly handlers: Handlers;
  readonly actionHandlerHash: ActionHandlerHash;
  readonly substates: StateMachine[];
  readonly store;
  
  private currentParent: StateMachine;
  private currentState: string;

  constructor(config: StateMachineConfig) {
    this.initial = config.initial;
    this.transitions = config.transitions;
    this.handlers = config.handlers;
    this.substates = config.substates;
    this.store = config.store;
    
    this.actionHandlerHash = createActionsMap(this.transitions, this.handlers);
    
    this.currentState = config.initial;
  }

  public dispatch(action: string, payload?: unknown) {
    const transition = this.transitions.find((t) => t.action === action);
    if (transition?.from !== this.currentState) return this.currentState;

    this.currentState = transition.to;
    return this.actionHandlerHash.get(action).call(this, this.currentState, payload);
  }

  public enterSubstate(state: string, payload?: unknown) {
    const sub = this.substates.find((s) => s.initial === state);
    if (!sub) return state;

    sub.currentParent = this;
    return sub.handlers.onEnter.call(sub, sub.initial, payload);
  }

  public exitSubstate() {
    const parent = this.currentParent;
    const transition = parent.transitions.find((t) => t.from === parent.currentState);

    return parent.dispatch(transition.action);
  }
}

const createStateMachine = (config: StateMachineConfig) => new StateMachine(config);

export default createStateMachine;