import type { ReactNode } from "react";
import type { ConceptVisualId } from "@/content/types";

/**
 * Original concept boards, drawn as inline SVG in the site's palette. They are
 * deliberately text-free (bars stand in for copy; only digits, hex codes and
 * the generic "Aa" appear), so they need no translation and cannot be read as
 * a real client's work, results or claims. Each is a 4:3 board.
 */

const C = {
  base: "#f7f4ef",
  card: "#ffffff",
  ink: "#141210",
  inverse: "#0f0e0c",
  muted: "#5c5650",
  line: "#e5ded4",
  accent: "#935a3b",
  accentSoft: "#e8d5c4",
  olive: "#5a5f45",
  sea: "#4f7a80",
  seaSoft: "#a9c4c6",
  sky: "#d8e6e6",
  sand: "#d9c3a5",
  leaf: "#6b7a52",
};

/** Grey bars that read as lines of text. */
function Bars({ x, y, w, rows = 3, gap = 12, h = 6, color = C.line, last = 0.6 }: { x: number; y: number; w: number; rows?: number; gap?: number; h?: number; color?: string; last?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <rect key={i} x={x} y={y + i * gap} width={i === rows - 1 ? w * last : w} height={h} rx={h / 2} fill={color} />
      ))}
    </>
  );
}

function Frame({ x, y, w, h, r = 10, fill = C.card, stroke = C.line, children }: { x: number; y: number; w: number; h: number; r?: number; fill?: string; stroke?: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {children}
    </g>
  );
}

/** A soft "photograph": sky, sea band, sun and a headland, clipped to the box. */
function Scene({ x, y, w, h, id, tone = 0 }: { x: number; y: number; w: number; h: number; id: string; tone?: number }) {
  const sky = [C.sky, C.accentSoft, "#e9e1d3"][tone % 3];
  const sea = [C.sea, C.olive, C.seaSoft][tone % 3];
  return (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={6} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={sky} />
        <circle cx={x + w * 0.72} cy={y + h * 0.3} r={Math.min(w, h) * 0.13} fill={tone === 1 ? C.card : C.accentSoft} />
        <rect x={x} y={y + h * 0.58} width={w} height={h * 0.42} fill={sea} />
        <path d={`M${x} ${y + h * 0.62} Q${x + w * 0.3} ${y + h * 0.4} ${x + w * 0.55} ${y + h * 0.62} T${x + w} ${y + h * 0.6} V${y + h * 0.7} H${x} Z`} fill={C.leaf} opacity={0.85} />
      </g>
    </g>
  );
}

function Board({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 800 600" role="img" aria-label={label} className="h-auto w-full">
      <rect width="800" height="600" fill={C.base} />
      {children}
    </svg>
  );
}

/* 1 — advertising: three ad formats above a campaign structure */
function Advertising({ label }: { label: string }) {
  return (
    <Board label={label}>
      <Frame x={40} y={36} w={220} h={250}>
        <Scene x={52} y={48} w={196} h={150} id="ad-a" />
        <Bars x={52} y={212} w={150} rows={2} gap={14} h={8} color={C.ink} last={0.7} />
        <rect x={52} y={246} width={86} height={26} rx={13} fill={C.accent} />
      </Frame>
      <Frame x={284} y={36} w={128} h={250} r={16}>
        <Scene x={294} y={46} w={108} h={170} id="ad-b" tone={1} />
        <Bars x={296} y={228} w={80} rows={2} gap={12} h={7} color={C.ink} />
        <rect x={296} y={256} width={60} height={18} rx={9} fill={C.accent} />
      </Frame>
      <Frame x={436} y={36} w={324} h={134}>
        <circle cx={460} cy={62} r={8} fill={C.accentSoft} />
        <rect x={476} y={58} width={96} height={7} rx={3.5} fill={C.line} />
        <rect x={452} y={84} width={230} height={12} rx={6} fill={C.accent} />
        <Bars x={452} y={110} w={290} rows={2} gap={13} h={7} />
      </Frame>
      <Frame x={436} y={186} w={324} h={100} fill={C.accentSoft} stroke={C.accentSoft}>
        <Bars x={456} y={206} w={160} rows={2} gap={16} h={8} color={C.card} last={0.5} />
        <circle cx={716} cy={236} r={26} fill={C.card} />
        <path d="M708 236h16m-7-8 8 8-8 8" stroke={C.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
      </Frame>
      {/* structure */}
      <rect x={300} y={320} width={200} height={50} rx={10} fill={C.ink} />
      <Bars x={322} y={338} w={110} rows={1} h={8} color={C.base} last={1} />
      <path d="M400 370v24M400 394H200v22M400 394h200v22" stroke={C.muted} strokeWidth={2} fill="none" />
      {[
        { cx: 200, fill: C.sea },
        { cx: 600, fill: C.accent },
      ].map(({ cx, fill }) => (
        <g key={cx}>
          <rect x={cx - 110} y={416} width={220} height={44} rx={10} fill={fill} />
          <Bars x={cx - 88} y={434} w={100} rows={1} h={8} color={C.card} last={1} />
          <path d={`M${cx} 460v22M${cx} 482H${cx - 90}v18M${cx} 482h0M${cx} 482H${cx + 90}v18`} stroke={C.muted} strokeWidth={2} fill="none" />
          {[-90, 0, 90].map((dx) => (
            <Frame key={dx} x={cx + dx - 38} y={500} w={76} h={58} r={8}>
              <Bars x={cx + dx - 26} y={514} w={52} rows={3} gap={11} h={6} />
            </Frame>
          ))}
        </g>
      ))}
    </Board>
  );
}

/* 2 — social: 3×3 grid and a four-week calendar */
function Social({ label }: { label: string }) {
  const tiles = [
    { t: "photo", tone: 0 }, { t: "type" }, { t: "reel" },
    { t: "detail" }, { t: "photo", tone: 1 }, { t: "type2" },
    { t: "reel" }, { t: "photo", tone: 2 }, { t: "detail" },
  ] as const;
  return (
    <Board label={label}>
      <Frame x={36} y={36} w={436} h={436} r={14} />
      {tiles.map((tile, i) => {
        const x = 48 + (i % 3) * 140;
        const y = 48 + Math.floor(i / 3) * 140;
        return (
          <g key={i}>
            {tile.t === "photo" && <Scene x={x} y={y} w={132} h={132} id={`so-${i}`} tone={tile.tone} />}
            {tile.t === "type" && (
              <>
                <rect x={x} y={y} width={132} height={132} rx={6} fill={C.accent} />
                <Bars x={x + 16} y={y + 40} w={96} rows={3} gap={18} h={10} color={C.card} last={0.5} />
              </>
            )}
            {tile.t === "type2" && (
              <>
                <rect x={x} y={y} width={132} height={132} rx={6} fill={C.olive} />
                <circle cx={x + 66} cy={y + 56} r={26} fill={C.accentSoft} />
                <Bars x={x + 28} y={y + 102} w={76} rows={1} h={8} color={C.card} last={1} />
              </>
            )}
            {tile.t === "detail" && (
              <>
                <rect x={x} y={y} width={132} height={132} rx={6} fill={C.sand} />
                <circle cx={x + 66} cy={y + 66} r={44} fill={C.card} />
                <circle cx={x + 66} cy={y + 66} r={30} fill={C.accentSoft} />
                <circle cx={x + 66} cy={y + 66} r={12} fill={C.accent} />
              </>
            )}
            {tile.t === "reel" && (
              <>
                <rect x={x} y={y} width={132} height={132} rx={6} fill={C.inverse} />
                <path d={`M${x + 54} ${y + 44}l36 22-36 22z`} fill={C.card} />
                <rect x={x + 100} y={y + 10} width={22} height={10} rx={3} fill={C.accent} />
              </>
            )}
          </g>
        );
      })}
      {/* calendar */}
      <Frame x={500} y={36} w={264} h={300} r={14}>
        <rect x={500} y={36} width={264} height={36} rx={14} fill={C.ink} />
        <Bars x={520} y={51} w={90} rows={1} h={7} color={C.base} last={1} />
      </Frame>
      {Array.from({ length: 28 }, (_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const x = 514 + col * 34;
        const y = 88 + row * 56;
        const kind = [0, 2, 4, 5].includes(col) ? (col === 5 ? 2 : (row + col) % 2) : -1;
        const fills = [C.accent, C.sea, C.olive];
        return (
          <g key={i}>
            <rect x={x} y={y} width={30} height={44} rx={6} fill={C.base} stroke={C.line} />
            {kind >= 0 && <circle cx={x + 15} cy={y + 24} r={8} fill={fills[kind]} />}
          </g>
        );
      })}
      <g>
        {[C.accent, C.sea, C.olive].map((fill, i) => (
          <g key={fill}>
            <circle cx={520 + i * 80} cy={372} r={8} fill={fill} />
            <rect x={536 + i * 80} y={369} width={42} height={6} rx={3} fill={C.line} />
          </g>
        ))}
      </g>
      <Frame x={500} y={404} w={264} h={68} r={14} fill={C.accentSoft} stroke={C.accentSoft}>
        <Bars x={520} y={424} w={200} rows={3} gap={13} h={7} color={C.card} last={0.55} />
      </Frame>
      <Bars x={36} y={500} w={728} rows={2} gap={16} h={8} color={C.line} last={0.4} />
    </Board>
  );
}

/* 3 — villa: scene with drone framing and a listing layout */
function Villa({ label }: { label: string }) {
  return (
    <Board label={label}>
      <clipPath id="villa-scene">
        <rect x={36} y={36} width={480} height={340} rx={12} />
      </clipPath>
      <g clipPath="url(#villa-scene)">
        <rect x={36} y={36} width={480} height={340} fill={C.sky} />
        <circle cx={420} cy={104} r={34} fill={C.accentSoft} />
        <rect x={36} y={188} width={480} height={80} fill={C.sea} />
        <path d="M36 300 Q150 190 300 250 T516 230 V376 H36 Z" fill={C.leaf} />
        <path d="M36 330 Q200 250 516 300 V376 H36 Z" fill={C.olive} />
        {/* villa */}
        <rect x={210} y={238} width={150} height={52} fill={C.card} />
        <rect x={196} y={228} width={178} height={12} fill={C.ink} />
        <rect x={252} y={206} width={90} height={26} fill={C.card} />
        <rect x={244} y={198} width={106} height={10} fill={C.ink} />
        {[222, 258, 294, 330].map((x) => (
          <rect key={x} x={x} y={252} width={22} height={30} fill={C.sea} opacity={0.75} />
        ))}
        <rect x={366} y={274} width={86} height={26} rx={4} fill={C.seaSoft} />
        {/* palms */}
        {[92, 468].map((x) => (
          <g key={x}>
            <path d={`M${x} 330 Q${x + 4} 280 ${x - 2} 238`} stroke={C.inverse} strokeWidth={5} fill="none" />
            <path d={`M${x - 2} 238 q-34 -6 -46 14 M${x - 2} 238 q30 -14 48 4 M${x - 2} 238 q-12 -26 -34 -26 M${x - 2} 238 q12 -26 36 -22`} stroke={C.inverse} strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* drone framing guides */}
        <g stroke={C.card} strokeWidth={3} fill="none" strokeLinecap="round">
          <path d="M60 60v26M60 60h26M492 60v26M492 60h-26M60 352v-26M60 352h26M492 352v-26M492 352h-26" />
          <path d="M276 186v22M265 197h22" />
        </g>
        <circle cx={80} cy={80} r={6} fill="#c0392b" />
      </g>
      <rect x={36} y={36} width={480} height={340} rx={12} fill="none" stroke={C.line} strokeWidth={1.5} />
      {/* ground frames */}
      {[0, 1, 2].map((i) => (
        <Frame key={i} x={36 + i * 164} y={396} w={152} h={104} r={10}>
          <Scene x={44 + i * 164} y={404} w={136} h={88} id={`vg-${i}`} tone={i} />
        </Frame>
      ))}
      <Bars x={36} y={522} w={480} rows={2} gap={16} h={8} last={0.45} />
      {/* listing page */}
      <Frame x={548} y={36} w={216} h={528} r={14}>
        <rect x={548} y={36} width={216} height={34} rx={14} fill={C.ink} />
        <Bars x={566} y={49} w={70} rows={1} h={7} color={C.base} last={1} />
        <Scene x={562} y={84} w={188} h={120} id="vl-hero" />
        {[0, 1].map((r) =>
          [0, 1].map((c) => (
            <Scene key={`${r}${c}`} x={562 + c * 96} y={214 + r * 66} w={92} h={60} id={`vl-${r}${c}`} tone={r + c} />
          ))
        )}
        <Bars x={562} y={352} w={188} rows={2} gap={14} h={9} color={C.ink} last={0.55} />
        <Bars x={562} y={392} w={188} rows={4} gap={13} h={6} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={562 + i * 64} y={456} width={58} height={34} rx={8} fill={C.base} stroke={C.line} />
            <rect x={572 + i * 64} y={470} width={38} height={6} rx={3} fill={C.line} />
          </g>
        ))}
        <rect x={562} y={508} width={188} height={36} rx={18} fill={C.accent} />
      </Frame>
    </Board>
  );
}

/* 4 — food: overhead plates beside a menu layout */
function Food({ label }: { label: string }) {
  const plates = [
    { cx: 150, cy: 150, a: C.accent, b: C.leaf },
    { cx: 330, cy: 210, a: C.olive, b: C.accentSoft },
    { cx: 170, cy: 350, a: C.sea, b: C.sand },
  ];
  return (
    <Board label={label}>
      <rect x={36} y={36} width={410} height={528} rx={14} fill={C.sand} />
      <g opacity={0.25} stroke={C.card} strokeWidth={2}>
        {[110, 190, 270, 350, 430, 510].map((y) => (
          <path key={y} d={`M36 ${y}H446`} />
        ))}
      </g>
      {plates.map((p) => (
        <g key={p.cx}>
          <circle cx={p.cx + 6} cy={p.cy + 8} r={96} fill="#000" opacity={0.1} />
          <circle cx={p.cx} cy={p.cy} r={96} fill={C.card} />
          <circle cx={p.cx} cy={p.cy} r={72} fill={C.base} stroke={C.line} strokeWidth={2} />
          <circle cx={p.cx - 14} cy={p.cy - 8} r={26} fill={p.a} />
          <circle cx={p.cx + 24} cy={p.cy + 14} r={18} fill={p.b} />
          <circle cx={p.cx - 4} cy={p.cy + 30} r={11} fill={C.leaf} />
          <circle cx={p.cx + 8} cy={p.cy - 34} r={7} fill={C.accentSoft} />
        </g>
      ))}
      <g stroke={C.ink} strokeWidth={5} strokeLinecap="round" opacity={0.7}>
        <path d="M398 80v110M398 80v36" />
        <path d="M262 380v110" />
      </g>
      <path d="M252 380q10 -30 20 0" stroke={C.ink} strokeWidth={5} fill="none" opacity={0.7} />
      {/* menu */}
      <Frame x={474} y={36} w={290} h={528} r={14}>
        <rect x={500} y={62} width={110} height={12} rx={6} fill={C.ink} />
        <rect x={500} y={82} width={60} height={5} rx={2.5} fill={C.accent} />
        {[0, 1, 2].map((s) => (
          <g key={s}>
            <rect x={500} y={118 + s * 148} width={80} height={9} rx={4.5} fill={C.accent} />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={500} y={142 + s * 148 + i * 28} width={96 - (i % 2) * 14} height={7} rx={3.5} fill={C.ink} opacity={0.8} />
                <path d={`M${606 - (i % 2) * 14} ${146 + s * 148 + i * 28}H724`} stroke={C.line} strokeWidth={2} strokeDasharray="2 5" />
                <rect x={730} y={142 + s * 148 + i * 28} width={22} height={7} rx={3.5} fill={C.muted} />
                <rect x={500} y={154 + s * 148 + i * 28} width={70} height={4} rx={2} fill={C.line} />
              </g>
            ))}
          </g>
        ))}
        <circle cx={716} cy={90} r={22} fill={C.accentSoft} />
        <circle cx={716} cy={90} r={12} fill={C.accent} />
      </Frame>
    </Board>
  );
}

/** A map pin; its tip sits at (x, y). */
function Pin({ x, y, big }: { x: number; y: number; big?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${big ? 1.6 : 1})`}>
      <path d="M0 0c-14-22-18-30-18-40a18 18 0 0 1 36 0c0 10-4 18-18 40z" fill={big ? C.accent : C.olive} />
      <circle cy={-40} r={7} fill={C.card} />
    </g>
  );
}

/* 5 — local: map and business profile card */
function Local({ label }: { label: string }) {
  return (
    <Board label={label}>
      <clipPath id="map-clip">
        <rect x={36} y={36} width={456} height={528} rx={14} />
      </clipPath>
      <g clipPath="url(#map-clip)">
        <rect x={36} y={36} width={456} height={528} fill="#efe9de" />
        <path d="M36 36H300Q260 150 330 230T300 400Q270 500 340 564H36Z" fill={C.seaSoft} />
        <g stroke={C.card} strokeWidth={10} fill="none" strokeLinecap="round">
          <path d="M330 80Q380 200 420 260T470 420" />
          <path d="M340 300H500" />
          <path d="M380 140H500" />
          <path d="M400 420Q330 470 380 564" />
        </g>
        <g stroke={C.line} strokeWidth={4} fill="none">
          <path d="M356 360H492M372 200H492M360 480H492" />
        </g>
        <rect x={380} y={170} width={44} height={36} fill={C.sand} opacity={0.6} />
        <rect x={430} y={330} width={50} height={40} fill={C.leaf} opacity={0.35} />
        <circle cx={96} cy={500} r={40} fill={C.sea} opacity={0.25} />
      </g>
      <Pin x={420} y={290} big />
      <Pin x={376} y={440} />
      <Pin x={456} y={156} />
      <Pin x={348} y={120} />
      <rect x={36} y={36} width={456} height={528} rx={14} fill="none" stroke={C.line} strokeWidth={1.5} />
      {/* profile card */}
      <Frame x={516} y={36} w={248} h={528} r={14}>
        <Scene x={528} y={48} w={224} h={132} id="lp-hero" tone={2} />
        <rect x={532} y={198} width={150} height={12} rx={6} fill={C.ink} />
        <rect x={532} y={220} width={96} height={7} rx={3.5} fill={C.line} />
        <g fill="none" stroke={C.accent} strokeWidth={2}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} transform={`translate(${544 + i * 26} 252)`} d="M0-9l2.6 6 6.6.5-5 4.4 1.6 6.4L0 4.4-5.8 8.3l1.6-6.4-5-4.4 6.6-.5z" />
          ))}
        </g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={556 + i * 74} cy={306} r={22} fill={C.accentSoft} />
            <circle cx={556 + i * 74} cy={306} r={8} fill={C.accent} />
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={532} y={348 + i * 40} width={18} height={18} rx={4} fill={C.olive} opacity={0.8} />
            <Bars x={562} y={351 + i * 40} w={170} rows={2} gap={10} h={5} last={0.6} />
          </g>
        ))}
        <rect x={532} y={514} width={192} height={30} rx={15} fill={C.accent} />
      </Frame>
    </Board>
  );
}

/* 6 — website: desktop and mobile wireframes */
function Website({ label }: { label: string }) {
  return (
    <Board label={label}>
      <Frame x={36} y={48} w={540} h={440} r={14}>
        <path d="M36 62a14 14 0 0 1 14-14h512a14 14 0 0 1 14 14v26H36z" fill={C.base} stroke={C.line} strokeWidth={1.5} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={56 + i * 18} cy={68} r={5} fill={[C.accent, C.sand, C.olive][i]} />
        ))}
        <rect x={130} y={59} width={300} height={18} rx={9} fill={C.card} stroke={C.line} />
        <rect x={52} y={108} width={86} height={12} rx={6} fill={C.ink} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={340 + i * 56} y={110} width={42} height={8} rx={4} fill={C.line} />
        ))}
        <rect x={52} y={140} width={508} height={150} rx={8} fill={C.sea} />
        <circle cx={500} cy={190} r={40} fill={C.accentSoft} opacity={0.7} />
        <Bars x={76} y={170} w={250} rows={2} gap={22} h={14} color={C.card} last={0.6} />
        <Bars x={76} y={222} w={200} rows={2} gap={12} h={6} color={C.seaSoft} last={0.7} />
        <rect x={76} y={252} width={110} height={26} rx={13} fill={C.accent} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Scene x={52 + i * 172} y={308} w={160} h={90} id={`ws-${i}`} tone={i} />
            <Bars x={52 + i * 172} y={410} w={150} rows={3} gap={12} h={6} last={0.5} />
          </g>
        ))}
        <rect x={52} y={460} width={508} height={0} />
      </Frame>
      {[
        { x: 40, y: 134, n: 1 },
        { x: 40, y: 292, n: 2 },
        { x: 40, y: 420, n: 3 },
      ].map(({ x, y, n }) => (
        <g key={n}>
          <circle cx={x} cy={y} r={16} fill={C.ink} />
          <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.base} fontFamily="var(--font-body)">
            {n}
          </text>
        </g>
      ))}
      {/* phone */}
      <rect x={612} y={64} width={152} height={452} rx={24} fill={C.inverse} />
      <rect x={620} y={76} width={136} height={428} rx={16} fill={C.card} />
      <rect x={672} y={82} width={32} height={6} rx={3} fill={C.inverse} />
      <rect x={632} y={100} width={64} height={9} rx={4.5} fill={C.ink} />
      <rect x={724} y={100} width={20} height={9} rx={4.5} fill={C.line} />
      <rect x={632} y={124} width={112} height={110} rx={8} fill={C.sea} />
      <Bars x={642} y={146} w={80} rows={2} gap={16} h={10} color={C.card} last={0.6} />
      <rect x={642} y={192} width={70} height={22} rx={11} fill={C.accent} />
      <Scene x={632} y={248} w={112} h={64} id="wp-1" tone={1} />
      <Bars x={632} y={326} w={112} rows={3} gap={12} h={6} last={0.5} />
      <Scene x={632} y={376} w={112} h={56} id="wp-2" />
      <rect x={632} y={452} width={112} height={32} rx={16} fill={C.accent} />
      <Bars x={36} y={516} w={540} rows={2} gap={16} h={8} last={0.4} />
    </Board>
  );
}

/* 7 — video: six-frame storyboard with timecodes */
function Video({ label }: { label: string }) {
  const times = ["0:00", "0:08", "0:18", "0:30", "0:44", "0:55"];
  const frames = [
    // 0: aerial coast
    (x: number, y: number) => (
      <>
        <rect x={x} y={y} width={228} height={140} fill={C.sea} />
        <path d={`M${x} ${y + 90}Q${x + 80} ${y + 50} ${x + 150} ${y + 80}T${x + 228} ${y + 70}V${y + 140}H${x}Z`} fill={C.sand} />
        <path d={`M${x + 20} ${y + 118}q30 -10 60 0t60 0`} stroke={C.card} strokeWidth={3} fill="none" opacity={0.7} />
      </>
    ),
    // 1: beach wide
    (x: number, y: number) => (
      <>
        <rect x={x} y={y} width={228} height={140} fill={C.sky} />
        <rect x={x} y={y + 70} width={228} height={30} fill={C.seaSoft} />
        <rect x={x} y={y + 100} width={228} height={40} fill={C.sand} />
        <circle cx={x + 170} cy={y + 36} r={18} fill={C.accentSoft} />
        <circle cx={x + 70} cy={y + 106} r={8} fill={C.ink} />
        <rect x={x + 66} y={y + 112} width={8} height={18} fill={C.ink} />
      </>
    ),
    // 2: hands and cup
    (x: number, y: number) => (
      <>
        <rect x={x} y={y} width={228} height={140} fill={C.accentSoft} />
        <path d={`M${x + 20} ${y + 140}q10 -60 50 -62`} stroke={C.accent} strokeWidth={22} strokeLinecap="round" fill="none" />
        <path d={`M${x + 208} ${y + 140}q-10 -60 -50 -62`} stroke={C.accent} strokeWidth={22} strokeLinecap="round" fill="none" />
        <rect x={x + 92} y={y + 60} width={44} height={44} rx={8} fill={C.card} />
        <path d={`M${x + 136} ${y + 72}q16 6 0 20`} stroke={C.card} strokeWidth={6} fill="none" />
      </>
    ),
    // 3: product close-up
    (x: number, y: number) => (
      <>
        <rect x={x} y={y} width={228} height={140} fill={C.inverse} />
        <circle cx={x + 114} cy={y + 70} r={50} fill={C.card} />
        <circle cx={x + 114} cy={y + 70} r={38} fill={C.accent} />
        <path d={`M${x + 96} ${y + 64}q18 -16 36 0q-18 16 -36 0z`} fill={C.accentSoft} />
      </>
    ),
    // 4: sunset aerial
    (x: number, y: number) => (
      <>
        <rect x={x} y={y} width={228} height={140} fill={C.accent} />
        <circle cx={x + 114} cy={y + 80} r={34} fill={C.accentSoft} />
        <rect x={x} y={y + 84} width={228} height={56} fill={C.olive} />
        <path d={`M${x} ${y + 112}h228`} stroke={C.accentSoft} strokeWidth={2} opacity={0.5} />
      </>
    ),
    // 5: end card
    (x: number, y: number) => (
      <>
        <rect x={x} y={y} width={228} height={140} fill={C.base} />
        <circle cx={x + 114} cy={y + 58} r={26} fill={C.accent} />
        <circle cx={x + 114} cy={y + 58} r={10} fill={C.base} />
        <Bars x={x + 64} y={y + 104} w={100} rows={2} gap={12} h={6} color={C.muted} last={0.6} />
      </>
    ),
  ];
  return (
    <Board label={label}>
      {frames.map((draw, i) => {
        const x = 36 + (i % 3) * 252;
        const y = 56 + Math.floor(i / 3) * 236;
        return (
          <g key={i}>
            <clipPath id={`sb-${i}`}>
              <rect x={x} y={y} width={228} height={140} rx={8} />
            </clipPath>
            <g clipPath={`url(#sb-${i})`}>{draw(x, y)}</g>
            <rect x={x} y={y} width={228} height={140} rx={8} fill="none" stroke={C.ink} strokeWidth={2} />
            <rect x={x} y={y + 152} width={52} height={22} rx={11} fill={C.ink} />
            <text x={x + 26} y={y + 168} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.base} fontFamily="var(--font-body)">
              {times[i]}
            </text>
            <Bars x={x + 64} y={y + 156} w={150} rows={2} gap={10} h={5} last={0.7} />
            {i % 3 !== 2 && <path d={`M${x + 234} ${y + 70}h12m-5 -5 5 5-5 5`} stroke={C.accent} strokeWidth={3} fill="none" strokeLinecap="round" />}
          </g>
        );
      })}
      <path d="M150 230 Q400 262 650 268" stroke="none" fill="none" />
      <path d="M770 126q16 0 16 24v60q0 24 -16 24H60" stroke={C.accent} strokeWidth={0} fill="none" />
      <Bars x={36} y={532} w={728} rows={2} gap={16} h={8} last={0.35} />
    </Board>
  );
}

/* 8 — brand: logo mark, palette, type and applications */
function Brand({ label }: { label: string }) {
  const swatches = [
    { c: "#935A3B", t: C.card },
    { c: "#5A5F45", t: C.card },
    { c: "#E8D5C4", t: C.ink },
    { c: "#141210", t: C.card },
  ];
  return (
    <Board label={label}>
      <Frame x={36} y={36} w={300} h={300} r={14} fill={C.card}>
        <circle cx={186} cy={186} r={104} fill={C.accent} />
        <circle cx={186} cy={186} r={82} fill="none" stroke={C.accentSoft} strokeWidth={4} />
        <path d="M122 200q32 -50 64 0t64 0" stroke={C.base} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M150 156q36 -44 72 0q-36 30 -72 0z" fill={C.accentSoft} />
        <path d="M186 140v30" stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
      </Frame>
      {swatches.map((s, i) => (
        <g key={s.c}>
          <rect x={36 + i * 78} y={356} width={72} height={86} rx={10} fill={s.c} stroke={C.line} />
          <text x={72 + i * 78} y={430} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.t} fontFamily="var(--font-body)">
            {s.c}
          </text>
        </g>
      ))}
      <Frame x={36} y={462} w={300} h={102} r={14}>
        <text x={56} y={528} fontSize={64} fill={C.ink} fontFamily="var(--font-display)">
          Aa
        </text>
        <text x={160} y={514} fontSize={22} fill={C.muted} fontFamily="var(--font-body)">
          Bb Cc 123
        </text>
        <Bars x={160} y={528} w={150} rows={2} gap={11} h={5} last={0.6} />
      </Frame>
      {/* packaging bag */}
      <path d="M392 120h196l22 440H370z" fill={C.accent} />
      <path d="M392 120l196 0 -6 -34h-184z" fill={C.accent} opacity={0.85} />
      <rect x={384} y={96} width={212} height={16} rx={6} fill={C.ink} opacity={0.85} />
      <rect x={406} y={236} width={168} height={212} rx={10} fill={C.base} />
      <circle cx={490} cy={310} r={46} fill={C.accent} />
      <circle cx={490} cy={310} r={36} fill="none" stroke={C.accentSoft} strokeWidth={3} />
      <path d="M458 318q16 -26 32 0t32 0" stroke={C.base} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Bars x={430} y={382} w={120} rows={3} gap={13} h={6} color={C.muted} last={0.55} />
      {/* menu card */}
      <Frame x={640} y={110} w={124} h={400} r={10} fill={C.base}>
        <circle cx={702} cy={156} r={20} fill={C.accent} />
        <path d="M688 162q7 -12 14 0t14 0" stroke={C.base} strokeWidth={3} fill="none" strokeLinecap="round" />
        <rect x={662} y={196} width={80} height={9} rx={4.5} fill={C.olive} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x={662} y={222 + i * 34} width={66 - (i % 2) * 12} height={6} rx={3} fill={C.ink} opacity={0.8} />
            <rect x={662} y={234 + i * 34} width={46} height={4} rx={2} fill={C.line} />
            <rect x={730} y={222 + i * 34} width={12} height={6} rx={3} fill={C.muted} />
          </g>
        ))}
      </Frame>
    </Board>
  );
}

const VISUALS: Record<ConceptVisualId, (props: { label: string }) => ReactNode> = {
  advertising: Advertising,
  social: Social,
  villa: Villa,
  food: Food,
  local: Local,
  website: Website,
  video: Video,
  brand: Brand,
};

export function ConceptVisual({ id, alt, className = "" }: { id: ConceptVisualId; alt: string; className?: string }) {
  const Visual = VISUALS[id];
  return (
    <div className={`overflow-hidden border border-line bg-base ${className}`}>
      <Visual label={alt} />
    </div>
  );
}
