import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useGameStore, LEVEL_THRESHOLDS } from '../store/useGameStore';

const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

const PARTICLE_COUNT = 22;
const DUST_COLORS = ['#8DA399', '#D6C0A4', '#B5C4BB', '#94A3B8', '#C9A882', '#A8B9AF'];

function makeCharacterStyle(level) {
  const info = LEVEL_THRESHOLDS.find(t => t.level === level) || LEVEL_THRESHOLDS[0];
  const sizes  = [0, 22, 28, 36, 44, 50, 56]; // indexed by level
  return { fillStyle: info.color, radius: sizes[level] || 22 };
}

function createDust(W, H) {
  const r = Math.random() * 7 + 3;
  const d = Bodies.circle(
    Math.random() * W,
    Math.random() * (H * 0.7),
    r,
    {
      label: 'dust',
      restitution: 0.85,
      frictionAir: 0.025,
      density: 0.0004,
      render: {
        fillStyle: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
        opacity: Math.random() * 0.45 + 0.25,
      },
    }
  );
  Body.setVelocity(d, {
    x: (Math.random() - 0.5) * 4,
    y: (Math.random() - 0.5) * 2.5 - 0.5,
  });
  return d;
}

const PhysicsEngine = ({ onObjectClick }) => {
  const canvasRef  = useRef(null);
  const engineRef  = useRef(null);
  const characterRef = useRef(null);
  const userLevel  = useGameStore(s => s.userLevel);

  // ── Setup engine once ─────────────────────────────────────────
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const engine = Engine.create();
    engine.world.gravity.y = 0.04;
    engineRef.current = engine;

    const render = Render.create({
      canvas: canvasRef.current,
      engine,
      options: { width: W, height: H, wireframes: false, background: 'transparent' },
    });

    // Walls
    const ground    = Bodies.rectangle(W / 2, H + 30, W * 3, 60, { isStatic: true, render: { visible: false } });
    const leftWall  = Bodies.rectangle(-30, H / 2, 60, H * 3, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(W + 30, H / 2, 60, H * 3, { isStatic: true, render: { visible: false } });
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Dust particles
    const dusts = Array.from({ length: PARTICLE_COUNT }, () => createDust(W, H));
    Composite.add(engine.world, dusts);

    // Main character body
    const charStyle = makeCharacterStyle(userLevel);
    const character = Bodies.circle(W / 2, H / 2 - 60, charStyle.radius, {
      restitution: 0.7,
      frictionAir: 0.04,
      label: 'character',
      render: {
        fillStyle: charStyle.fillStyle,
        strokeStyle: 'rgba(255,255,255,0.4)',
        lineWidth: 3,
      },
    });
    characterRef.current = character;
    Composite.add(engine.world, character);

    // Easter-egg interactive objects
    const diaryObj = Bodies.rectangle(W * 0.18, H - 130, 55, 75, {
      label: 'diary',
      restitution: 0.5,
      frictionAir: 0.06,
      render: { fillStyle: '#4F46E5', strokeStyle: 'rgba(255,255,255,0.3)', lineWidth: 2 },
    });
    const sleepObj = Bodies.rectangle(W * 0.82, H - 130, 72, 45, {
      label: 'sleep',
      restitution: 0.5,
      frictionAir: 0.06,
      render: { fillStyle: '#0F172A', strokeStyle: '#A78BFA', lineWidth: 2 },
    });
    Composite.add(engine.world, [diaryObj, sleepObj]);

    // Mouse drag
    const mouse = Mouse.create(render.canvas);
    const mc    = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.22, render: { visible: false } },
    });
    Composite.add(engine.world, mc);

    // Click → navigate
    Events.on(mc, 'mousedown', event => {
      const pos    = event.mouse.position;
      const bodies = Composite.allBodies(engine.world);
      const hit    = bodies.find(b => Matter.Bounds.contains(b.bounds, pos));
      if (hit && onObjectClick && hit.label !== 'dust') {
        onObjectClick(hit.label);
      }
    });

    // Click → scatter dust
    render.canvas.addEventListener('mousedown', e => scatter(e.clientX, e.clientY, engine));
    render.canvas.addEventListener('touchstart', e => {
      const t = e.touches[0];
      scatter(t.clientX, t.clientY, engine);
    }, { passive: true });

    // Per-frame: wind + respawn
    let tick = 0;
    Events.on(engine, 'beforeUpdate', () => {
      tick++;

      if (tick % 200 === 0) {
        const wx = (Math.random() - 0.5) * 0.0018;
        const wy = -Math.random() * 0.0012;
        Composite.allBodies(engine.world).forEach(b => {
          if (!b.isStatic && b.label === 'dust') {
            Body.applyForce(b, b.position, { x: wx, y: wy });
          }
        });
      }

      Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic && b.label === 'dust' && b.position.y > H + 60) {
          Body.setPosition(b, { x: Math.random() * W, y: -20 });
          Body.setVelocity(b, { x: (Math.random() - 0.5) * 4, y: Math.random() * 2 });
        }
      });
    });

    Render.run(render);
    const runner = Runner.run(Runner.create(), engine);

    const onResize = () => {
      render.canvas.width  = window.innerWidth;
      render.canvas.height = window.innerHeight;
      render.options.width  = window.innerWidth;
      render.options.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      window.removeEventListener('resize', onResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update character visual when level changes ─────────────────
  useEffect(() => {
    const c = characterRef.current;
    if (!c) return;
    const style = makeCharacterStyle(userLevel);
    c.render.fillStyle = style.fillStyle;
    // Grow character (can't resize a circle in matter-js; swap body)
    // For now just update color; full swap would need engine ref
  }, [userLevel]);

  return <canvas ref={canvasRef} id="physics-canvas" />;
};

// ── Scatter helper ────────────────────────────────────────────────
function scatter(px, py, engine) {
  Composite.allBodies(engine.world).forEach(b => {
    if (b.isStatic || b.label !== 'dust') return;
    const dx   = b.position.x - px;
    const dy   = b.position.y - py;
    const dist = Math.hypot(dx, dy);
    if (dist < 160 && dist > 0) {
      const force = 0.0045 * (1 - dist / 160);
      Body.applyForce(b, b.position, {
        x: (dx / dist) * force,
        y: (dy / dist) * force - 0.0022,
      });
    }
  });
}

export default PhysicsEngine;
