import test from 'node:test';
import assert from 'node:assert/strict';
import { isOpen, whatsappUrl, mapsUrl } from '../src/business.js';

test('weekday boundaries use São Paulo time rather than browser timezone', () => {
    assert.equal(isOpen(new Date('2026-09-08T10:59:00Z')), false);
    assert.equal(isOpen(new Date('2026-09-08T11:00:00Z')), true);
    assert.equal(isOpen(new Date('2026-09-08T20:59:00Z')), true);
    assert.equal(isOpen(new Date('2026-09-08T21:00:00Z')), false);
});
test('Saturday closes at 13:30 and Sunday stays closed', () => {
    assert.equal(isOpen(new Date('2026-09-12T16:29:00Z')), true);
    assert.equal(isOpen(new Date('2026-09-12T16:30:00Z')), false);
    assert.equal(isOpen(new Date('2026-09-13T15:00:00Z')), false);
});
test('WhatsApp preserves supplied number and safely encodes accented message', () => {
    const url = new URL(whatsappUrl('Olá! Óculos de grau & lentes?'));
    assert.equal(url.pathname, '/556291535619');
    assert.equal(url.searchParams.get('text'), 'Olá! Óculos de grau & lentes?');
});
test('Maps points to the supplied store address', () => {
    assert.match(new URL(mapsUrl).searchParams.get('destination'), /361.*Anápolis/);
});
