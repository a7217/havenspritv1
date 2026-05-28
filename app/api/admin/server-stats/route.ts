import { NextResponse } from "next/server";
import os from "os";

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const cpus1 = os.cpus();

    setTimeout(() => {
      const cpus2 = os.cpus();
      let totalIdle = 0, totalTick = 0;

      for (let i = 0; i < cpus1.length; i++) {
        const t1 = cpus1[i].times;
        const t2 = cpus2[i].times;

        const idle = t2.idle - t1.idle;
        const total =
          (t2.user - t1.user) +
          (t2.nice - t1.nice) +
          (t2.sys  - t1.sys)  +
          (t2.irq  - t1.irq)  +
          idle;

        totalIdle += idle;
        totalTick += total;
      }

      const usage = totalTick === 0 ? 0 : ((1 - totalIdle / totalTick) * 100);
      resolve(Math.round(usage));
    }, 200);
  });
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export async function GET() {
  const cpuPercent  = await getCpuUsage();
  const totalMem    = os.totalmem();
  const freeMem     = os.freemem();
  const usedMem     = totalMem - freeMem;
  const memPercent  = Math.round((usedMem / totalMem) * 100);

  return NextResponse.json({
    success: true,
    data: {
      cpu: {
        usage:   cpuPercent,
        cores:   os.cpus().length,
        model:   os.cpus()[0]?.model?.split("@")[0]?.trim() || "Unknown",
      },
      memory: {
        used:    Math.round(usedMem   / 1024 / 1024),
        total:   Math.round(totalMem  / 1024 / 1024),
        percent: memPercent,
      },
      uptime:   formatUptime(os.uptime()),
      platform: os.platform(),
    },
  });
}
