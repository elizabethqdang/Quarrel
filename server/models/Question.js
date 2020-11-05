const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    question: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    link: {
        type: String
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "answer"
        }
    ],
    topics: [
        {
            type: Schema.Types.ObjectId,
            ref: "topic"
        }
    ]
});

QuestionSchema.statics.findMatches = (question) => {
    const Question = mongoose.model("question");
    return Question.find({ question: { $regex: new RegExp(question, 'i') } });
};

QuestionSchema.statics.findRelatedQuestions = (questionId) => {
    const Question = mongoose.model("question");
    return Question.findById(questionId)
        .then(foundQuestion => {
            const questionText = findLongestWord(foundQuestion.question)
            return Question.find({ question: { $regex: new RegExp(questionText, 'i') } });
        });
}

QuestionSchema.statics.addTopic = (questionId, topicId) => {
    const Question = mongoose.model("question");

    return Question.findById(questionId).then(question => {
        question.topics.push(topicId);
        return question.save()
    });
};

const findLongestWord = (sentence) => {
    let words = sentence.slice(0, -1).split(" ");
    let longestWord = words[0];
    for (i = 0; i < words.length; i++) {
        let currentWord = words[i];
        if (currentWord.length > longestWord.length) {
            longestWord = currentWord;
        }
    }
    return longestWord;
};

module.exports = mongoose.model("question", QuestionSchema);