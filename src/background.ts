import { index, persistor } from "~store"

persistor.subscribe(() => {
  console.log("State changed with: ", index?.getState())
})