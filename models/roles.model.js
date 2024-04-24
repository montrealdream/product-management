const mongoose = require('mongoose');

// create shcema
const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        deleted: {
            type: String,
            default: false
        },
        deletedAt: Date,
        permissions: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

// create Model
/**
 * param 3: name's Collection
 */
const Role = mongoose.model('roleSchema', roleSchema, 'roles');

// export
module.exports = Role;