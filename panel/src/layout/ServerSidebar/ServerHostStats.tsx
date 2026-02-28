import { useHostStats } from '@/hooks/status';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowDownIcon, ArrowUpIcon, CpuIcon, MemoryStickIcon } from 'lucide-react';


const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
    return `${Math.round(bytes)} B/s`;
};

const usageColor = (pct: number) => {
    if (pct >= 90) return 'bg-destructive';
    if (pct >= 70) return 'bg-warning';
    return 'bg-success';
};

type StatBarProps = {
    label: string;
    icon: React.ReactNode;
    value: string;
    pct: number;
    tooltip?: string;
};

function StatBar({ label, icon, value, pct, tooltip }: StatBarProps) {
    const inner = (
        <div className='space-y-0.5'>
            <div className='flex items-center justify-between gap-1 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                    {icon}
                    {label}
                </span>
                <span className='font-mono font-semibold text-foreground'>{value}</span>
            </div>
            <div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
                <div
                    className={cn('h-full rounded-full transition-all duration-700', usageColor(pct))}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                />
            </div>
        </div>
    );

    if (!tooltip) return inner;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className='cursor-default'>{inner}</div>
            </TooltipTrigger>
            <TooltipContent side='right'>
                <p className='text-xs'>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}


export default function ServerHostStats() {
    const hostStats = useHostStats();

    if (!hostStats) return null;

    const { cpu, memory, network } = hostStats;
    const memUsed = memory.used.toFixed(1);
    const memTotal = memory.total.toFixed(1);

    return (
        <div className='space-y-2'>
            <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                Host Resources
            </p>

            <StatBar
                label='CPU'
                icon={<CpuIcon className='size-3' />}
                value={`${cpu.usage}%`}
                pct={cpu.usage}
            />

            <StatBar
                label='RAM'
                icon={<MemoryStickIcon className='size-3' />}
                value={`${memUsed} / ${memTotal} GB`}
                pct={memory.usage}
                tooltip={`Memory usage: ${memory.usage}%`}
            />

            <div className='flex items-center justify-between gap-2 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                    <ArrowDownIcon className='size-3 text-success' />
                    <span className='font-mono font-semibold text-foreground'>
                        {formatBytes(network.rx_sec)}
                    </span>
                </span>
                <span className='flex items-center gap-1'>
                    <ArrowUpIcon className='size-3 text-warning' />
                    <span className='font-mono font-semibold text-foreground'>
                        {formatBytes(network.tx_sec)}
                    </span>
                </span>
            </div>
        </div>
    );
}
