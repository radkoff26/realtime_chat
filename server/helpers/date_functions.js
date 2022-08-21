const day = 24 * 60 * 60 * 1000

export function dayPassed(timeInMillis) {
    return Date.now() - timeInMillis >= day
}