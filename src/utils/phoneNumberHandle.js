export default function formatVNPhoneNumber(number) {
    const digits = number.replace(/\D/g, '');
    if (digits.length !== 10) return number;
    return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}