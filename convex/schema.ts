import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_userId", ["userId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_workspaceId_userId", ["workspaceId", "userId"]),
  channels: defineTable({
    name: v.string(),
    description: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("by_workspaceId", ["workspaceId"]),
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspaceId", ["workspaceId"]),
  messages: defineTable({
    body: v.string(),
    file: v.optional(v.id("_storage")),
    filename: v.optional(v.string()),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_memberId", ["memberId"])
    .index("by_channelId", ["channelId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_parentMessageId", ["parentMessageId"])
    .index("by_channelId_parentMessageId_conversationId", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_messageId", ["messageId"])
    .index("by_memberId", ["memberId"]),
});

export default schema;
