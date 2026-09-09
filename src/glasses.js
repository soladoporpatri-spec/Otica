import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const finishes = {
    navy: { color: 0x16334d, name: 'Azul profundo' },
    honey: { color: 0x8c461c, name: 'Âmbar' },
    graphite: { color: 0x24282c, name: 'Grafite' },
};

// Original rounded acetate frame, built in actual 3D rather than a flat image.
function outline(scale = 1) {
    const shape = new THREE.Shape();
    shape.moveTo(-.98 * scale, .58 * scale);
    shape.bezierCurveTo(-.56 * scale, .7 * scale, .65 * scale, .7 * scale, 1.01 * scale, .52 * scale);
    shape.bezierCurveTo(1.08 * scale, .22 * scale, .91 * scale, -.47 * scale, .62 * scale, -.58 * scale);
    shape.bezierCurveTo(.2 * scale, -.73 * scale, -.67 * scale, -.68 * scale, -.86 * scale, -.42 * scale);
    shape.bezierCurveTo(-1.03 * scale, -.15 * scale, -1.1 * scale, .3 * scale, -.98 * scale, .58 * scale);
    return shape;
}

export function createGlasses({ finish = 'navy', clear = false } = {}) {
    const model = new THREE.Group();
    const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: finishes[finish].color, roughness: .22, metalness: .08, clearcoat: 1, clearcoatRoughness: .12,
    });
    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: clear ? 0xb8d7e4 : 0x263e44,
        roughness: .09, metalness: .15, transparent: true, opacity: clear ? .28 : .86,
        side: THREE.DoubleSide, depthWrite: false, clearcoat: 1,
    });
    const detailMaterial = new THREE.MeshStandardMaterial({ color: 0xc1b79a, metalness: .9, roughness: .23 });
    const outer = outline();
    const hole = new THREE.Path(outline(.82).getPoints(48).reverse());
    outer.holes.push(hole);
    const frameGeometry = new THREE.ExtrudeGeometry(outer, { depth: .16, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .045, bevelThickness: .04, curveSegments: 24 });
    const lensGeometry = new THREE.ShapeGeometry(outline(.835), 32);
    for (const side of [-1, 1]) {
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.x = side * 1.19;
        frame.rotation.y = -side * .065;
        model.add(frame);
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.set(side * 1.19, 0, .07);
        lens.rotation.y = -side * .065;
        model.add(lens);
        const hinge = new THREE.Mesh(new THREE.BoxGeometry(.2, .15, .25), frameMaterial);
        hinge.position.set(side * 2.22, .36, -.025); model.add(hinge);
        for (const offset of [-.045, .045]) {
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(.028, 10, 8), detailMaterial);
            rivet.scale.set(1.8, .8, .35);
            rivet.position.set(side * 2.01, .42 + offset, .26); model.add(rivet);
        }
        const templeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(side * 2.22, .36, 0), new THREE.Vector3(side * 2.26, .35, -.6),
            new THREE.Vector3(side * 2.19, .29, -2.5), new THREE.Vector3(side * 2.05, .09, -3.03),
            new THREE.Vector3(side * 1.94, -.23, -3.22),
        ]);
        const temple = new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 32, .067, 8, false), frameMaterial);
        model.add(temple);
        const accent = new THREE.Mesh(new THREE.BoxGeometry(.015, .058, .3), detailMaterial);
        accent.position.set(side * 2.33, .35, -.45); model.add(accent);
    }
    const bridgeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-.28, .26, .08), new THREE.Vector3(-.15, .36, .11),
        new THREE.Vector3(.15, .36, .11), new THREE.Vector3(.28, .26, .08),
    ]);
    model.add(new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 20, .085, 10, false), frameMaterial));
    model.userData.frameMaterial = frameMaterial;
    return model;
}

export function createStudio(canvas, options = {}) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: Boolean(options.capture), powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, .1, 100);
    camera.position.set(0, 1, 11.8); camera.lookAt(0, 0, -.5);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xe3efff, 0x65768a, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 4.5); key.position.set(-3, 6, 7); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc2d9fa, 3); rim.position.set(4, 2, -3); scene.add(rim);
    const model = createGlasses(options); scene.add(model);
    model.rotation.set(.12, -.36, -.12);
    const pivot = new THREE.Group();
    scene.remove(model); pivot.add(model); scene.add(pivot);
    model.position.z = .8;
    function resize(width, height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = camera.aspect < 1.1 ? 13.8 : 11.6;
        camera.updateProjectionMatrix();
    }
    function render() { renderer.render(scene, camera); }
    function dispose() {
        const geometries = new Set(); const materials = new Set();
        scene.traverse(object => {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
        });
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
        environment.dispose(); renderer.dispose();
    }
    return { renderer, scene, camera, model, pivot, key, rim, resize, render, dispose };
}

export function initGlasses(stage, onFallback) {
    const canvas = stage.querySelector('canvas');
    let studio;
    try { studio = createStudio(canvas); } catch { onFallback(); return () => {}; }
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const toggle = document.querySelector('#motion-toggle');
    const swatches = [...document.querySelectorAll('[data-color]')];
    const rotateButtons = [...document.querySelectorAll('[data-rotate]')];
    const events = new AbortController();
    let paused = motionPreference.matches;
    let inView = true; let frame = 0; let disposed = false; let lost = false;
    let dragging = false; let lastX = 0; let lastY = 0;
    let angleX = 0; let angleY = 0; let phase = 0; let lastTime = 0;
    let pointerX = 0; let pointerY = 0; let pointerTargetX = 0; let pointerTargetY = 0;
    let scrollLight = 0; let scrollLightTarget = 0;
    let finishTarget = studio.model.userData.frameMaterial.color.clone();
    let finishChanging = false;
    const baseX = studio.model.rotation.x; const baseY = studio.model.rotation.y;
    function render(time = 0) {
        frame = 0;
        if (disposed || lost || !inView || document.hidden) return;
        const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
        lastTime = time;
        if (!paused && !dragging) phase += delta;
        const ease = 1 - Math.exp(-Math.max(delta, .016) * 7);
        pointerX += (pointerTargetX - pointerX) * ease;
        pointerY += (pointerTargetY - pointerY) * ease;
        scrollLight += (scrollLightTarget - scrollLight) * ease;
        studio.model.rotation.y = baseY + angleY + (paused ? 0 : Math.sin(phase * .48) * .2) + pointerX * .13;
        studio.model.rotation.x = baseX + angleX + pointerY * .08;
        studio.pivot.position.y = paused ? 0 : Math.sin(phase * .8) * .075;
        studio.key.position.x = -3 + scrollLight * 5;
        studio.key.intensity = 4.5 + scrollLight * 1.2;
        studio.rim.intensity = 3.2 - scrollLight * .7;
        if (finishChanging) {
            studio.model.userData.frameMaterial.color.lerp(finishTarget, ease * 1.45);
            const colorDelta = Math.abs(studio.model.userData.frameMaterial.color.r - finishTarget.r)
                + Math.abs(studio.model.userData.frameMaterial.color.g - finishTarget.g)
                + Math.abs(studio.model.userData.frameMaterial.color.b - finishTarget.b);
            if (colorDelta < .012) {
                studio.model.userData.frameMaterial.color.copy(finishTarget);
                finishChanging = false;
                stage.removeAttribute('data-finish-changing');
            }
        }
        studio.render();
        const pointerSettling = Math.abs(pointerTargetX - pointerX) + Math.abs(pointerTargetY - pointerY) > .002;
        const lightSettling = Math.abs(scrollLightTarget - scrollLight) > .002;
        if ((!paused && !dragging) || pointerSettling || lightSettling || finishChanging) frame = requestAnimationFrame(render);
    }
    function requestRender() { if (!frame && !disposed && !lost) frame = requestAnimationFrame(render); }
    function updatePause() {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação');
        toggle.innerHTML = `<span aria-hidden="true">${paused ? '▷' : 'Ⅱ'}</span>`;
        cancelAnimationFrame(frame); frame = 0; lastTime = 0; requestRender();
    }
    const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; } else requestRender();
    }, { threshold: .05 });
    observer.observe(stage);
    const resizeObserver = new ResizeObserver(() => {
        if (disposed || lost) return;
        studio.resize(stage.clientWidth, stage.clientHeight); requestRender();
    });
    resizeObserver.observe(stage);
    toggle.addEventListener('click', () => { paused = !paused; updatePause(); }, { signal: events.signal });
    rotateButtons.forEach(button => {
        button.disabled = false;
        button.addEventListener('click', () => { angleY += Number(button.dataset.rotate) * .25; requestRender(); }, { signal: events.signal });
    });
    motionPreference.addEventListener('change', () => {
        paused = motionPreference.matches;
        if (paused) {
            pointerX = pointerTargetX = 0;
            pointerY = pointerTargetY = 0;
            scrollLight = scrollLightTarget;
            studio.model.userData.frameMaterial.color.copy(finishTarget);
            finishChanging = false;
            stage.removeAttribute('data-finish-changing');
        }
        updatePause();
    }, { signal: events.signal });
    swatches.forEach(button => {
        button.disabled = false;
        button.addEventListener('click', () => {
            const selected = finishes[button.dataset.color];
            finishTarget = new THREE.Color(selected.color);
            finishChanging = !motionPreference.matches;
            if (finishChanging) stage.setAttribute('data-finish-changing', 'true');
            else {
                studio.model.userData.frameMaterial.color.copy(finishTarget);
                stage.removeAttribute('data-finish-changing');
            }
            swatches.forEach(swatch => swatch.setAttribute('aria-pressed', String(swatch === button)));
            document.querySelector('#finish-name').textContent = selected.name;
            requestRender();
        }, { signal: events.signal });
    });
    canvas.addEventListener('pointerdown', event => {
        dragging = true; lastX = event.clientX; lastY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
    }, { signal: events.signal });
    canvas.addEventListener('pointermove', event => {
        if (dragging) {
            angleY += (event.clientX - lastX) * .009;
            angleX = THREE.MathUtils.clamp(angleX + (event.clientY - lastY) * .005, -.6, .6);
            lastX = event.clientX; lastY = event.clientY;
        } else if (!motionPreference.matches) {
            const rect = canvas.getBoundingClientRect();
            pointerTargetX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
            pointerTargetY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
        }
        requestRender();
    }, { signal: events.signal });
    canvas.addEventListener('pointerleave', () => {
        pointerTargetX = 0; pointerTargetY = 0; requestRender();
    }, { signal: events.signal });
    const endDrag = () => { dragging = false; requestRender(); };
    canvas.addEventListener('pointerup', endDrag, { signal: events.signal });
    canvas.addEventListener('pointercancel', endDrag, { signal: events.signal });
    canvas.addEventListener('lostpointercapture', endDrag, { signal: events.signal });
    canvas.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'ArrowLeft') angleY -= .16;
        if (event.key === 'ArrowRight') angleY += .16;
        if (event.key === 'ArrowUp') angleX = Math.max(-.6, angleX - .1);
        if (event.key === 'ArrowDown') angleX = Math.min(.6, angleX + .1);
        if (event.key === 'Home') { angleX = 0; angleY = 0; }
        requestRender();
    }, { signal: events.signal });
    document.addEventListener('visibilitychange', () => {
        cancelAnimationFrame(frame); frame = 0; lastTime = 0;
        if (!document.hidden) requestRender();
    }, { signal: events.signal });
    window.addEventListener('scroll', () => {
        if (motionPreference.matches) return;
        const rect = stage.getBoundingClientRect();
        scrollLightTarget = THREE.MathUtils.clamp((stage.offsetTop - scrollY) / Math.max(stage.clientHeight, 1), -.15, .85);
        if (rect.bottom > 0 && rect.top < innerHeight) requestRender();
    }, { passive: true, signal: events.signal });
    canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0;
        stage.classList.remove('ready'); onFallback();
    }, { signal: events.signal });
    studio.resize(stage.clientWidth, stage.clientHeight);
    studio.render();
    stage.classList.add('ready'); stage.setAttribute('aria-busy', 'false');
    toggle.disabled = false; updatePause();
    return () => {
        disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); events.abort(); studio.dispose();
    };
}
