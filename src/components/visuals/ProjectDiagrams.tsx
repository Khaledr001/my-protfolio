import type { ProjectVisual } from "@/data/projects";
import { Box, Caption, DiagramSvg, Dot, Flow, LINE } from "./primitives";

interface DiagramProps {
  accent: string;
}

/** Tenants → one platform API → billing, payments and routers. */
function IspDiagram({ accent }: DiagramProps) {
  const tenants = [70, 154, 238];
  const services = [
    { y: 62, label: "Billing engine", sub: "cron renewals" },
    { y: 130, label: "bKash", sub: "payments" },
    { y: 198, label: "RouterOS API", sub: "MikroTik" },
  ];
  const subscribers = [352, 378, 404, 430, 456];
  return (
    <DiagramSvg title="ISP platform architecture: isolated tenants share one platform API that drives billing, payments and MikroTik routers.">
      <Caption x={28} y={54}>TENANTS · ISOLATED</Caption>
      {tenants.map((y, i) => (
        <g key={y}>
          <rect x={20} y={y - 7} width={120} height={66} rx={12} fill="none" stroke={accent} strokeOpacity={0.35} strokeDasharray="3 4" />
          <Box x={28} y={y} w={104} h={52} label={`ISP · ${"ABC"[i]}`} sub="company scope" />
          <Flow d={`M132 ${y + 26} C160 ${y + 26} 160 180 188 180`} accent={accent} />
        </g>
      ))}
      <Box x={188} y={128} w={104} h={104} label="Platform API" sub="RBAC · JWT" accent={accent} strong />
      {services.map((s) => (
        <g key={s.label}>
          <Flow d={`M292 180 C320 180 320 ${s.y + 23} 348 ${s.y + 23}`} accent={accent} slow />
          <Box x={348} y={s.y} w={112} h={46} label={s.label} sub={s.sub} />
        </g>
      ))}
      {subscribers.map((x) => (
        <g key={x}>
          <Flow d={`M404 244 C404 268 ${x} 268 ${x} 292`} accent={accent} slow />
          <Dot cx={x} cy={298} r={3} color={accent} />
        </g>
      ))}
      <Caption x={404} y={330} anchor="middle">PPPOE SUBSCRIBERS</Caption>
    </DiagramSvg>
  );
}

/** Leads grouped by local time feed a prioritized queue; events fan out. */
function CrmDiagram({ accent }: DiagramProps) {
  const lanes = [
    { y: 74, zone: "UTC−05", leads: 2 },
    { y: 138, zone: "UTC+00", leads: 3 },
    { y: 202, zone: "UTC+04", leads: 1 },
  ];
  const outputs = [
    { y: 70, label: "RabbitMQ", sub: "domain events" },
    { y: 157, label: "Webhooks", sub: "HMAC-SHA256" },
    { y: 244, label: "Reporting API", sub: "per brand" },
  ];
  return (
    <DiagramSvg title="Sales CRM architecture: leads grouped by time zone feed a prioritized call queue; lead transitions publish RabbitMQ events, signed webhooks and reports.">
      <Caption x={28} y={58}>LEADS BY LOCAL TIME</Caption>
      {lanes.map((lane, i) => (
        <g key={lane.zone}>
          <rect x={28} y={lane.y} width={150} height={44} rx={9} fill="rgba(15,20,32,0.92)" stroke={LINE} />
          <text x={42} y={lane.y + 26} fontFamily="JetBrains Mono Variable, monospace" fontSize={11} fill="#E9E6DF">
            {lane.zone}
          </text>
          {Array.from({ length: 3 }, (_, d) => (
            <circle
              key={d}
              cx={118 + d * 18}
              cy={lane.y + 22}
              r={4}
              fill={accent}
              fillOpacity={d < lane.leads ? 0.9 - i * 0.2 : 0.12}
            />
          ))}
          <Flow d={`M178 ${lane.y + 22} C196 ${lane.y + 22} 196 160 212 160`} accent={accent} />
        </g>
      ))}
      <Box x={212} y={110} w={100} h={100} label="Call queue" sub="tz-prioritized" accent={accent} strong />
      <Flow d="M262 210 L262 256" accent={accent} slow />
      <Box x={196} y={256} w={132} h={50} label="Lead transitions" sub="+ follow-ups" />
      {outputs.map((o) => (
        <g key={o.label}>
          <Flow d={`M312 160 C332 160 332 ${o.y + 23} 352 ${o.y + 23}`} accent={accent} slow />
          <Box x={352} y={o.y} w={108} h={46} label={o.label} sub={o.sub} />
        </g>
      ))}
    </DiagramSvg>
  );
}

/** Client → API → event bus → decoupled services. */
function MarketplaceDiagram({ accent }: DiagramProps) {
  const services = [
    { x: 36, label: "Order service", sub: "PostgreSQL · Knex" },
    { x: 178, label: "Webhook worker", sub: "async · 3rd-party" },
    { x: 320, label: "File storage", sub: "AWS S3" },
  ];
  return (
    <DiagramSvg title="Technician marketplace architecture: an Angular client calls NestJS APIs, which publish to a RabbitMQ and NATS event bus consumed by the order service, a webhook worker and S3 file storage.">
      <Box x={180} y={46} w={120} h={42} label="Angular client" />
      <Flow d="M240 88 L240 118" accent={accent} />
      <Box x={170} y={118} w={140} h={54} label="NestJS REST API" sub="work-order lifecycle" accent={accent} strong />
      <Flow d="M240 172 L240 204" accent={accent} />
      <Caption x={40} y={196}>RABBITMQ · NATS EVENT BUS</Caption>
      <rect x={36} y={204} width={408} height={16} rx={8} fill={accent} fillOpacity={0.07} stroke={accent} strokeOpacity={0.45} />
      <Flow d="M48 212 L432 212" accent={accent} slow />
      {services.map((s) => (
        <g key={s.label}>
          <Flow d={`M${s.x + 62} 220 L${s.x + 62} 258`} accent={accent} />
          <Box x={s.x} y={258} w={124} h={56} label={s.label} sub={s.sub} />
        </g>
      ))}
    </DiagramSvg>
  );
}

/** Retrieval-augmented generation with a tenant filter at the vector store. */
function RagDiagram({ accent }: DiagramProps) {
  const bands = [
    { y: 112, label: "tenant A" },
    { y: 158, label: "tenant B", active: true },
    { y: 204, label: "tenant C" },
  ];
  return (
    <DiagramSvg title="RAG pipeline: a question is embedded, searched in pgvector filtered to one tenant, and the retrieved context grounds the LLM's answer.">
      <Box x={28} y={60} w={96} h={44} label="Question" />
      <Flow d="M76 104 L76 140" accent={accent} />
      <Box x={28} y={140} w={96} h={44} label="Embedding" sub="vector" />
      <Flow d="M124 162 C148 162 150 182 172 182" accent={accent} />

      {/* pgvector store, partitioned by tenant */}
      <rect x={172} y={112} width={136} height={138} fill="rgba(15,20,32,0.95)" />
      {bands.map((band) =>
        band.active ? (
          <rect key={band.label} x={172} y={band.y} width={136} height={46} fill={accent} fillOpacity={0.14} />
        ) : null,
      )}
      <path d="M172 112 L172 250 M308 112 L308 250" stroke={LINE} />
      <path d="M172 158 A68 13 0 0 0 308 158 M172 204 A68 13 0 0 0 308 204 M172 250 A68 13 0 0 0 308 250" stroke={LINE} fill="none" />
      <ellipse cx={240} cy={112} rx={68} ry={13} fill="rgba(22,29,45,1)" stroke={accent} strokeOpacity={0.6} />
      {bands.map((band) => (
        <text
          key={band.label}
          x={240}
          y={band.y + 28}
          textAnchor="middle"
          fontFamily="JetBrains Mono Variable, monospace"
          fontSize={10}
          fill={band.active ? "#E9E6DF" : "#8B93A7"}
        >
          {band.label}
          {band.active ? "  ✓" : ""}
        </text>
      ))}
      <Caption x={240} y={288} anchor="middle">POSTGRESQL + PGVECTOR</Caption>
      <Caption x={240} y={302} anchor="middle">FILTERED TO ONE TENANT</Caption>

      <Flow d="M308 180 C330 180 330 82 352 82" accent={accent} />
      <Box x={352} y={60} w={100} h={44} label="Context" />
      <Flow d="M402 104 L402 140" accent={accent} />
      <Box x={352} y={140} w={100} h={44} label="LLM API" accent={accent} strong />
      <Flow d="M402 184 L402 220" accent={accent} />
      <Box x={352} y={220} w={100} h={44} label="Answer" sub="grounded" />
    </DiagramSvg>
  );
}

const diagrams: Record<ProjectVisual, (props: DiagramProps) => JSX.Element> = {
  isp: IspDiagram,
  crm: CrmDiagram,
  marketplace: MarketplaceDiagram,
  rag: RagDiagram,
};

export function ProjectDiagram({ visual, accent }: { visual: ProjectVisual; accent: string }) {
  const Diagram = diagrams[visual];
  return <Diagram accent={accent} />;
}
