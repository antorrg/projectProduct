import type { Schema } from 'req-valid-express'

export const createProductSchema: Schema = {
    title: {
        type: 'string',
        sanitize: { trim: true }
    },
    picture: {
        type: 'string',
        sanitize: { trim: true }
    },
    logo: {
        type: 'string',
        sanitize: { trim: true }
    },
    info_header: {
        type: 'string',
        sanitize: { trim: true }
    },
    info_body: {
        type: 'string',
        sanitize: { trim: true }
    },
    url: {
        type: 'string',
        sanitize: { trim: true }
    },
    items: [
        {
            title: { type: 'string' },
            text: { type: 'string' },
            picture: { type: 'string' }
        }
    ]
}

export const updateProductSchema: Schema = {
    title: {
        type: 'string',
        sanitize: { trim: true }
    },
    picture: {
        type: 'string',
        sanitize: { trim: true }
    },
    logo: {
        type: 'string',
        sanitize: { trim: true }
    },
    info_header: {
        type: 'string',
        sanitize: { trim: true }
    },
    info_body: {
        type: 'string',
        sanitize: { trim: true }
    },
    url: {
        type: 'string',
        sanitize: { trim: true }
    },
    enabled: {
        type: 'boolean'
    }
}

export const queryProductSchema: Schema = {
    page: {
        type: 'int',
        default: 1
    },
    limit: {
        type: 'int',
        default: 10
    },
    searchField: {
        type: 'string',
        default: 'title',
        sanitize: { trim: true }
    },
        search: {
        type: 'string',
        default: '',
        sanitize: { trim: true }
    },
    orderBy: {
        type: 'string',
        default: '',
        sanitize: { trim: true }
    },
    order: {
        type: 'string',
        default: 'ASC',
        sanitize: { trim: true } // 'ASC' | 'DESC'
    }
}
