import { mutation } from "./_generated/server"; 
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, imageUrl, email, subscription } = args;
    //check if user already exists
    const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), email)).collect();
    if (user?.length === 0) {
      const userData = {
        name,
        imageUrl,
        email,
        subscription,
      };
    
      const result = await ctx.db.insert('users', userData);
      return result;
    }else {
        return user[0];
    }
  },
}); 