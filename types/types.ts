interface Family {
    name: string
}
export interface State {
    code: string;
    name: string;
}
export const family: Family[] = [
    { name: 'CUERDAS' },
    { name: 'PERCUSIÓN' },
    { name: 'TECLADOS' },
    { name: 'ELECTRÓNICOS' },
    { name: 'VIENTO' },
    { name: 'METALES' },
    { name: 'PERCUSIÓN' },
    { name: 'VOZ' },
]


export const currencies: State[] = [
    { code: 'BOB', name: 'Boliviano' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NZD', name: 'New Zealand Dollar' },
];

export const languages: State[] = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'ar', name: 'العربية' },
    { code: 'it', name: 'Italiano' },
    { code: 'ko', name: '한국어' },
];
export const bookTypes: State[] = [
    { code: 'LIBRO', name: 'LIBRO' },
    { code: 'PARTITURA', name: 'PARTITURA' },
    { code: 'DVD', name: 'DVD' },
    { code: 'CD', name: 'CD' },
    { code: 'CASSETTE', name: 'CASSETTE' },
    { code: 'TESIS', name: 'TESIS' },
    { code: 'REVISTA', name: 'REVISTA' },
    { code: 'EBOOK', name: 'EBOOK' },
    { code: 'AUDIO LIBRO', name: 'AUDIO LIBRO' },
    { code: 'PROYECTOS', name: 'PROYECTOS' },
    { code: 'OTRO', name: 'OTRO' },
];