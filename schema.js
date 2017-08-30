const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const axios = require('axios');
// // hard code data
// const customers = [
//   { id: '1', name: 'Beace Lee', age: 23, email: '121231@qq.com'},
//   { id: '2', name: 'Beace Lee2', age: 12, email: '1223@qq.com'},
//   { id: '3', name: 'Beace Lee3', age: 22, email: '122322222@qq.com'},
// ];



// customer Type
const CustomerType = new GraphQLObjectType({
  name: 'CustomerType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  })
});

// root query
const RootQuery = new  GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id === args.id) {
        //     return customers[i];
        //   }
        // }
        return axios.get('http://localhost:3000/customers/' + args.id)
        .then(response => response.data);
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers').then(res => res.data);
      }
    }
  }
});


// mutaition query
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/customers/"+args.id)
          .then(res => res.data);
      }
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        age: { type: GraphQLInt},
      },
      resolve(parentValue, args) {
        return axios.patch("http://localhost:3000/customers/" + args.id, args).then(res => res.data);
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});