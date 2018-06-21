module.exports = {
    "env": {
        "es6": true
    },
    "extends": [
        "airbnb-base",
        "eslint:recommended",
        "plugin:prettier/recommended"
    ],
    "globals": {
        "document": true
    },
    "rules": {
        "prettier/prettier": [
            "error",
            {
                "singleQuote": true,
                "trailingComma": "es5"
            }
        ]
    }
};