const modulename = 'ExternalApiHelper';
import got from '@lib/got';
import consoleFactory from '@lib/console';
const console = consoleFactory(modulename);


export type ExternalApiActionType = 'ban' | 'unban';

export type ExternalApiNotifyParams = {
    type: ExternalApiActionType;
    actionId?: string;
    identifiers: string[];
    playerName: string | false;
    expiration: number | false;
    durationInput?: string;
    bannedAt?: number;
    reason: string;
    author: string;
};


/**
 * Notifies the configured external API endpoint about a ban/unban action.
 * Silently skips if apiEndpoint or apiKey is not configured.
 */
export const notifyExternalApi = async (params: ExternalApiNotifyParams) => {
    const apiEndpoint = txConfig.general.apiEndpoint?.trim();
    const apiKey = txConfig.general.apiKey?.trim();
    if (!apiEndpoint || !apiKey) return;

    const jsonBody = {
        type: params.type,
        actionId: params.actionId ?? null,
        identifiers: params.identifiers,
        playerName: params.playerName || '',
        reason: params.reason,
        author: params.author,
        expiration: params.expiration === false ? null : params.expiration,
        duration: params.durationInput ?? null,
        bannedAt: params.bannedAt ?? null,
    };

    try {
        await got.post(`${apiEndpoint}/api/adm-cms/txadmin-action`, {
            json: jsonBody,
            headers: { 'X-Admin-Key': apiKey },
            timeout: { request: 5000 },
        });
    } catch (error) {
        console.warn(`Failed to notify external API (${params.type}): ${(error as Error).message}`);
    }
};
