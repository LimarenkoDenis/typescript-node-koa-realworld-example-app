"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = ['id', 'image', 'bio', 'username'];
exports.articleFields = [
    'id',
    'slug',
    'title',
    'body',
    'description',
    'favorites_count',
    'created_at',
    'updated_at'
];
exports.commentFields = [
    'id',
    'body',
    'created_at',
    'updated_at'
];
exports.relationsMaps = [
    {
        mapId: 'articleMap',
        idProperty: 'id',
        properties: [...exports.articleFields, 'favorited'],
        associations: [
            { name: 'author', mapId: 'userMap', columnPrefix: 'author_' }
        ],
        collections: [
            { name: 'tagList', mapId: 'tagMap', columnPrefix: 'tag_' }
        ]
    },
    {
        mapId: 'commentMap',
        idProperty: 'id',
        properties: [...exports.commentFields],
        associations: [
            { name: 'author', mapId: 'userMap', columnPrefix: 'author_' }
        ]
    },
    {
        mapId: 'userMap',
        idProperty: 'id',
        properties: [...exports.userFields, 'following']
    },
    {
        mapId: 'tagMap',
        idProperty: 'id',
        properties: ['id', 'name']
    }
];
// exports.relationsMaps = relationsMaps
// exports.userFields = userFields
// exports.articleFields = articleFields
// exports.commentFields = commentFields
//# sourceMappingURL=relations-map.js.map