export function formatDate(date) {
    const iso = date.toISOString();
    const parts = iso.split(':')[0].split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`.split('T')[1];
}
