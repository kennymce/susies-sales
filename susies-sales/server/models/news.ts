import * as mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  newsId: String,
  news: String,
  photos: [
    {
      type: String
    }
  ],
  publishDateTime: { type: Date }
});

newsSchema.pre("save", function(next) {
  // If the newsId is 'new' it's a new record so replace the newsId with an ObjectId
  let self = this;

  if (self.newsId == "new") {
    let newsId = mongoose.Types.ObjectId();
    self.newsId = newsId;
    self._id = newsId;
  }
  next();
});

const News = mongoose.model("News", newsSchema);

export default News;
