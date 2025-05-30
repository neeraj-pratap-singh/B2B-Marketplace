import mongoose, { Schema, Document } from 'mongoose';
import { Listing as IListing } from '@/types';

// Mongoose document interface
export interface ListingDocument extends Omit<IListing, '_id'>, Document {}

// Location Schema
const LocationSchema = new Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: 'India',
    trim: true,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { _id: false });

// Supplier Schema
const SupplierSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
}, { _id: false });

// Inventory Schema
const InventorySchema = new Schema({
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  moq: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { _id: false });

// Listing Schema
const ListingSchema = new Schema<ListingDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP'],
  },
  location: {
    type: LocationSchema,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  attributes: {
    type: Map,
    of: Schema.Types.Mixed,
    default: new Map(),
  },
  images: [{
    type: String,
    trim: true,
  }],
  supplier: {
    type: SupplierSchema,
    required: true,
  },
  inventory: {
    type: InventorySchema,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'expired'],
    default: 'active',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  inquiries: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      ret.categoryId = ret.categoryId.toString();
      if (ret.attributes) {
        ret.attributes = Object.fromEntries(ret.attributes);
      }
      return ret;
    },
  },
});

// Indexes for performance
ListingSchema.index({ status: 1, featured: -1, createdAt: -1 });
ListingSchema.index({ categoryId: 1, status: 1, price: 1 });
ListingSchema.index({ 'location.city': 1, 'location.state': 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ views: -1 });
ListingSchema.index({ featured: -1, createdAt: -1 });

// Text search index
ListingSchema.index({ 
  title: 'text', 
  description: 'text',
  'supplier.name': 'text'
}, {
  weights: {
    title: 10,
    description: 5,
    'supplier.name': 3,
  },
  name: 'listing_text_index'
});

// Compound indexes for common queries
ListingSchema.index({ categoryId: 1, 'attributes.brand': 1, price: 1 });
ListingSchema.index({ categoryId: 1, 'attributes.size': 1, status: 1 });
ListingSchema.index({ 'location.city': 1, categoryId: 1, status: 1 });

// Wildcard index for dynamic attributes
ListingSchema.index({ 'attributes.$**': 1 });

// Static methods
ListingSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

ListingSchema.statics.findByCategory = function(categoryId: string) {
  return this.find({ categoryId, status: 'active' });
};

ListingSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ status: 'active', featured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

ListingSchema.statics.findByPriceRange = function(min: number, max: number) {
  return this.find({ 
    status: 'active',
    price: { $gte: min, $lte: max }
  });
};

ListingSchema.statics.findByLocation = function(city: string, state?: string) {
  const query: any = { 
    status: 'active',
    'location.city': new RegExp(city, 'i')
  };
  
  if (state) {
    query['location.state'] = new RegExp(state, 'i');
  }
  
  return this.find(query);
};

// Instance methods
ListingSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

ListingSchema.methods.incrementInquiries = function() {
  this.inquiries += 1;
  return this.save();
};

ListingSchema.methods.isAvailable = function() {
  return this.status === 'active' && this.inventory.quantity > 0;
};

ListingSchema.methods.getFormattedPrice = function() {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(this.price);
};

// Pre-save middleware
ListingSchema.pre('save', function(next) {
  // Ensure at least one image
  if (this.images.length === 0) {
    this.images.push('/placeholder-product.jpg');
  }
  
  // Auto-expire old listings (optional)
  if (this.isNew && !this.featured) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90); // 90 days from creation
    // You could add an expiryDate field if needed
  }
  
  next();
});

// Export model
const Listing = mongoose.models.Listing || mongoose.model<ListingDocument>('Listing', ListingSchema);

export default Listing; 