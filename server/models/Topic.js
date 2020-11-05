const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "question"
    }
  ],
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "answer"
    }
  ],
  imageUrl: {
    type: String
  }
});

TopicSchema.statics.findData = function (topicId, type) {
  if (type === "questions") {
    return this.findById(topicId).populate(`${type}`).then(
      topic => topic[type].sort((question1, question2) => {
        if (question1.answers.length < question2.answers.length) {
          return 1
        } else if (question1.answers.length > question2.answers.length) {
          return -1
        } else {
          return 0
        }
      })
    ).catch(err => null)
  } else {
    return this.findById(topicId)
      .populate(`${type}`)
      .then(topic => topic[type])
      .catch(err => null)
  }
};

TopicSchema.statics.addUser = (topicId, userId) => {
  const Topic = mongoose.model("topic");

  return Topic.findById(topicId).then(topic => {
    if (!topic.followers.includes(userId)) {
      topic.followers.push(userId);
      return topic.save()
    } else {
      topic.followers.pull(userId)
      return topic.save();
    }
  });
};

TopicSchema.statics.addQuestion = (questionId, topicId) => {
  const Topic = mongoose.model("topic");

  return Topic.findById(topicId).then(topic => {
    topic.questions.push(questionId);
    return topic.save()
  });
};

TopicSchema.statics.findMatches = (query) => {
  const Topic = mongoose.model("topic");
  const longestWord = findLongestWord(query);
  console.log(longestWord);
  return Topic.find({ name: { $regex: new RegExp(longestWord, 'i') } });
}

const findLongestWord = (sentence) => {
  let words = sentence.split(" ");
  let longestWord = words[0];
  for (i = 0; i < words.length; i++) {
    let currentWord = words[i];
    if (currentWord.length > longestWord.length) {
      longestWord = currentWord;
    }
  }
  return longestWord;
}
module.exports = mongoose.model("topic", TopicSchema);