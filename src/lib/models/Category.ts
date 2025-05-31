import mongoose, { Schema, Document } from 'mongoose';
import { Category as ICategory, AttributeSchema } from '@/types';

// Mongoose document interface
export interface CategoryDocument extends Omit<ICategory, '_id'>, Document {}

// Attribute Definition Schema
const AttributeDefinitionSchema = new Schema({
  type: {
    type: String,
    enum: ['enum', 'range', 'boolean', 'text', 'number'],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  values: [{
    type: String,
  }],
  unit: String,
  min: Number,
  max: Number,
  required: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  filterable: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

// Category Schema
const CategorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  attributeSchema: {
    type: Map,
    of: AttributeDefinitionSchema,
    default: new Map(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.attributeSchema) {
        ret.attributeSchema = Object.fromEntries(ret.attributeSchema);
      }
      return ret;
    },
  },
});

// Indexes
CategorySchema.index({ isActive: 1, sortOrder: 1 });
CategorySchema.index({ name: 'text', description: 'text' });

// Static methods
CategorySchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug, isActive: true });
};

CategorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Instance methods
CategorySchema.methods.getAttributeKeys = function() {
  return Array.from(this.attributeSchema.keys());
};

CategorySchema.methods.getFilterableAttributes = function() {
  const attributes: AttributeSchema = {};
  for (const [key, value] of this.attributeSchema.entries()) {
    if (value.filterable !== false) {
      attributes[key] = value;
    }
  }
  return attributes;
};

// Pre-save middleware
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Export model
const Category = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);

export default Category; 