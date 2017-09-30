export const tags = {
  async get (ctx) {
    const tags = await ctx.app.db('tags').pluck('name')

    ctx.body = {tags}
  }
}
