export const userFields: string[] = ['id', 'image', 'bio', 'username'];

export const articleFields: string[] = [
  'id',
  'slug',
  'title',
  'body',
  'description',
  'favorites_count',
  'created_at',
  'updated_at'
];

export const commentFields: string[] = [
  'id',
  'body',
  'created_at',
  'updated_at'
];

export const relationsMaps: any = [
  {
    mapId: 'articleMap',
    idProperty: 'id',
    properties: [...articleFields, 'favorited'],
    associations: [
      {name: 'author', mapId: 'userMap', columnPrefix: 'author_'}
    ],
    collections: [
      {name: 'tagList', mapId: 'tagMap', columnPrefix: 'tag_'}
    ]
  },
  {
    mapId: 'commentMap',
    idProperty: 'id',
    properties: [...commentFields],
    associations: [
      {name: 'author', mapId: 'userMap', columnPrefix: 'author_'}
    ]
  },
  {
    mapId: 'userMap',
    idProperty: 'id',
    properties: [...userFields, 'following']
  },
  {
    mapId: 'tagMap',
    idProperty: 'id',
    properties: ['id', 'name']
  }
];
