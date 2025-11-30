import type { Schema } from "req-valid-express";

export const itemCreate: Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  picture: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  ProductId: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
};
export const itemUpdate: Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  picture: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  ProductId: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  enabled: {
    type: "boolean"
  }
};


