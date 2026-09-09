export const business = Object.freeze({
    name: 'Ótica Vip',
    phone: '+55 62 9153-5619',
    whatsapp: '556291535619',
    address: 'R. 7 de Setembro, 361 - St. Central, Anápolis - GO',
});

export function whatsappUrl(message = 'Olá, Ótica Vip! Gostaria de conhecer as opções de óculos.') {
    return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`;

export function isOpen(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date);
    const value = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const minutes = Number(value.hour) * 60 + Number(value.minute);
    return value.weekday !== 'Sun' && minutes >= 480 && minutes < (value.weekday === 'Sat' ? 810 : 1080);
}
