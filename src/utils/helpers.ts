export const formatScore = (score: number): string => {
    return score.toLocaleString();
};

export const calculateWinningPercentage = (wins: number, losses: number): number => {
    if (wins + losses === 0) return 0;
    return (wins / (wins + losses)) * 100;
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};

export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};