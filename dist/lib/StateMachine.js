const generateActionEventName = (action) => {
    return ['on']
        .concat(action
        .split('_')
        .map((i) => i
        .toLowerCase()
        .replace(/^[a-z]/i, (m) => m.toUpperCase())))
        .join('');
};
const createActionsMap = (transitions, handlers) => {
    const hash = new Map();
    transitions.forEach(transition => {
        hash.set(transition.action, handlers[generateActionEventName(transition.action)]);
    });
    return hash;
};
class StateMachine {
    constructor(config) {
        this.initial = config.initial;
        this.transitions = config.transitions;
        this.handlers = config.handlers;
        this.substates = config.substates;
        this.store = config.store;
        this.actionHandlerHash = createActionsMap(this.transitions, this.handlers);
        this.currentState = config.initial;
    }
    dispatch(action, payload) {
        const transition = this.transitions.find((t) => t.action === action);
        if (transition?.from !== this.currentState)
            return this.currentState;
        this.currentState = transition.to;
        return this.actionHandlerHash.get(action).call(this, this.currentState, payload);
    }
    enterSubstate(state, payload) {
        const sub = this.substates.find((s) => s.initial === state);
        if (!sub)
            return state;
        sub.currentParent = this;
        return sub.handlers.onEnter.call(sub, sub.initial, payload);
    }
    exitSubstate() {
        const parent = this.currentParent;
        const transition = parent.transitions.find((t) => t.from === parent.currentState);
        return parent.dispatch(transition.action);
    }
}
const createStateMachine = (config) => new StateMachine(config);
export default createStateMachine;
//# sourceMappingURL=StateMachine.js.map