const {
  mongo: { ObjectId }
} = require('mongoose');

module.exports = function mongooseArchive(schema) {
  schema.add({ archivedAt: Date });
  schema.add({ isArchived: { type: Boolean, default: false } });

  schema.methods.archive = function archive(cb) {
    this.archivedAt = new Date();
    this.isArchived = true;
    return this.save(cb);
  };

  schema.methods.restore = function restore(cb) {
    this.archivedAt = undefined;
    this.isArchived = false;
    return this.save(cb);
  };

  ['find', 'findOne', 'findOneAndRemove', 'findOneAndUpdate'].forEach((method) => {
    schema.pre(method, function pre() {
      const query = this.getQuery();
      // Never apply archivedAt filter on mongoose.findById
      if (Object.keys(query).length === 1 && ObjectId.isValid(query._id)) {
        return;
      }
      if (query.isArchived === undefined) {
        this.where('isArchived').equals(false);
      }
    });
  });
};
