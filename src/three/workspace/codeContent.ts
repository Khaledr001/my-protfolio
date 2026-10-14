// What appears on the screens. Illustrative TypeScript in the style of the
// projects on the page — not copied from any client codebase.

export interface Snippet {
  file: string;
  code: string;
}

/** Cycled on the monitor while the reader is outside the projects chapter. */
export const ambientSnippets: Snippet[] = [
  {
    file: "lead.service.ts",
    code: `@Injectable()
export class LeadService {
  constructor(
    private readonly db: Database,
    private readonly events: EventBus,
  ) {}

  // Every query is scoped to the caller's tenant.
  async callQueue(tenantId: string, now: Date) {
    return this.db
      .select()
      .from(leads)
      .where(and(eq(leads.tenantId, tenantId), isDue(now)))
      .orderBy(localHour(leads.timezone))
      .limit(50);
  }

  async transition(id: string, to: LeadState) {
    const lead = await this.repo.get(id);
    assertTransition(lead.state, to);
    await this.repo.update(id, { state: to });
    await this.events.publish('lead.transitioned', { id, to });
  }
}`,
  },
  {
    file: "tenant.guard.ts",
    code: `@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const { tenantId, role } = req.user;

    // No tenant, no access. Ever.
    if (!tenantId) throw new ForbiddenException();

    req.scope = { tenantId, role };
    return this.rbac.allows(role, req.route.path);
  }
}`,
  },
];

/** Shown on the monitor for each featured project, in the same order. */
export const projectSnippets: Snippet[] = [
  {
    file: "billing.cron.ts",
    code: `@Cron('0 2 * * *')
async renewSubscriptions() {
  const due = await this.subscriptions.findDue(today());

  for (const sub of due) {
    const paid = await this.billing.charge(sub);

    // Keep the router in sync with billing.
    if (paid) await this.routeros.enable(sub.pppoe);
    else await this.routeros.suspend(sub.pppoe);
  }
}`,
  },
  {
    file: "webhook.signer.ts",
    code: `export function sign(payload: object, secret: string) {
  const body = JSON.stringify(payload);
  const signature = createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return {
    body,
    headers: { 'X-Signature': \`sha256=\${signature}\` },
  };
}`,
  },
  {
    file: "order.consumer.ts",
    code: `@EventPattern('order.created')
async onOrderCreated(@Payload() order: OrderEvent) {
  // Off the request path: webhooks and files run async.
  await this.webhooks.enqueue(order);
  await this.storage.attach(order.id, { bucket: 's3' });
  this.nats.emit('order.ready', { id: order.id });
}`,
  },
  {
    file: "retrieval.service.ts",
    code: `async retrieve(tenantId: string, question: string) {
  const embedding = await this.llm.embed(question);

  // Only this tenant's documents are ever searched.
  return this.db.execute(sql\`
    SELECT content FROM documents
    WHERE tenant_id = \${tenantId}
    ORDER BY embedding <=> \${embedding}
    LIMIT 5
  \`);
}`,
  },
];

export interface DiffLine {
  kind: "context" | "add" | "remove";
  text: string;
}

/** The code review open on the laptop. */
export const reviewDiff: DiffLine[] = [
  { kind: "context", text: "async callQueue(tenantId: string) {" },
  { kind: "remove", text: "  const all = await this.db.select().from(leads);" },
  { kind: "remove", text: "  return all.filter(l => l.tenantId === tenantId);" },
  { kind: "add", text: "  return this.db.select().from(leads)" },
  { kind: "add", text: "    .where(eq(leads.tenantId, tenantId))" },
  { kind: "add", text: "    .orderBy(localHour(leads.timezone));" },
  { kind: "context", text: "}" },
];
