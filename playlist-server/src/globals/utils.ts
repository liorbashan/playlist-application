export function getEnvironmentVariable(key: string, defaultValue?: string): string {
    return process.env[key] || (defaultValue as string);
}

export function toNumber(value: string): number {
    return parseInt(value, 10);
}
