import express from "express"
import { execute, subscribe  } from 'graphql'
import { ApolloServer } from "apollo-server-express"
import { resolvers } from "../data/resolvers.graphql"
import { typeDefs } from "../data/schema.graphql"
import { PORT } from "../config/config"
import { createServer } from "http"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { SubscriptionServer } from "subscriptions-transport-ws"

const app = express()
const httpServer = createServer(app)


const schema = makeExecutableSchema({ typeDefs, resolvers })
const server = new ApolloServer({
  schema,
})
server.start()
server.applyMiddleware({ app })
SubscriptionServer.create(
  { schema, execute, subscribe },
  { server: httpServer, path: server.graphqlPath }
)
app.get("/", (req, res) => {
  console.log("Apollo GraphQL Express server is ready")
})


httpServer.listen(PORT, () => {
  console.log(
    `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
  )
})
// app.listen({ port: PORT }, () => {
//     console.log(`Server is running at http://localhost:7070${server.graphqlPath}`);
// });
