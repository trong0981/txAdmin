import { z } from "zod";
import { typeDefinedConfig } from "./utils";
import { SYM_FIXER_DEFAULT } from "@lib/symbols";
import localeMap from "@shared/localeMap";


const serverName = typeDefinedConfig({
    name: 'Server Name',
    default: 'change-me',
    validator: z.string().min(1).max(18),
    fixer: SYM_FIXER_DEFAULT,
});

const language = typeDefinedConfig({
    name: 'Language',
    default: 'en',
    validator: z.string().min(2).refine(
        (value) => (value === 'custom' || localeMap[value] !== undefined),
        (value) => ({ message: `Invalid language code \`${value ?? '??'}\`.` }),
    ),
    fixer: SYM_FIXER_DEFAULT,
});

const apiEndpoint = typeDefinedConfig({
    name: 'API Endpoint',
    default: '',
    validator: z.string().refine(
        (value) => value === '' || z.string().url().safeParse(value).success,
        { message: 'API Endpoint must be a valid URL or empty.' },
    ),
    fixer: SYM_FIXER_DEFAULT,
});

const apiKey = typeDefinedConfig({
    name: 'API Key',
    default: '',
    validator: z.string(),
    fixer: SYM_FIXER_DEFAULT,
});


export default {
    serverName,
    language,
    apiEndpoint,
    apiKey,
} as const;
