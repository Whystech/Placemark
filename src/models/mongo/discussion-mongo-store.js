import { Discussion } from "./discussion.js";

export const discussionMongoStore = {
  async getAllDiscussions() {
    const discussions = await Discussion.find().lean();
    return discussions;
  },

  async addDiscussion(discussion) {
    const newDiscussion = new Discussion(discussion);
    const discussionObj = await newDiscussion.save();
    return this.getDiscussionById(discussionObj._id);
  },

  async getDiscussionsByUserId(id) {
    const discussions = await Discussion.find({ userid: id }).lean();
    return discussions;
  },

  async getDiscussionById(id) {
    if (id) {
      const discussion = await Discussion.findOne({ _id: id }).lean();
      return discussion;
    }
    return null;
  },

  async deleteDiscussion(id) {
    try {
      await Discussion.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllDiscussions() {
    await Discussion.deleteMany({});
  },

  async getDiscussionsByType(type) {
    const discussions = await Discussion.find({ type: type }).lean();
    return discussions;
  },

  async updateDiscussion(discussion, updatedDiscussion) {
    const discussionDoc = await Discussion.findOne({ _id: discussion._id });
    discussionDoc.title = updatedDiscussion.title;
    discussionDoc.description = updatedDiscussion.description;
    discussionDoc.isEdited = true;
    await discussionDoc.save();
  },

  async addDiscussionComment(id, comment) {
    const discussionDoc = await Discussion.findOne({ _id: id })
    discussionDoc.comments.push(comment)
    await discussionDoc.save()
  },

async removeDiscussionComment(discussionId, commentId) {
  await Discussion.updateOne(
    { _id: discussionId },
    { $pull: { comments: { _id: commentId } } }
  );
}
};
