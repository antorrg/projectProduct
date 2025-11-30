import type { Schema } from 'req-valid-express'

export const update: Schema = {
  email: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  password: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  nickname: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  name: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  picture: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  enabled: {
    type: 'boolean',
    default: true
  }
}

export const create: Schema = {
  email: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  password: {
    type: 'string',
    sanitize: {
      trim: true
    }
  }
}
