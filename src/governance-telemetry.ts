// Beast-System-3-Telemetry/src/governance-telemetry.ts

import { ResolutionOutcome } from "../resolution/resolution-outcome";
import { LUCRBinding } from "../lucr/lucr-governance-binding";
import { EnforcementReport } from "../constitution/constitutional-enforcement";
import { InfluencePacket } from "../civicgraph/civicgraph-influence-router";
import { RuntimeSignal } from "../civicgraph/civicgraph-runtime";
import { GlobalDirective } from "../global/global-governance-orchestrator";
import { MinistryAction } from "../ministries/ministry-adapter";
import { CompliancePacket } from "../global/global-compliance-router";
import { KernelFrame } from "../kernel/kernel-runtime";
import { SynchronizedState } from "../civicgraph/civicgraph-state-synchronizer";

export interface TelemetryRecord {
  id: string;
  identityId: string;
  metrics: Record<string, number>;
  tags: Record<string, string>;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export class GovernanceTelemetryEngine {
  private records: TelemetryRecord[] = [];

  public capture(
    resolution: ResolutionOutcome,
    lucr: LUCRBinding,
    constitution: EnforcementReport,
    influence: InfluencePacket,
    runtime: RuntimeSignal,
    global: GlobalDirective,
    ministry: MinistryAction,
    compliance: CompliancePacket,
    sync: SynchronizedState,
    kernel: KernelFrame
  ): TelemetryRecord {
    const metrics = this.computeMetrics(
      resolution,
      lucr,
      constitution,
      influence,
      runtime,
      global,
      ministry,
      compliance,
      sync,
      kernel
    );

    const tags = {
      route: influence.route,
      lucrLevel: lucr.level,
      compliance: compliance.route,
      ministry: ministry.ministry,
    };

    const record: TelemetryRecord = {
      id: `telemetry_${Date.now()}`,
      identityId: kernel.identityId,
      metrics,
      tags,
      createdAt: new Date().toISOString(),
      metadata: {
        resolution,
        lucr,
        constitution,
        influence,
        runtime,
        global,
        ministry,
        compliance,
        sync,
        kernel,
      },
    };

    this.records.push(record);
    return record;
  }

  private computeMetrics(
    resolution: ResolutionOutcome,
    lucr: LUCRBinding,
    constitution: EnforcementReport,
    influence: InfluencePacket,
    runtime: RuntimeSignal,
    global: GlobalDirective,
    ministry: MinistryAction,
    compliance: CompliancePacket,
    sync: SynchronizedState,
    kernel: KernelFrame
  ): Record<string, number> {
    return {
      finalScore: resolution.finalScore,
      lucrScore: resolution.lucrScore,
      traumaScore: resolution.traumaScore,
      influenceWeight: influence.weight,
      adjustedInfluence: runtime.adjustedWeight,
      globalPriority: global.priority,
      ministryPriority: ministry.priority,
      complianceScore: compliance.score,
      trust: sync.trust,
      influence: sync.influence,
      reputation: sync.reputation,
      kernelFrames: kernel ? 1 : 0,
    };
  }

  public getRecent(limit = 20): TelemetryRecord[] {
    return this.records.slice(-limit);
  }

  public summarize(record: TelemetryRecord): string {
    return `Telemetry ${record.id}: identity=${record.identityId}, globalPriority=${record.metrics.globalPriority.toFixed(
      2
    )}, compliance=${record.tags.compliance}`;
  }
}

export function createGovernanceTelemetryEngine(): GovernanceTelemetryEngine {
  return new GovernanceTelemetryEngine();
}
