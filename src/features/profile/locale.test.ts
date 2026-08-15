import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Spanish locale has a stable persistence key and translated HUD vocabulary', () => {
    const localeSource = readFileSync(new URL('./locale.tsx', import.meta.url), 'utf8');
    assert.ok(localeSource.includes("LOCALE_STORAGE_KEY = 'unibelands3.locale.v1'"));
    for (const expected of ['Objetivo fijado', 'Mayús + clic para copiar', 'Diseñador de videojuegos', 'Abrir controles de música']) {
        assert.ok(localeSource.includes(expected), `missing Spanish translation: ${expected}`);
    }
});

test('world HUD source does not retain known English functional labels', () => {
    const source = readFileSync(new URL('../InteractionSystem.tsx', import.meta.url), 'utf8');
    for (const legacyLabel of ['>TARGET LOCKED<', '>SHIFT + CLICK TO COPY<', '>OBJECT IDENTIFIER<', '>COPIED<']) {
        assert.equal(source.includes(legacyLabel), false, `legacy HUD label remains: ${legacyLabel}`);
    }
});

test('signal tracker uses localized status keys instead of visible instructions', () => {
    const source = readFileSync(new URL('../experience/MissionTracker.tsx', import.meta.url), 'utf8');
    assert.ok(source.includes("t('resetProgress')"));
    assert.ok(source.includes("t('resolved')"));
    assert.ok(source.includes("t('available')"));
    for (const visibleInstruction of ['Visita el sector Norte.', 'Inspect a tool in Stack.', '>Reiniciar<']) {
        assert.equal(source.includes(visibleInstruction), false, `tracker retains visible instruction: ${visibleInstruction}`);
    }
});

test('Capability Map renders its functional vocabulary through the locale context', () => {
    const localeSource = readFileSync(new URL('./locale.tsx', import.meta.url), 'utf8');
    const mapSource = readFileSync(new URL('../LootMapScreen/index.tsx', import.meta.url), 'utf8');
    for (const expected of ['Mapa de trayectoria', 'Trayectoria profesional y evidencia local corroborada', 'Evidencia local corroborada']) {
        assert.ok(localeSource.includes(expected), `missing Capability Map translation: ${expected}`);
    }
    for (const key of ["t('capabilityMapNavigation')", "t('capabilityMapEducation')", "t('capabilityMapOpenProjects')"]) {
        assert.ok(mapSource.includes(key), `Capability Map must use ${key}`);
    }
    for (const legacyLabel of ['>CAPABILITY MAP<', '>CONEXIONES ENTRE TRABAJO Y EVIDENCIA<', '>ABRIR CONTACTO<']) {
        assert.equal(mapSource.includes(legacyLabel), false, `legacy Capability Map label remains: ${legacyLabel}`);
    }
});
