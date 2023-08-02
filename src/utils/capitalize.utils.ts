export const capitalizeString = (string: string): string => {
    return string.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}