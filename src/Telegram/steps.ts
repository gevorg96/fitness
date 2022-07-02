export interface Step {
    fullPath: string,
    prev: string
}

export const refreshSteps = (current: string, next: string): Step => {
    let stepInfo = parseStepInfo(current)
    
    let parts = stepInfo.fullPath.split(';');
    let idx = parts.indexOf(next);
    if (idx >= 0 && idx !== (parts.length - 1)) {
        parts = parts.slice(0, idx + 1)
    }
    if (parts.indexOf(next) < 0) {
        parts.push(next)
    }
    
    let prev = parts[parts.length - 2];
    return {fullPath: parts.join(';'), prev: prev}
}

export const parseStepInfo = (json: string) => {
    let res: Step = JSON.parse(json)
    return res;
}

export const initStepInfo = (current: string) => {
    let info: Step = {fullPath: current, prev: current}
    
    return info;
}