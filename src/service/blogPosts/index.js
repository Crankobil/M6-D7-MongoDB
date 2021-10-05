import express from "express"
import createHttpError from "http-errors"
import blogPostsModel from "./schema.js"

const blogPostsRouter = express.Router()

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new blogPostsModel(req.body) // here happens validation of the req.body, if it is not ok Mongoose will throw a "ValidationError"
    const { _id } = await newUser.save() // this is where the interaction with the db/collection happens

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const users = await blogPostsModel.find()

    res.send(users)
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPostsId = req.params.blogPostsId

    const user = await blogPostsModel.findById(blogPostsId) // similar to findOne, but findOne expects to receive a query as parameter

    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${blogPostsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPostsId = req.params.blogPostsId
    const modifiedUser = await blogPostsModel.findByIdAndUpdate(blogPostsId, req.body, {
      new: true, // returns the modified user
    })

    if (modifiedUser) {
      res.send(modifiedUser)
    } else {
      next(createHttpError(404, `User with id ${blogPostsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPostsId = req.params.blogPostsId

    const deletedUser = await blogPostsModel.findByIdAndDelete(blogPostsId)

    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${blogPostsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter