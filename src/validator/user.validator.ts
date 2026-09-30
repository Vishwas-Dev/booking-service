import { z } from "zod/v3";

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().int(),
});
// TEST ..
// const result = userSchema.safeParse({
//     name: "Vishal",
//     email: "aakash@gmail.com",
//     age: 25,
//   });
  
//   console.log(result);