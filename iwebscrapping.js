const mongoose = require('mongoose');

// Define the schema for the "students" collection
const studentSchema = new mongoose.Schema({
  name: String,
  addressId: mongoose.Schema.Types.ObjectId  // Reference to the address document
});

// Define the schema for the "addresses" collection
const addressSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  street: String,
  city: String,
  state: String,
  // Other address fields
});

// Create models from the schemas
const Student = mongoose.model('Student', studentSchema);
const Address = mongoose.model('Address', addressSchema);

// Now, perform the lookup using the aggregation framework
Student.aggregate([
  {
    $match: { name: 'John' } // Replace with your search criteria
  },
  {
    $lookup: {
      from: 'addresses',  // The collection name to join with
      localField: 'addressId',  // Field in the "students" collection
      foreignField: '_id',  // Field in the "addresses" collection
      as: 'address'  // Name of the field that will hold the joined address document
    }
  },
  {
    $unwind: '$address' // Unwind the "address" array created by $lookup
  }
])
.exec((err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  
  if (result.length > 0) {
    const student = result[0];
    console.log('Student:', student.name);
    console.log('Address:', student.address);
  } else {
    console.log('Student not found.');
  }
});
